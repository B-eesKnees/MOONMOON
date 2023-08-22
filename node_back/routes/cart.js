const express = require("express");
const db = require("../db"); //db연결

const router = express.Router();
//결제버튼
router.post("/", async (req, res) => {
    // console.log(req.body);
    const ORDER_USEREMAIL = req.body.email;
    const testdata = req.body.books_info;

    const paymentDate = {
        ORDER_USER_EMAIL: req.body.email,
        ORDER_PAY: req.body.total_pay,
        ORDER_ADDPOINT: req.body.total_point,
        ORDER_COST: req.body.fee,
    };

    db.query(`insert into moonmoon.order set ?`, paymentDate, (err, results) => {
        if (err) {
            res.send({
                // 에러 발생 시
                code: 200,
                failed: "error occurred",
                error: err,
            });
        } else {
            const order_id = results.insertId;
            const orderItems = testdata.map((item) => [order_id, item.ORDERITEM_BOOKID, item.ORDERITEM_CNT, item.ORDERITEM_PRICE, item.ORDERITEM_POINT]);
            console.log(orderItems);
            db.query(`INSERT INTO orderItem (ORDERITEM_ORDER_ID, ORDERITEM_BOOK_ID, ORDERITEM_CNT, ORDERITEM_PRICE, ORDERITEM_POINT) VALUES ?`, [orderItems], (err, result) => {
                if (err) {
                    res.status(401).send({
                        // 에러 발생 시
                        code: 200,
                        failed: "error occurred",
                        error: err,
                    });
                } else {
                    res.status(200).send({
                        message: "성공",
                        orderID: order_id,
                    });
                }
            });
        }
    });
});
//장바구니에 들어간거 확인
router.post("/getInfo", async (req, res) => {
    const email = req.body.email;

    db.query(
        `select b.BOOK_COVER as img, b.BOOK_PRICE as price, b.BOOK_POINT as point, c.CART_COUNT as quantity, b.BOOK_ID as book_no, b.BOOK_TITLE as title
        from CART c join book b on c.CART_BOOK_ID = b.BOOK_ID
        where c.CART_USER_EMAIL = ?`,
        email,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});
//삭제기능
router.get("/deleteCartBook", async (req, res) => {
    const bookId = req.query.bookid;
    console.log(bookId);

    db.query(`delete from cart where CART_BOOK_ID = ?`, bookId, (err) => {
        if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send("삭제성공");
        }
    });
});
//장바구니 수량 체크
router.post("/countCart", async (req, res) => {
    const userEmail = req.body.email;

    db.query(`select count(*) as cartNum from cart where CART_USER_EMAIL = ?`, userEmail, (err, result) => {
        if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send(result[0].cartNum.toString());
        }
    });
});
router.post("/delete", async (req, res) => {
    const bookidArr = req.body.bookid;

    db.query(`delete from cart where CART_BOOK_ID in (?)`, [bookidArr], (err, result) => {
        if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send("삭제완료");
        }
    });
});

router.post("/allDelete", async (req, res) => {
    const userEmail = req.body.email;

    db.query(`delete from cart where CART_USER_EMAIL = ?`, userEmail, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send("결제완료");
        }
    });
});

module.exports = router;

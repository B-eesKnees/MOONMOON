const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    //주문한 책 가져오는거
    const num = req.query.cartNum; // URL 쿼리 파라미터에서 cartNum 추출
    console.log(num);

    db.query(`select b.BOOK_TITLE from orderItem o join book b on b.BOOK_ID = o.ORDERITEM_BOOK_ID where o.ORDERITEM_ORDER_ID = ?`, num, (err, results) => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send(results);
        }
    });
});

router.post("/info", async (req, res) => {
    const num = req.body.payid;
    console.log(num);

    db.query(
        `select ORDER_PAY, ORDER_COST, (ORDER_PAY - ORDER_COST + ORDER_COUPON + ORDER_USEPOINT) as price ,ORDER_COUPON, ORDER_USEPOINT, ORDER_PAYMETHOD, date_format(ORDER_PAYDATE, '%Y-%m-%d %H:%i') as date
        from moonmoon.order 
        where ORDER_ID = ?;`,
        num,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

module.exports = router;

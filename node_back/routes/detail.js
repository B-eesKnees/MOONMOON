const express = require("express");
const db = require("../db"); //db연결
const router = express.Router();

//성공
router.get("/", async (req, res) => {
    //책 정보 보내기
    const bookId = req.query.bookNum;
    const id = parseInt(bookId);

    db.query(`select * from book where BOOK_ID = ?`, id, (err, result) => {
        if (err) {
            res.send(err).status(200);
        } else {
            res.status(200).send(result);
        }
    });
});

//흠
router.post("/gotoPay", async (req, res) => {
    //결제 기능
    const ORDERITEM_BOOK_ID = req.body.bookId; //책 고유번호
    const ORDERITEM_CNT = req.body.bookNum; //책 수량
    const paymentDate = {
        ORDER_USER_EMAIL: req.body.email, //로그인 유저 이메일
        ORDER_PAY: req.body.total_pay, //결제금액
        ORDER_ADDPOINT: req.body.total_point, //얻는 포인트
        ORDER_COST: req.body.fee, //배송비
    };
    const point = req.body.point;
    const price = req.body.price;

    db.query(`insert into moonmoon.order set ?`, paymentDate, (err, result) => {
        if (err) {
            res.send(err).status(200);
        } else {
            const ORDERITEM_ORDER_ID = result.insertId;

            const orderItem_info = {
                ORDERITEM_ORDER_ID: result.insertId,
                ORDERITEM_BOOK_ID: ORDERITEM_BOOK_ID,
                ORDERITEM_CNT: ORDERITEM_CNT,
                ORDERITEM_PRICE: price,
                ORDERITEM_POINT: point,
            };

            db.query(
                `insert into orderitem set ?`,
                orderItem_info,
                (err, result) => {
                    if (err) {
                        res.send(err).status(200);
                    } else {
                        res.status(200).send("ok");
                    }
                }
            );
        }
    });
});

//성공
router.post("/gotoCart", async (req, res) => {
    //장바구니에 추가
    const gotoCartInfo = {
        CART_USER_EMAIL: req.body.email,
        //유저 이메일
        CART_BOOK_ID: req.body.bookId,
        //책 고유번호
        CART_COUNT: 1,
        //장바구니 수량 기본 1개
    };

    db.query(`insert into cart set ?`, gotoCartInfo, (err, result) => {
        if (err) {
            res.send(err).status(200);
        } else {
            res.status(200).send("ok");
        }
    });
});
//성공
router.post("/likeOrDislike", async (req, res) => {
    //좋아요 싫어요 기능
    const LIKE_USER_EMAIL = req.body.email;
    const LIKE_BOOK_ID = req.body.bookId;
    const likeInfo = {
        LIKE_USER_EMAIL: req.body.email,
        //유저 이메일
        LIKE_BOOK_ID: req.body.bookId,
        //책 고유번호
    };

    db.query(
        `select * from LIKEDBOOK where LIKE_USER_EMAIL = ? and LIKE_BOOK_ID = ?`,
        [LIKE_USER_EMAIL, LIKE_BOOK_ID],
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                if (result.length == 0) {
                    db.query(
                        `insert into LIKEDBOOK set ?`,
                        likeInfo,
                        (err, result) => {
                            if (err) {
                                res.send(err).status(200);
                            } else {
                                res.status(200).send("ok");
                            }
                        }
                    );
                } else {
                    db.query(
                        `delete from LIKEDBOOK where LIKE_USER_EMAIL = ? and LIKE_BOOK_ID = ?`,
                        [LIKE_USER_EMAIL, LIKE_BOOK_ID],
                        (err, result) => {
                            if (err) {
                                res.send(err).status(200);
                            } else {
                                res.status(200).send("ok");
                            }
                        }
                    );
                }
            }
        }
    );
});
//성공
router.post("/checkLike", async (req, res) => {
    //내가 좋아요했는지 안했는지 기능
    const LIKE_BOOK_ID = req.body.bookId;
    const LIKE_USER_EMAIL = req.body.email;

    db.query(
        `select * from LIKEDBOOK where LIKE_USER_EMAIL = ? and LIKE_BOOK_ID =?`,
        [LIKE_USER_EMAIL, LIKE_BOOK_ID],
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                if (result.length > 0) {
                    res.status(200).send("등록된 책입니다.");
                } else {
                    res.status(200).send("등록 안된 책입니다.");
                }
            }
        }
    );
});
//성공
router.post("/gotoRecent", async (req, res) => {
    //최근 본 책 기능
    const REC_USER_EMAIL = req.body.email;
    const REC_BOOK_ID = req.body.bookId;
    const REC_VIEWED_AT = new Date();
    db.query(
        `select * from RECENTBOOK where REC_USER_EMAIL = ? and REC_BOOK_ID = ?`,
        [REC_USER_EMAIL, REC_BOOK_ID],
        (err, result) => {
            if (err) {
                res.send(err).status(200);
            } else {
                if (result.length > 0) {
                    db.query(
                        `update RECENTBOOK set REC_VIEWED_AT = ? where REC_USER_EMAIL = ? and REC_BOOK_ID = ?`,
                        [REC_VIEWED_AT, REC_USER_EMAIL, REC_BOOK_ID],
                        (err, result) => {
                            if (err) {
                                res.send(err).status(200);
                            } else {
                                res.status(200).send("ok");
                            }
                        }
                    );
                } else {
                    db.query(
                        `INSERT INTO RECENTBOOK (REC_USER_EMAIL, REC_BOOK_ID, REC_VIEWED_AT) VALUES (?, ?, ?)`,
                        [REC_USER_EMAIL, REC_BOOK_ID, REC_VIEWED_AT],
                        (err, result) => {
                            if (err) {
                                res.send(err).status(200);
                            } else {
                                res.status(200).send("ok");
                            }
                        }
                    );
                }
            }
        }
    );
});

module.exports = router;
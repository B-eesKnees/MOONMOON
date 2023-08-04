const express = require("express");
const db = require("../db"); //db연결

const router = express.Router();

router.post("/getBestBook", async (req, res) => {
    //베스트 셀러 리스트
    db.query(
        `select * from books order by BOOK_SALESPOINT DESC`,
        (err, result) => {
            if (err) {
                res.send(err).status(400);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

router.post("/getNewestBook", async (req, res) => {
    //신책 리스트
    db.query(`select * from books order by BOOK_PUBDATE ASC`, (err, result) => {
        if (err) {
            res.send(err).status(400);
        } else {
            res.status(200).send(result);
        }
    });
});

router.post("/getCart", async (req, res) => {
    //장바구니 담긴 수 계산
    const email = req.body.email;

    db.query(
        `select count(*) from cart where CART_USER_EMAIL = ?`,
        email,
        (err, result) => {
            if (err) {
                res.send(err).status(400);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

module.exports = router;

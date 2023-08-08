const express = require("express");
const db = require("../db"); //db연결
const router = express.Router();

//알라딘 판매포인트 순으로 정렬
router.post(`/getBest`, async (req, res) => {
    db.query(
        `select b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, b.BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
        group by b.BOOK_ID
        order by b.BOOK_SALESPOINT;`,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

//신상품 순으로 정렬
router.post(`/getNew`, async (req, res) => {
    db.query(
        `select b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, b.BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
        group by b.BOOK_ID
        order by b.BOOK_PUBDATE;`,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});
//장바구니로 이동 기능
// http://localhost:3000/detail/gotoCart

//좋아요(찜하기) 추가/삭제 기능
// http://localhost:3000/detail/likeOrDislike

//좋아요 한건지 확인 기능
router.post("/checkLikeList", async (req, res) => {
    const email = req.body.email;

    db.query(
        `select * from likedbook where LIKE_USER_EMAIL = ?`,
        email,
        (err, results) => {
            if (err) {
                res.status(200).send(err);
            } else {
                const likelist = results.map((like) => like.LIKE_BOOK_ID);

                res.status(200).send(likelist);
            }
        }
    );
});

//결제 기능
// http://localhost:3000/detail/gotoPay

module.exports = router;

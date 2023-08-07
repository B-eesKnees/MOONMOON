const express = require("express");
const db = require("../db"); //db연결
const router = express.Router();

//알라딘 판매포인트 순으로 정렬
router.post(`/getBest`, async (req, res) => {
    db.query(
        `select b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, b.BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
        group by b.BOOK_ID;`,
        (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

//신상품 순으로 정렬

module.exports = router;

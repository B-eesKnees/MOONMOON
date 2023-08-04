const express = require("express");
const db = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
    //주문한 책 가져오는거
    const num = req.query.cartNum; // URL 쿼리 파라미터에서 cartNum 추출
    console.log(num);

    db.query(
        `select b.BOOK_TITLE from orderItem o join books b on b.BOOK_ID = o.ORDERITEM_BOOKID where o.ORDERITEM_ID = ?`,
        num,
        (err, results) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(200).send(results);
            }
        }
    );
});

module.exports = router;

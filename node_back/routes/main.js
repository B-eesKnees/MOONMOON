const express = require("express");
const db = require("../db"); //db연결

const router = express.Router();

//추천 리스트
router.post("/getRecBook", async (req, res) => {
    const email = req.body.email;

    db.query(`select * from survey where SUR_USER_EMAIL = ?`, email, (err, result) => {
        if (err) {
            res.status(200).send(err);
        } else {
            const sur1 = result[0].SUR_LIKE_1 || "없음";
            const sur2 = result[0].SUR_LIKE_2 || "없음";
            const sur3 = result[0].SUR_LIKE_3 || "없음";
            const sur4 = result[0].SUR_LIKE_4 || "없음";
            const sur5 = result[0].SUR_LIKE_5 || "없음";

            const search1 = `%${sur1}%`;
            const search2 = `%${sur2}%`;
            const search3 = `%${sur3}%`;
            const search4 = `%${sur4}%`;
            const search5 = `%${sur5}%`;

            const query = `select BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
            from book 
            where BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? 
            order by BOOK_SALESPOINT desc 
            limit 5`;
            console.log([search1, search2, search3, search4, search5]);
            db.query(query, [search1, search2, search3, search4, search5], (err, results) => {
                if (err) {
                    res.status(200).send("error" + err);
                } else {
                    res.status(200).send(results);
                }
            });
        }
    });
});
//베스트셀러
router.post("/getBestBook", async (req, res) => {
    db.query(
        `select BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, "%Y.%m.%d") as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
        from book 
        order by BOOK_SALESPOINT DESC
        limit 5`,
        (err, result) => {
            if (err) {
                res.send(err).status(400);
            } else {
                res.status(200).send(result);
            }
        }
    );
});
//신책
router.post("/getNewestBook", async (req, res) => {
    db.query(
        `select BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, "%Y.%m.%d") as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER  
        from book order 
        by BOOK_PUBDATE ASC
        limit 5`,
        (err, result) => {
            if (err) {
                res.send(err).status(400);
            } else {
                res.status(200).send(result);
            }
        }
    );
});
//장바구니 숫자
router.post("/getCart", async (req, res) => {
    const email = req.body.email;

    db.query(`select count(*) from cart where CART_USER_EMAIL = ?`, email, (err, result) => {
        if (err) {
            res.send(err).status(400);
        } else {
            res.status(200).send(result);
        }
    });
});
//검색
router.get("/", async (req, res) => {
    try {
        const searchKeyword = req.query.searchKeyword;
        console.log(searchKeyword);

        const search_query = "SELECT * FROM book WHERE BOOK_TITLE LIKE ? OR BOOK_AUTHOR LIKE ?";
        const search_word = `%${searchKeyword}%`;
        console.log(search_word);

        db.query(search_query, [search_word, search_word], (err, results) => {
            if (err) {
                res.status(200).json({ error: "Database query error" });
            } else {
                res.status(200).json(results);
            }
        });
    } catch (error) {
        res.status(200).json({ error: error.message });
    }
});

module.exports = router;

const express = require("express");
const db = require("../db"); //db연결

const router = express.Router();

//추천 리스트
router.post("/getRecBook", async (req, res) => {
    const email = req.body.email;

    db.query(`select * from moonmoon.order where ORDER_USER_EMAIL = ?`, email, (err, results) => {
        console.log(1);
        if (err) {
            res.status(200).send(err);
        } else {
            if (results.length == 0) {
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

                        const query = `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
                        from book 
                        where BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? 
                        order by BOOK_SALESPOINT desc 
                        limit 8`;
                        console.log([search1, search2, search3, search4, search5]);
                        db.query(query, [search1, search2, search3, search4, search5], (err, results) => {
                            if (err) {
                                res.status(200).send("error" + err);
                                console.log("전송 40");
                            } else {
                                console.log("전송 42");
                                res.status(200).send(results);
                            }
                        });
                    }
                });
            } else {
                console.log(2);
                db.query(
                    `SELECT BOOK_CATEGORYNAME
                    FROM book
                    WHERE BOOK_ID IN (
                        SELECT ORDERITEM_BOOK_ID
                        FROM moonmoon.order o
                        JOIN orderitem oi ON o.ORDER_ID = oi.ORDERITEM_ORDER_ID
                        WHERE o.ORDER_USER_EMAIL = ? and oi.ORDERITEM_BUYCHECK = 1
                    )
                    GROUP BY BOOK_CATEGORYNAME
                    ORDER BY COUNT(*) DESC
                    limit 1`,
                    email,
                    (err, results2) => {
                        if (err) {
                            res.status(200).send(err);
                        } else {
                            console.log(2);
                            if (results2.length === 0) {
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

                                        const query = `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
                                    from book 
                                    where BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? 
                                    order by BOOK_SALESPOINT desc 
                                    limit 8`;
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
                            } else {
                                // res.send(results2);
                                // console.log(results2[0].BOOK_CATEGORYNAME);
                                const text = results2[0].BOOK_CATEGORYNAME;
                                const splitText = text.split(">");

                                const splitText2 = splitText.slice(0, 3).join(">");
                                console.log(splitText2);
                                db.query(
                                    `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
                                from book where BOOK_CATEGORYNAME like '%${splitText2}%' 
                                order by book_salespoint desc
                                limit 8;`,
                                    (err, result5) => {
                                        if (err) {
                                            res.send(err);
                                        } else {
                                            console.log(result5);
                                            res.send(result5);
                                        }
                                    }
                                );
                            }
                        }
                    }
                );
            }
        }
    });
});
//베스트셀러
router.post("/getBestBook", async (req, res) => {
    db.query(
        `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, "%Y.%m.%d") as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER 
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
        `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, "%Y.%m.%d") as PUBDATE, BOOK_PRICE, BOOK_DESCRIPTION, BOOK_COVER, BOOK_PUBLISHER  
        from book order 
        by BOOK_PUBDATE desc
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
//판매량 순 검색
router.get("/best", async (req, res) => {
    try {
        const searchKeyword = req.query.searchKeyword;

        const search_query = `SELECT b.BOOK_CATEGORYNAME, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
                                FROM book b 
                                left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK 
                                WHERE BOOK_TITLE LIKE ? OR BOOK_AUTHOR LIKE ?
                                group by b.BOOK_ID
                                order by b.BOOK_SALESPOINT desc`;
        const search_word = `%${searchKeyword}%`;

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
//신상품 순 검색
router.get("/new", async (req, res) => {
    try {
        const searchKeyword = req.query.searchKeyword;

        const search_query = `SELECT b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, BOOK_CATEGORYNAME, b.BOOK_COVER, b.BOOK_PUBLISHER, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
                                FROM book b 
                                left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK 
                                WHERE BOOK_TITLE LIKE ? OR BOOK_AUTHOR LIKE ?
                                group by b.BOOK_ID
                                order by b.BOOK_PUBDATE desc`;
        const search_word = `%${searchKeyword}%`;

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
//검색 미리생성
router.get("/searchBest", async (req, res) => {
    try {
        const searchKeyword = req.query.searchKeyword;

        const search_query = `SELECT b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
                                FROM book b 
                                left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK 
                                WHERE BOOK_TITLE LIKE ?
                                group by b.BOOK_ID
                                order by b.BOOK_SALESPOINT desc
                                limit 10`;
        const search_word = `%${searchKeyword}%`;

        db.query(search_query, search_word, (err, results) => {
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

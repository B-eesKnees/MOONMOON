const express = require("express");
const db = require("../db"); //db연결
const router = express.Router();

//추천 리스트
router.post("/getRecList", async (req, res) => {
    const email = req.body.email;

    db.query(`select * from moonmoon.order where ORDER_USER_EMAIL = ?`, email, (err, results) => {
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

                        const query = `select distinct b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, (select COALESCE(ROUND(AVG(r2.REV_RATING), 1), 0) from review r2 where r2.REV_ORDERITEM_BOOK = b.BOOK_ID) AS reviewpoint, b.book_salespoint
                        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
                        where BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? 
                        order by BOOK_SALESPOINT desc`;
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

                                        const query = `select distinct b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, (select COALESCE(ROUND(AVG(r2.REV_RATING), 1), 0) from review r2 where r2.REV_ORDERITEM_BOOK = b.BOOK_ID) AS reviewpoint, b.book_salespoint
                                        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
                                        where BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? or BOOK_CATEGORYNAME like ? 
                                        order by BOOK_SALESPOINT desc`;
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
                                const text = results2[0].BOOK_CATEGORYNAME;
                                const splitText = text.split(">");

                                const splitText2 = splitText.slice(0, 3).join(">");
                                console.log(splitText2);
                                db.query(
                                    `select distinct b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, (select COALESCE(ROUND(AVG(r2.REV_RATING), 1), 0) from review r2 where r2.REV_ORDERITEM_BOOK = b.BOOK_ID) AS reviewpoint, b.book_salespoint
                                    from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
                                    where BOOK_CATEGORYNAME like '%${splitText2}%' 
                                    order by b.book_salespoint desc;
                                `,
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

//알라딘 판매포인트 순으로 정렬
router.post(`/getBest`, async (req, res) => {
    db.query(
        `select b.BOOK_ID, b.BOOK_COVER, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
        group by b.BOOK_ID
        order by b.BOOK_SALESPOINT desc;`,
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
        `select b.BOOK_COVER, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
        from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
        group by b.BOOK_ID
        order by b.BOOK_PUBDATE desc;`,
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

    db.query(`select * from likedbook where LIKE_USER_EMAIL = ?`, email, (err, results) => {
        if (err) {
            res.status(200).send(err);
        } else {
            const likelist = results.map((like) => like.LIKE_BOOK_ID);

            res.status(200).send(likelist);
        }
    });
});

//좋아요 확인 기능
router.post("/checkLike", async (req, res) => {
    const email = req.body.email;

    db.query(`select * from likedbook where LIKE_USER_EMAIL = ?`, email, (err, results) => {
        if (err) {
            res.status(200).send(err);
        } else {
            const likeArr = results.map((data) => data.LIKE_BOOK_ID);
            res.status(200).send(likeArr);
        }
    });
});

//카테고리별로 리스트 (신상품)
router.post("/newCate", async (req, res) => {
    const category = req.body.category;

    db.query(
        `select b.BOOK_COVER, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
            from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
            where b.BOOK_CATEGORYNAME like ?
            group by b.BOOK_ID
            order by b.BOOK_PUBDATE desc;`,
        `%${category}%`,
        (err, results) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(results);
            }
        }
    );
});

router.post("/bestCate", async (req, res) => {
    const category = req.body.category;
    const trimCate = category.trim();
    console.log(trimCate);

    db.query(
        `select b.BOOK_COVER, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
            from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
            where b.BOOK_CATEGORYNAME like ?
            group by b.BOOK_ID
            order by b.BOOK_SALESPOINT desc;`,
        `%${trimCate}%`,
        (err, results) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(results);
            }
        }
    );
});

//결제 기능
// http://localhost:3000/detail/gotoPay

module.exports = router;

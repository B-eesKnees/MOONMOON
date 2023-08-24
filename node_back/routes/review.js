const express = require("express");
const router = express.Router();
const db = require("../db");

//구매확정한 사람만 리뷰 작성 가능
router.post("/postreview", (req, res) => {
    const reviewData = req.body;
    const now = new Date();

    // Check if the user has bought the product and rev_check is 0
    const checkBuyAndRevCheckQuery = `
    SELECT oi.ORDERITEM_BUYCHECK, oi.ORDERITEM_REVCHECK
    FROM orderitem oi
    WHERE oi.ORDERITEM_ORDER_ID IN (
      SELECT o.ORDER_ID
      FROM \`order\` o
      WHERE o.ORDER_USER_EMAIL = ? AND o.ORDER_STATE = '배송완료'
    )
    AND oi.ORDERITEM_BOOK_ID = ?
  `;

    db.query(checkBuyAndRevCheckQuery, [reviewData.REV_WRITER, reviewData.REV_ORDERITEM_BOOK], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            if (result.length > 0 && result[0].ORDERITEM_BUYCHECK === 1 && result[0].ORDERITEM_REVCHECK === 0) {
                // Proceed with inserting the review
                const reviewRow = {
                    REV_ORDERITEM_BOOK: reviewData.REV_ORDERITEM_BOOK,
                    REV_WRITER: reviewData.REV_WRITER,
                    REV_COMMENT: reviewData.REV_COMMENT,
                    REV_RATING: reviewData.REV_RATING,
                    REV_CREATED_AT: now.toISOString,
                };

                const insertReviewQuery = "INSERT INTO REVIEW SET ?";
                db.query(insertReviewQuery, reviewRow, (err, results) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: "서버 에러" });
                    } else {
                        // 리뷰 작성되면 REVCHECK =1로 업데이트
                        const updateRevCheckQuery = `
              UPDATE orderitem
              SET ORDERITEM_REVCHECK = 1
              WHERE ORDERITEM_ORDER_ID IN (
                SELECT o.ORDER_ID
                FROM \`order\` o
                WHERE o.ORDER_USER_EMAIL = ? AND o.ORDER_STATE = '배송완료'
              )
              AND ORDERITEM_BOOK_ID = ?
              `;

                        db.query(updateRevCheckQuery, [reviewData.REV_WRITER, reviewData.REV_ORDERITEM_BOOK], (err, updateResult) => {
                            if (err) {
                                console.error(err);
                                res.status(500).json({ error: "서버 에러" });
                            } else {
                                //리뷰 작성하면 300p증정
                                const updateUserPointQuery = `
                      UPDATE user
                      SET user_point = user_point + 300
                      WHERE user_email = ?
                    `;

                                db.query(updateUserPointQuery, [reviewData.REV_WRITER], (err, updatePointResult) => {
                                    if (err) {
                                        console.error(err);
                                        res.status(500).json({ error: "서버 에러" });
                                    } else {
                                        res.status(200).json({
                                            message: "리뷰 작성 완료",
                                            review: reviewRow,
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else if (result.length > 0 && result[0].ORDERITEM_REVCHECK === 1) {
                // User has already posted a review for the same product
                res.status(400).json({
                    error: "이미 해당 상품에 대한 리뷰를 작성한 경우.",
                });
            } else {
                // User has not bought the product or rev_check is not 0, cannot post review
                res.status(400).json({
                    error: "해당 상품을 구매하지 않았거나 리뷰 작성이 불가능한 상태입니다.",
                });
            }
        }
    });
});

//리뷰 데이터 받아오기ok (기본(최신순))
router.get("/reviewdata", (req, res) => {
    const { bookId } = req.query;
    const query =
        "SELECT r.REVIEW_ID, r.REV_COMMENT,r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, r.REV_RATING,  b.BOOK_ID, u.user_email AS review_writer " +
        "FROM review r " +
        "INNER JOIN book b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID " +
        "INNER JOIN user u ON r.REV_WRITER = u.user_email " +
        "WHERE b.BOOK_ID = ? " +
        "ORDER BY r.REV_CREATED_AT DESC";
    db.query(
        `SELECT r.REVIEW_ID, r.REV_COMMENT, r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, r.REV_RATING,  b.BOOK_ID, r.REV_WRITER AS review_writer FROM review r INNER JOIN book b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID WHERE b.BOOK_ID = ? ORDER BY r.REV_CREATED_AT DESC;`,
        [bookId],
        (err, results) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "서버 에러" });
            } else {
                res.json({ review: results });
            }
        }
    );
});

//마이페이지 리뷰 데이터
router.get("/myreviewdata/:userEmail", (req, res) => {
    const { userEmail } = req.params;
    const query =
        "SELECT r.REVIEW_ID, r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, r.REV_RATING, b.BOOK_ID, b.BOOK_COVER, b.BOOK_TITLE, b.BOOK_AUTHOR " +
        "FROM review r " +
        "INNER JOIN book b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID " +
        "WHERE r.REV_WRITER = ? " +
        "ORDER BY r.REV_CREATED_AT DESC";
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            res.json({ myReviews: results });
        }
    });
});

//리뷰 데이터 받아오기 (평점 높은 순)ok
router.get("/reviewrating", (req, res) => {
    const { bookId } = req.query;
    const query = `SELECT r.REVIEW_ID, r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, r.REV_RATING, b.BOOK_ID, u.user_email AS review_writer 
    FROM review r 
    INNER JOIN book b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID 
    INNER JOIN user u ON r.REV_WRITER = u.user_email 
    WHERE b.BOOK_ID = ?
    ORDER BY r.REV_RATING DESC;
    `;
    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            res.json({ review: results });
        }
    });
});

//리뷰데이터 평점 낮은 순 ok
router.get("/lowreviewrating", (req, res) => {
    const { bookId } = req.query;
    const query = `SELECT r.REVIEW_ID, r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, r.REV_RATING, b.BOOK_ID, u.user_email AS review_writer 
    FROM review r 
    INNER JOIN book b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID 
    INNER JOIN user u ON r.REV_WRITER = u.user_email 
    WHERE b.BOOK_ID = ? 
    ORDER BY r.REV_RATING;
    `;
    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            res.json({ review: results });
        }
    });
});

//리뷰수정 ok
router.put("/updatereview/:reviewId", (req, res) => {
    const { reviewId } = req.params;
    const review = req.body.review;

    const query = `UPDATE review SET r.REV_COMMENT, DATE_FORMAT(r.REV_CREATED_AT, '%Y-%m-%d') AS REV_CREATED_AT, REV_COMMENT=?, REV_RATING=? WHERE REVIEW_ID=?`;
    db.query(query, [review.REV_COMMENT, review.REV_RATING, reviewId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버에러" });
        } else {
            res.status(200).json({
                updateReview: results,
                message: "리뷰 수정 완료",
            });
        }
    });
});

//리뷰삭제ok
router.delete("/deletereview", (req, res) => {
    const { reviewId } = req.query;
    const query = `DELETE FROM review where REVIEW_ID=?`;

    db.query(query, [reviewId], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버에러" });
        } else {
            res.status(200).json({ results: results });
        }
    });
});

//리뷰 별점 평균값
router.get("/averagerating/:bookId", (req, res) => {
    const bookId = req.params.bookId;
    const query = "SELECT ROUND(AVG(REV_RATING), 1) AS average_rating FROM review WHERE REV_ORDERITEM_BOOK = ?";

    db.query(query, [bookId], (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Database error" });
            return;
        }

        const averageRating = result[0].average_rating;
        res.json({ averageRating });
    });
});

//책 당 리뷰  총 갯수
router.get("/reviewcount/:bookId", (req, res) => {
    const bookId = req.params.bookId;

    const query = `
    SELECT COUNT(*) AS REVIEW_COUNT
    FROM review
    WHERE REV_ORDERITEM_BOOK = ?;
  `;

    db.query(query, [bookId], (err, results) => {
        if (err) {
            console.error("Error:", err);
            res.status(500).json({ error: "서버오류" });
        } else {
            if (results.length > 0) {
                res.json({ reviewCount: results[0].REVIEW_COUNT });
            } else {
                res.json({ reviewCount });
            }
        }
    });
});

module.exports = router;

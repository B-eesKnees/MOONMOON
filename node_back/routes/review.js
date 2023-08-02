const express = require("express");
const router = express.Router();
const db = require("../db");

// 리뷰 작성 라우터 ok
router.post("/postreview", (req, res) => {
  const reviewData = req.body;

  const reviewRow = {
    REV_ORDERITEM_BOOK: reviewData.REV_ORDERITEM_BOOK,
    REV_WRITER: reviewData.REV_WRITER,
    REV_NICK: reviewData.REV_NICK,
    REV_COMMENT: reviewData.REV_COMMENT,
    REV_RATING: reviewData.REV_RATING,
  };

  const query = "INSERT INTO REVIEWBOOK SET ?";
  db.query(query, reviewRow, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      res.status(200).json({
        message: "INSERT COMPLETE",
        review: reviewRow, // 삽입된 데이터를 반환
      });
    }
  });
});

//리뷰 데이터 받아오기ok (기본(최신순))
router.get("/reviewdata", (req, res) => {
  const { bookId } = req.query;
  const query =
    "SELECT r.REVIEW_ID, r.REV_COMMENT, r.REV_CREATED_AT, r.REV_RATING, b.BOOK_ID FROM reviewbook r INNER JOIN books b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID WHERE b.BOOK_ID = ? ORDER BY r.REV_CREATED_AT DESC;";
  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      res.json({ review: results });
    }
  });
});

//리뷰 데이터 받아오기 (평점 높은 순)ok
router.get("/reviewrating", (req, res) => {
  const { bookId } = req.query;
  const query =
    "SELECT r.REVIEW_ID, r.REV_COMMENT, r.REV_CREATED_AT, r.REV_RATING, b.BOOK_ID FROM reviewbook r INNER JOIN books b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID WHERE b.BOOK_ID = ? ORDER BY r.REV_RATING DESC";
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

  const query = `UPDATE reviewbook SET REV_CREATED_AT=now(), REV_COMMENT=?, REV_RATING=? WHERE REVIEW_ID=?`;
  db.query(
    query,
    [review.REV_COMMENT, review.REV_RATING, reviewId],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버에러" });
      } else {
        res.status(200).json({
          updateReview: results,
          message: "리뷰 수정 완료",
        });
      }
    }
  );
});

//리뷰삭제ok
router.delete("/deletereview", (req, res) => {
  const { reviewId } = req.query;
  const query = `DELETE FROM reviewbook where REVIEW_ID=?`;

  db.query(query, [reviewId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      res.status(200).json({ results: results });
    }
  });
});

module.exports = router;

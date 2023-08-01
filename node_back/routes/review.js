const express = require("express");
const router = express.Router();
const db = require("../db");

const path = require("path");
const multer = require("multer");
const upload = multer({
  storage: multer.diskStorage({
    filename(req, file, done) {
      done(
        null,
        `${Date.now()}_${Math.round(Math.random() * 1e9)}.${
          file.mimetype.split("/")[1]
        }`
      );
    },
    destination(req, file, done) {
      done(null, path.join(__dirname, "../CourseImage"));
    },
  }),
});
// const postUpload = upload.fields([
//   { name: "reviewData" },
//   { name: "imageData" },
// ]);

// //리뷰 작성
// router.post("/review", postUpload, (req, res) => {
//   const reviewData = req.body.reviewData;

//   const reviewRow = {
//     REV_NUM: body.bookId,
//     REV_WRITER: body.writer,
//     REV_IMG: req.file.filename,
//     REV_COMMENT: body.comment,
//     REV_RATING: body.rating,
//   };

//   db.query("INSERT INTO review SET ?", reviewRow, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "서버 에러" });
//     } else {
//       const imageRow = req.filesimageData.map((f)=>[
//         bookId,
//         f.filename
//       ]);
//       db.query(
//         "INSERT INTO image (IMG_NUM, IMG_PATH) VALUES ?",
//         [imageRow],(err,results)=>{
//           console.error(err);
//           res.status(200).json({ message :"error"})
//         }else{
//           res.status(200).json({message:"INSERT COMPLETE",
//         bookId : bookId})
//         }
//       )
//     }
//   });
// });

//리뷰 데이터 받아오기
router.get("reviewdata", (req, res) => {
  const { bookId } = req.query;
  const query =
    "SELECT r.REVIEW_ID, r.REV_COMMENT,  r.REV_CREATED_AT, r.REV_RATING, b.BOOK_ID FROM reviews r INNER JOIN books b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID;";
  db.query(query, [bookId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      res.json({ review: results });
    }
  });
});

//리뷰 수정
// router.put("/updatereview", (req,res)=>{
//   const { reviewId } =
// });

//리뷰삭제
router.get("/deletereview", (req, res) => {
  const { reviewId } = req.query;
  const query = `DELETE * FROM reviews where REVIEW_ID=?`;

  db.query(query, [reviewId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      res.json({ deletereview: results });
    }
  });
});

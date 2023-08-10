const express = require("express");
const db = require("../db");

const router = express.Router();

//이름,이메일 받아오기
router.get("/getuser", (req, res) => {
  const { userEmail } = req.body;

  const query = "SELECT * FROM user WHERE USER_EMAIL = ?";

  // 위의 쿼리 실행
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      if (results.length > 0) {
        // 사용자 정보를 찾았을 때
        const user = results[0];
        res.status(200).json({ user });
      } else {
        // 사용자 정보를 찾지 못했을 때
        res.status(300).json({ message: "사용자 정보를 찾을 수 없습니다." });
      }
    }
  });
});

//찜한 책 개수
router.get("/getlikecount", (req, res) => {
  const userEmail = req.query.userEmail;
  const query = `SELECT COUNT(*) AS likecount FROM likedbook WHERE LIKE_USER_EMAIL =?`;

  if (!userEmail) {
    res.status(400).json({ error: "사용자 이메일이 필요합니다" });
    return;
  }

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (results.length > 0) {
        const likecount = results[0].likecount;
        res.json({ likecount });
      } else {
        res.json({ likecount: 0 });
      }
    }
  });
});

//최근본책 개수
router.get("/recentcount", (req, res) => {
  const userEmail = req.query.userEmail;

  if (!userEmail) {
    res.status(400).json({ error: "이메일이 필요합니다." });
    return;
  }

  const query = `SELECT COUNT(*) AS recentCount FROM recentbook WHERE REC_USER_EMAIL =?;`;
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (results.length > 0) {
        const recentCount = results[0].recentCount;
        res.json({ recentCount });
      } else {
        res.json({ recentCount: 0 });
      }
    }
  });
});
module.exports = router;

const express = require("express");
const db = require("../db");
const router = express.Router();

//룰렛 데이터 전송 ok

router.post("/addroul", (req, res) => {
  const userEmail = req.body.userEmail;
  const selectedValue = req.body.selectedValue;

  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().slice(0, 10); // YYYY-MM-DD 형식으로 변환

  const checkQuery =
    "SELECT * FROM roulette WHERE roul_date = ? AND roul_user_email = ?";
  db.query(checkQuery, [formattedTime, userEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "서버에러" });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: "이미 참여하셨습니다." });
    }

    const insertQuery =
      "INSERT INTO roulette (roul_value, roul_date, roul_user_email) VALUES (?, ?, ?)";
    db.query(
      insertQuery,
      [selectedValue, formattedTime, userEmail],
      (err, results) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "서버에러" });
        } else {
          res.status(200).json({ message: selectedValue });
        }
      }
    );
  });
});

//룰렛 데이터 가져오기 ok
router.get("/rouldata", async (req, res) => {
  const userEmail = req.query.userEmail;
  const query = "SELECT * FROM roulette WHERE roul_user_email = ?";

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      res.status(200).json({ message: results });
    }
  });
});

//누적포인트 가져오기 ok
router.get("/roulpoint", (req, res) => {
  const userEmail = req.query.userEmail;
  if (!userEmail) {
    return res.status(400).json({ error: "사용자 이메일이 필요합니다." });
  }

  const query =
    "SELECT roul_user_email, SUM(user_points) AS cumulative_points FROM roulette WHERE roul_user_email = ?";
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("유저별 누적 포인트 조회 중 오류 발생:", err);
      return res
        .status(500)
        .json({ error: "요청 처리 중 오류가 발생했습니다." });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "사용자가 존재하지 않습니다." });
    }

    const cumulativePoints = results[0].cumulative_points;
    res.json({ userEmail, cumulativePoints });
  });
});

module.exports = router;

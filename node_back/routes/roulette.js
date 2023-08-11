const express = require("express");
const db = require("../db");
const router = express.Router();

// 누적 포인트 계산 함수
const calCumPoints = (userEmail, callback) => {
  const query =
    "SELECT SUM(roul_value) AS cumulative_points FROM roulette WHERE roul_user_email = ?";
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("누적 포인트 계산 에러", err);
      if (callback) callback(err, null);
    } else {
      const cumulativePoints = results[0].cumulative_points || 0;
      if (callback) callback(null, cumulativePoints);
    }
  });
};
//참여 여부 체크
router.get("/checkroul", (req, res) => {
  const userEmail = req.query.userEmail;
  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().slice(0, 10);

  const query =
    "SELECT * FROM roulette WHERE roul_date = ? AND roul_user_email = ?";
  db.query(query, [formattedTime, userEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "서버에러" });
    }
    if (results.length > 0) {
      return res.status(200).json({ message: "참여불가" });
    } else {
      res.status(200).json({ message: "참여 가능합니다" });
    }
  });
});
//룰렛 데이터 전송 ok

router.post("/addroul", (req, res) => {
  const userEmail = req.body.userEmail;
  const selectedValue = req.body.selectedValue;

  const currentTime = new Date();
  const formattedTime = currentTime.toISOString().slice(0, 10);

  const insertQuery =
    "INSERT INTO roulette (roul_value, roul_date, roul_user_email) VALUES (?, ?, ?)";
  db.query(
    insertQuery,
    [selectedValue, formattedTime, userEmail],
    async (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버에러" });
      } else {
        // 누적 포인트 계산
        calCumPoints(userEmail, async (calErr, cumulativePoints) => {
          if (calErr) {
            res.status(500).json({ error: "누적 포인트 계산 오류" });
          } else {
            // 누적 포인트 업데이트
            const updateQuery =
              "UPDATE roulette SET roul_points = ? WHERE roul_user_email = ?";
            db.query(
              updateQuery,
              [cumulativePoints, userEmail],
              (updateErr) => {
                if (updateErr) {
                  console.error(updateErr);
                  res.status(500).json({ error: "서버에러" });
                } else {
                  // 사용자 포인트 업데이트
                  const updatePointQuery =
                    "UPDATE user SET user_point = user_point + ? WHERE user_email = ?";
                  db.query(
                    updatePointQuery,
                    [selectedValue, userEmail],
                    (updatePointErr) => {
                      if (updatePointErr) {
                        console.error(updatePointErr);
                        res.status(500).json({ error: "서버에러" });
                      } else {
                        res.status(200).json({ message: selectedValue });
                      }
                    }
                  );
                }
              }
            );
          }
        });
      }
    }
  );
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
// 이벤트에 참여한 모든 유저들의 최근 룰렛 데이터 가져오는 라우터
router.get("/latestroul", (req, res) => {
  const query =
    "SELECT * FROM roulette WHERE ROUL_ID IN (SELECT MAX(ROUL_ID) FROM roulette GROUP BY roul_user_email)";
  db.query(query, (err, latestRows) => {
    if (err) {
      console.error(
        "이벤트 참여한 유저들의 최근 룰렛 데이터 조회 중 에러",
        err
      );
      return res
        .status(500)
        .json({ error: "요청 처리 중 오류가 발생했습니다." });
    }

    if (latestRows.length === 0) {
      return res
        .status(404)
        .json({ error: "이벤트에 참여한 유저들의 룰렛 데이터가 없습니다." });
    }

    res.status(200).json({ latestRows });
  });
});
// //누적포인트 가져오기 ok
// router.get("/roulpoint", (req, res) => {
//   const userEmail = req.query.userEmail;
//   if (!userEmail) {
//     return res.status(400).json({ error: "사용자 이메일이 필요합니다." });
//   }

//   const query =
//     "SELECT roul_user_email, SUM(user_points) AS cumulative_points FROM roulette WHERE roul_user_email = ?";
//   db.query(query, [userEmail], (err, results) => {
//     if (err) {
//       console.error("유저별 누적 포인트 조회 중 오류 발생:", err);
//       return res
//         .status(500)
//         .json({ error: "요청 처리 중 오류가 발생했습니다." });
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ error: "사용자가 존재하지 않습니다." });
//     }

//     const cumulativePoints = results[0].cumulative_points;
//     res.json({ userEmail, cumulativePoints });
//   });
// });

module.exports = router;

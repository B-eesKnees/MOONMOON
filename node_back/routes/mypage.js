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

//총 포인트
router.get("/userpoint", (req, res) => {
  const userEmail = req.query.userEmail;

  if (!userEmail) {
    res.status(400).json({ error: "이메일이 필요합니다" });
    return;
  }

  const query = `SELECT user_point FROM user WHERE user_email =?; `;
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (results.length > 0) {
        const userPoint = results[0].user_point;
        res.json({ userPoint });
      } else {
        res.json({ userPoint: 0 });
      }
    }
  });
});

router.post("/updatecoupon", (req, res) => {
  const userEmail = req.body.userEmail;

  // user_total_pay 구하기
  const totalPayQuery = "SELECT user_total_pay FROM user WHERE user_email = ?";
  db.query(totalPayQuery, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else if (results.length > 0) {
      const userTotalPay = results[0].user_total_pay;

      // Determine user's coupon type based on total pay
      let couponGrades = [];
      let discountRatios = [];
      let freeShipCouponId = null;

      if (userTotalPay < 100000) {
        couponGrades = ["프렌즈"];
        discountRatios = [5]; // 할인 비율
      } else if (userTotalPay >= 100000 && userTotalPay < 200000) {
        couponGrades = ["실버"];
        discountRatios = [10]; // 할인 비율
      } else if (userTotalPay >= 200000 && userTotalPay < 300000) {
        couponGrades = ["골드"];
        discountRatios = [15]; // 할인 비율
        freeShipCouponId = 5;
      } else if (userTotalPay >= 300000) {
        couponGrades = ["플래티넘"];
        discountRatios = [20]; // 할인 비율
        freeShipCouponId = 6;
      }

      // Loop through coupon types and insert if not already added
      couponGrades.forEach((couponGrades, index) => {
        let insertQuery = `
          INSERT INTO cpuser (CPUSER_USER_EMAIL, CPUSER_COUPON_ID, CPUSER_STATUS, CPUSER_MAXDATE, CPUSER_REGDATE)
          SELECT ?, c.COUPON_ID, 0, c.COUPON_MAXDATE, NOW()
          FROM coupon c
          WHERE (c.COUPON_GRADE = ? OR (c.COUPON_ID IN (5, 6))) AND c.COUPON_RATIO = ? AND NOT EXISTS (
            SELECT 1 FROM cpuser WHERE CPUSER_USER_EMAIL = ? AND CPUSER_COUPON_ID = c.COUPON_ID
          );
        `;

        if (couponGrades === "무료배송 쿠폰") {
          insertQuery = `
            INSERT INTO cpuser (CPUSER_USER_EMAIL, CPUSER_COUPON_ID, CPUSER_STATUS, CPUSER_MAXDATE, CPUSER_REGDATE)
            SELECT ?, c.COUPON_ID, 0, c.COUPON_MAXDATE, NOW()
            FROM coupon c
            WHERE (c.COUPON_GRADE = ? AND c.COUPON_ID IN (5, 6)) AND c.COUPON_RATIO = ? AND NOT EXISTS (
              SELECT 1 FROM cpuser WHERE CPUSER_USER_EMAIL = ? AND CPUSER_COUPON_ID = c.COUPON_ID
            );
          `;
        }

        db.query(
          insertQuery,
          [userEmail, couponGrades, discountRatios[index], userEmail],
          (insertErr) => {
            if (insertErr) {
              console.error(insertErr);
            }
          }
        );
      });

      res.status(200).json({ message: "쿠폰을 업데이트했습니다." });
    } else {
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  });
});

// 쿠폰 소멸 로직
function processCouponExpiry() {
  const currentDate = new Date();
  const expiryDate = new Date("2023-08-31 23:59:59");

  if (currentDate >= expiryDate) {
    const deleteQuery = "DELETE FROM cpuser WHERE CPUSER_MAXDATE < ?";
    db.query(deleteQuery, [currentDate], (deleteErr) => {
      if (deleteErr) {
        console.error(deleteErr);
      }
    });
  }
}

// 8월 31일까지 매일 자정에 쿠폰 소멸 작업 수행
const expiryDate = new Date("2023-08-31 23:59:59");
const timeUntilExpiry = expiryDate - new Date();
if (timeUntilExpiry > 0) {
  setTimeout(() => {
    processCouponExpiry();
    setInterval(processCouponExpiry, 24 * 60 * 60 * 1000);
  }, timeUntilExpiry);
}

module.exports = router;

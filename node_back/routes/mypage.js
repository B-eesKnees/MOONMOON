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

router.post("/updatecoupon/:userEmail", (req, res) => {
  const userEmail = req.params.userEmail;

  // 사용자 정보 조회
  const userQuery = `
      SELECT user_total_pay FROM user
      WHERE user_email = ?
  `;

  db.query(userQuery, [userEmail], (userError, userResults) => {
    if (userError) {
      console.error(userError);
      res.status(500).json({ error: "유저 정보 조회 실패." });
      return;
    }

    if (userResults.length === 0) {
      res.status(404).json({ error: "유저를 찾을 수 없음." });
      return;
    }

    const userTotalPay = userResults[0].user_total_pay;

    // 현재 날짜 및 시간
    const now = new Date();

    // 무료배송 쿠폰 조회 및 지급 로직
    const query = `
          SELECT * FROM coupon
          WHERE COUPON_GRADE IN ('골드', '플래티넘')
          AND ? >= 200000
          AND COUPON_MAXDATE >= NOW()
      `;

    db.query(query, [userTotalPay], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({
          error: "An error occurred while fetching free delivery coupons.",
        });
      } else {
        const freeDeliveryCouponsToGive = results;

        // 등급별 쿠폰 조회 및 지급 로직
        const query = `
                  SELECT * FROM coupon
                  WHERE (COUPON_GRADE = '프렌즈' AND ? < 100000)
                  OR (COUPON_GRADE = '실버' AND ? >= 100000 AND ? < 200000)
                  OR (COUPON_GRADE = '골드' AND ? >= 200000 AND ? < 300000)
                  OR (COUPON_GRADE = '플래티넘' AND ? >= 300000)
                  AND COUPON_MAXDATE >= NOW()
              `;

        db.query(
          query,
          [
            userTotalPay,
            userTotalPay,
            userTotalPay,
            userTotalPay,
            userTotalPay,
            userTotalPay,
          ],
          (error, results) => {
            if (error) {
              console.error(error);
              res.status(500).json({
                error: "An error occurred while fetching grade coupons.",
              });
            } else {
              const gradeCouponsToGive = results;

              // 쿠폰 지급 및 cpuser 테이블에 삽입
              const couponsToInsert =
                freeDeliveryCouponsToGive.concat(gradeCouponsToGive);

              const cpuserInsertQuery = `
                          INSERT INTO cpuser (CPUSER_USER_EMAIL, CPUSER_COUPON_ID, CPUSER_STATUS, CPUSER_MAXDATE, CPUSER_REGDATE)
                          VALUES (?, ?, ?, ?, now())
                      `;

              const insertPromises = couponsToInsert.map((coupon) => {
                return new Promise((resolve, reject) => {
                  db.query(
                    cpuserInsertQuery,
                    [userEmail, coupon.COUPON_ID, 0, coupon.COUPON_MAXDATE],
                    (insertError, insertResults) => {
                      if (insertError) {
                        console.error(insertError);
                        reject(
                          "An error occurred while inserting cpuser data."
                        );
                      } else {
                        resolve(coupon);
                      }
                    }
                  );
                });
              });

              Promise.all(insertPromises)
                .then((insertedCoupons) => {
                  res.json({
                    message: "Coupons generated and inserted successfully.",
                    coupons: insertedCoupons,
                  });
                })
                .catch((error) => {
                  res.status(500).json({ error });
                });
            }
          }
        );
      }
    });
  });
});

router.post("/updatecoupon/:userEmail", (req, res) => {
  const userEmail = req.params.userEmail;

  // 사용자 정보 조회
  const userQuery = `
      SELECT user_total_pay FROM user
      WHERE user_email = ?
  `;

  db.query(userQuery, [userEmail], (userError, userResults) => {
    if (userError) {
      console.error(userError);
      res.status(500).json({ error: "유저 정보 조회 실패." });
      return;
    }

    if (userResults.length === 0) {
      res.status(404).json({ error: "유저를 찾을 수 없음." });
      return;
    }

    const userTotalPay = userResults[0].user_total_pay;

    // 현재 날짜 및 시간
    const now = new Date();

    // 등급별 쿠폰 조회 및 지급 로직
    const gradeCouponQuery = `
        SELECT * FROM coupon
        WHERE (COUPON_GRADE = '프렌즈' AND ? < 100000)
        OR (COUPON_GRADE = '실버' AND ? >= 100000 AND ? < 200000)
        OR (COUPON_GRADE = '골드' AND ? >= 200000 AND ? < 300000)
        OR (COUPON_GRADE = '플래티넘' AND ? >= 300000)
        AND COUPON_MAXDATE >= NOW()
    `;

    db.query(
      gradeCouponQuery,
      [
        userTotalPay,
        userTotalPay,
        userTotalPay,
        userTotalPay,
        userTotalPay,
        userTotalPay,
      ],
      (gradeCouponError, gradeCouponResults) => {
        if (gradeCouponError) {
          console.error(gradeCouponError);
          res.status(500).json({
            error: "An error occurred while fetching grade coupons.",
          });
        } else {
          const gradeCouponsToGive = gradeCouponResults;

          // 쿠폰 지급 및 cpuser 테이블에 삽입
          const cpuserInsertQuery = `
              INSERT INTO cpuser (CPUSER_USER_EMAIL, CPUSER_COUPON_ID, CPUSER_STATUS, CPUSER_MAXDATE, CPUSER_REGDATE)
              VALUES (?, ?, ?, ?, now())
          `;

          const insertPromises = gradeCouponsToGive.map((coupon) => {
            return new Promise((resolve, reject) => {
              db.query(
                cpuserInsertQuery,
                [userEmail, coupon.COUPON_ID, 0, coupon.COUPON_MAXDATE],
                (insertError, insertResults) => {
                  if (insertError) {
                    console.error(insertError);
                    reject("An error occurred while inserting cpuser data.");
                  } else {
                    resolve(coupon);
                  }
                }
              );
            });
          });

          Promise.all(insertPromises)
            .then((insertedCoupons) => {
              res.json({
                message: "Coupons generated and inserted successfully.",
                coupons: insertedCoupons,
              });
            })
            .catch((error) => {
              res.status(500).json({ error });
            });
        }
      }
    );
  });
});

//배송 상태별 조회
const ORDER_STATE = {
  ready: "배송준비",
  delivering: "배송중",
  delivered: "배송완료",
  cancelled: "주문취소",
};

router.get("/orderdelivery", (req, res) => {
  const userEmail = req.query.userEmail;
  const orderState = req.query.orderState;

  const query =
    "SELECT order_useremail, order_state FROM `order` WHERE ORDER_USEREMAIL = ? AND ORDER_STATE = ?";

  db.query(query, [userEmail, ORDER_STATE[orderState]], (err, results) => {
    if (err) {
      console.error("에러발생:", err);
      res.status(500).json({ error: "에러발생" });
      return;
    }
    res.json(results);
  });
});

//주문검색(주문상품)
router.get("/ordersearchbook", (req, res) => {
  const userEmail = req.query.userEmail;
  const bookKeyword = req.query.bookKeyword;

  let query = `
    SELECT o.*, oi.*, b.BOOK_TITLE
    FROM \`order\` AS o
    JOIN ORDERITEM AS oi ON o.ORDER_ID = oi.ORDERITEM_ORDERID
    JOIN BOOK AS b ON oi.ORDERITEM_BOOKID = b.BOOK_ID
    WHERE 1
  `;

  if (userEmail) {
    query += ` AND o.ORDER_USEREMAIL = '${userEmail}'`;
  }

  if (bookKeyword) {
    query += ` AND b.BOOK_TITLE LIKE '%${bookKeyword}%'`;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Error fetching orders" });
      return;
    }
    res.json(results);
  });
});
//주문검색(주문번호)
router.get("/ordersearchnumber", (req, res) => {
  const userEmail = req.query.userEmail;
  const orderId = req.query.orderId;

  let query = "SELECT * FROM `order` WHERE 1"; // 기본 쿼리

  if (userEmail) {
    query += ` AND ORDER_USEREMAIL = '${userEmail}'`;
  }

  if (orderId) {
    query += ` AND CAST(ORDER_ID AS CHAR) LIKE '${orderId}%'`; // 부분적으로 일치하도록 변경
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Error fetching orders" });
      return;
    }
    res.json(results);
  });
});

//날짜별로 (기간 검색)

module.exports = router;

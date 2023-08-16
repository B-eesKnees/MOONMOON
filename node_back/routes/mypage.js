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

//배송 상태별 조회  + 배송 상세 표시
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

//날짜별로 (기간 검색)
router.get("/orderdate", (req, res) => {
  const { startDate, endDate, userEmail } = req.query;

  if (!startDate || !endDate) {
    return res.status(400).json({ error: "해당 결과가 없습니다." });
  }

  const formattedStartDate = `${startDate} 00:00:00`;
  const formattedEndDate = `${endDate} 23:59:59`;

  let query = "SELECT * FROM `order` WHERE ORDER_DATE BETWEEN ? AND ?";
  const queryParams = [formattedStartDate, formattedEndDate];

  if (userEmail) {
    query += " AND ORDER_USEREMAIL = ?";
    queryParams.push(userEmail);
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Error fetching orders" });
      return;
    }
    res.json(results);
  });
});

//결제 날짜
router.get("/orderpaydate", (req, res) => {
  const { userEmail } = req.query;

  if (!userEmail) {
    return res.status(400).json({ error: "유저 이메일이 없어요요" });
  }

  const query =
    "SELECT ORDER_USEREMAIL, DATE_FORMAT(ORDER_DATE, '%m-%d') AS ORDER_DATE FROM `order` WHERE ORDER_USEREMAIL = ?";

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Error fetching orders" });
      return;
    }

    res.json(results);
  });
});

//bookTitle, bookCover, orderPay,orderCnt

router.get("/paybookinfo/:orderId", (req, res) => {
  const orderId = req.params.orderId;

  const query =
    "SELECT b.BOOK_TITLE, o.ORDER_PAY, b.BOOK_COVER, o.ORDER_CNT " +
    "FROM orderitem oi " +
    "INNER JOIN `order` o ON oi.ORDERITEM_ORDERID = o.ORDER_ID " +
    "INNER JOIN book b ON oi.ORDERITEM_BOOKID = b.BOOK_ID " +
    "WHERE o.ORDER_ID = ? " +
    "LIMIT 1";

  db.query(query, [orderId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      const orderInfo = results[0];
      res.json({
        bookTitle: orderInfo.BOOK_TITLE,
        bookCover: orderInfo.BOOK_COVER,
        orderPay: orderInfo.ORDER_PAY,
        orderCnt: orderInfo.ORDER_CNT,
      });
    }
  });
});

//구매확정처리
router.put("/updatebuycheck/:orderItemId", (req, res) => {
  const orderItemId = req.params.orderItemId;

  const selectQuery =
    "SELECT o.ORDER_STATE, oi.ORDERITEM_BUYCHECK FROM `order` o JOIN orderitem oi ON o.ORDER_ID =oi.ORDERITEM_ORDERID WHERE oi.ORDERITEM_ID = ? ";
  db.query(selectQuery, [orderItemId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
      return;
    }
    if (results.length === 0) {
      res.status(400).json({ error: "주문 상품을 찾을 수 없습니다." });
      return;
    }
    const orderState = results[0].ORDER_STATE;
    const buyCheck = results[0].ORDERITEM_BUYCHECK;

    if (orderState !== "배송완료") {
      res
        .status(400)
        .json({ error: "배송완료 상태가 아닙니다. 구매확정 할 수 없습니다." });
      return;
    }

    if (buyCheck === 1) {
      res.status(400).json({ error: "이미 구매확정 처리된 상품입니다." });
      return;
    }

    const updateQuery =
      "UPDATE orderitem SET ORDERITEM_BUYCHECK =1 WHERE ORDERITEM_ID =?";
    db.query(updateQuery, [orderItemId], (updateErr, results) => {
      if (updateErr) {
        console.error(updateErr);
        res.status(500).json({ error: "서버에러" });
      } else {
        res.json({ message: "구매확정 처리 되었습니다." });
      }
    });
  });
});

router.post("/getRecList", async (req, res) => {
  const email = req.body.email;

  db.query(
    `select * from moonmoon.order where ORDER_USER_EMAIL = ?`,
    email,
    (err, results) => {
      if (err) {
        res.status(200).send(err);
      } else {
        if (results.length == 0) {
          db.query(
            `select * from survey where SUR_USER_EMAIL = ?`,
            email,
            (err, result) => {
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
                db.query(
                  query,
                  [search1, search2, search3, search4, search5],
                  (err, results) => {
                    if (err) {
                      res.status(200).send("error" + err);
                    } else {
                      res.status(200).send(results);
                    }
                  }
                );
              }
            }
          );
        } else {
          db.query(
            `select distinct b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, b.BOOK_COVER, b.BOOK_PUBLISHER, (select COALESCE(ROUND(AVG(r2.REV_RATING), 1), 0) from review r2 where r2.REV_ORDERITEM_BOOK = b.BOOK_ID) AS reviewpoint, b.book_salespoint
                  from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
                  where BOOK_CATEGORYNAME = (SELECT BOOK_CATEGORYNAME
                  FROM book
                  WHERE BOOK_ID IN (
                      SELECT ORDERITEM_BOOK_ID
                      FROM moonmoon.order o
                      JOIN orderitem oi ON o.ORDER_ID = oi.ORDERITEM_ORDER_ID
                      WHERE o.ORDER_USER_EMAIL = ?
                  )
                  GROUP BY BOOK_CATEGORYNAME
                  ORDER BY COUNT(*) DESC
                  limit 1)
                  order by b.book_salespoint desc;`,
            email,
            (err, results2) => {
              if (err) {
                res.status(200).send(err);
              } else {
                res.status(200).send(results2);
              }
            }
          );
        }
      }
    }
  );
});

module.exports = router;

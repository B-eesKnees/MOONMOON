const express = require("express");
const db = require("../db");
const bcrypt = require("bcrypt");

const router = express.Router();

//이름,이메일 받아오기
router.post("/getuser", (req, res) => {
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
// router.get("/userpoint", (req, res) => {
//   const userEmail = req.query.userEmail;

//   if (!userEmail) {
//     res.status(400).json({ error: "이메일이 필요합니다" });
//     return;
//   }

//   const query = `SELECT user_point FROM user WHERE user_email =?; `;
//   db.query(query, [userEmail], (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).json({ error: "서버에러" });
//     } else {
//       if (results.length > 0) {
//         const userPoint = results[0].user_point;
//         res.json({ userPoint });
//       } else {
//         res.json({ userPoint: 0 });
//       }
//     }
//   });
// });

//총 쿠폰 개수

// 라우터 예시
router.get("/couponcount", (req, res) => {
    const userEmail = req.query.userEmail; // userEmail은 쿼리 파라미터로 변경
    const getCouponCount = `
    SELECT cpuser_user_email, COUNT(*) AS coupon_count
    FROM cpuser
    WHERE cpuser_user_email = ?;
  `;

    // 데이터베이스 쿼리 실행
    db.query(getCouponCount, [userEmail], (err, results) => {
        if (err) {
            console.error("에러발생:", err);
            res.status(500).json({ error: "에러발생" });
            return;
        }

        // 쿠폰 개수를 가져온 경우 결과의 첫 번째 레코드의 coupon_count를 사용
        const couponCount = results.length > 0 ? results[0].coupon_count : 0;

        // JSON 형태로 쿠폰 개수 응답
        res.json({ couponCount });
    });
});

//쿠폰 업데이트(6개월간의 user_total_pay 산정해서 지급)
router.post("/updatecoupon/:userEmail", (req, res) => {
    const userEmail = req.params.userEmail;

    // 현재 날짜
    const now = new Date();

    // 6개월 전의 날짜 (2월 1일)
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6, 1, 0, 0, 0));

    // 7월 31일의 마지막 시간 (23:59:59)
    const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), 6, 31, 23, 59, 59, 999));

    // 사용자의 sixMonthsAgo와 lastDayOfMonth 사이의 결제 총액을 구하는 쿼리
    const userPaymentQuery = `
    SELECT SUM(u.user_total_pay) AS totalPayment
    FROM user u
    JOIN \`order\` o ON u.user_email = o.order_user_email
    WHERE u.user_email = ? AND o.order_paydate >= ? AND o.order_paydate <= ?
  `;

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

        const totalPayment = userResults[0].user_total_pay || 0;

        // 사용자의 결제 총액 조회
        db.query(userPaymentQuery, [userEmail, sixMonthsAgo, lastDayOfMonth], (paymentError, paymentResults) => {
            if (paymentError) {
                console.error(paymentError);
                res.status(500).json({ error: "결제 총액 조회 중 오류가 발생했습니다." });
                return;
            }

            const userTotalPaymentInPeriod = paymentResults[0].totalPayment || 0;

            const gradeCouponQuery = `
        SELECT * FROM coupon
        WHERE (COUPON_GRADE = '프렌즈' AND ? < 100000)
        OR (COUPON_GRADE = '실버' AND ? >= 100000 AND ? < 200000)
        OR (COUPON_GRADE = '골드' AND ? >= 200000 AND ? < 300000)
        OR (COUPON_GRADE = '플래티넘' AND ? >= 300000);
      `;

            db.query(
                gradeCouponQuery,
                [
                    userTotalPaymentInPeriod,
                    userTotalPaymentInPeriod,
                    userTotalPaymentInPeriod,
                    userTotalPaymentInPeriod,
                    userTotalPaymentInPeriod,
                    userTotalPaymentInPeriod,
                ],
                (gradeCouponError, gradeCouponResults) => {
                    if (gradeCouponError) {
                        console.error(gradeCouponError);
                        res.status(500).json({
                            error: "등급 쿠폰 오류 발생",
                        });
                    } else {
                        const gradeCouponsToGive = gradeCouponResults;

                        // 기존에 유저가 해당 등급의 쿠폰을 이미 받았는지 확인
                        const existingCouponQuery = `
                SELECT COUNT(*) AS couponCount
                FROM cpuser
                WHERE CPUSER_USER_EMAIL = ? 
              `;

                        db.query(
                            existingCouponQuery,
                            [userEmail, gradeCouponsToGive[0].COUPON_GRADE],
                            (existingCouponError, existingCouponResults) => {
                                if (existingCouponError) {
                                    console.error(existingCouponError);
                                    res.status(500).json({
                                        error: "쿠폰 조회 실패.",
                                    });
                                } else {
                                    const couponCount = existingCouponResults[0].couponCount;

                                    if (couponCount > 0) {
                                        res.json({
                                            message: `이미 ${gradeCouponsToGive[0].COUPON_GRADE} coupon을 받았습니다.`,
                                            coupons: [],
                                        });
                                        return;
                                    }

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
                                                        reject("쿠폰 insert 실패.");
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
                                                message: "쿠폰이 정상적으로 발급되었습니다.",
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
                }
            );
        });
    });
});

//user 등급 (coupon_grade)가져오기
router.get("/coupongrade/:userEmail", (req, res) => {
    const userEmail = req.params.userEmail;

    const now = new Date();

    // 6개월 전의 날짜 (2월 1일)
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6, 1, 0, 0, 0));

    // 7월 31일의 마지막 시간 (23:59:59)
    const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), 6, 31, 23, 59, 59, 999));

    // 사용자의 sixMonthsAgo와 lastDayOfMonth 사이의 결제 총액을 구하는 쿼리
    const userPaymentQuery = `
    SELECT SUM(u.user_total_pay) AS totalPayment
    FROM user u
    JOIN \`order\` o ON u.user_email = o.order_user_email
    WHERE u.user_email = ? AND o.order_paydate >= ? AND o.order_paydate <= ?
  `;
    db.query(userPaymentQuery, [userEmail, sixMonthsAgo, lastDayOfMonth], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "결제 총액 조회 중 오류 발생" });
            return;
        }

        const userTotalPaymentInPeriod = results[0].totalPayment || 0;

        let userGrade = "프렌즈"; // 기본 등급을 프렌즈로 설정

        // 결제 총액에 따라 등급 결정
        if (userTotalPaymentInPeriod >= 300000) {
            userGrade = "플래티넘";
        } else if (userTotalPaymentInPeriod >= 200000) {
            userGrade = "골드";
        } else if (userTotalPaymentInPeriod >= 100000) {
            userGrade = "실버";
        }

        // 쿠폰 등급을 가져오는 쿼리
        const couponGradeQuery = `
      SELECT c.COUPON_GRADE
      FROM coupon c
      WHERE c.COUPON_GRADE = ?
    `;

        db.query(couponGradeQuery, [userGrade], (couponError, couponResults) => {
            if (couponError) {
                console.error(couponError);
                res.status(500).json({ error: "쿠폰 등급 조회 중 오류가 발생했습니다." });
                return;
            }

            const couponGrade = couponResults[0].COUPON_GRADE || "해당 없음";

            res.json({ userGrade, couponGrade });
        });
    });
});

//등급 업그레이드 시 필요한 구매급액
router.get("/couponupgrade/:userEmail", (req, res) => {
    const userEmail = req.params.userEmail;

    const now = new Date();

    // 6개월 전의 날짜 (2월 1일)
    const sixMonthsAgo = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 6, 1, 0, 0, 0));

    // 7월 31일의 마지막 시간 (23:59:59)
    const lastDayOfMonth = new Date(Date.UTC(now.getUTCFullYear(), 6, 31, 23, 59, 59, 999));

    // 사용자의 sixMonthsAgo와 lastDayOfMonth 사이의 결제 총액을 구하는 쿼리
    const userPaymentQuery = `
    SELECT SUM(u.user_total_pay) AS totalPayment
    FROM user u
    JOIN \`order\` o ON u.user_email = o.order_user_email
    WHERE u.user_email = ? AND o.order_paydate >= ? AND o.order_paydate <= ?
  `;

    db.query(userPaymentQuery, [userEmail, sixMonthsAgo, lastDayOfMonth], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "결제 총액 조회 중 오류 발생" });
            return;
        }

        const userTotalPaymentInPeriod = results[0].totalPayment || 0;

        let userGrade = "프렌즈"; // 기본 등급을 프렌즈로 설정

        // 결제 총액에 따라 등급 결정
        if (userTotalPaymentInPeriod >= 300000) {
            userGrade = "플래티넘";
        } else if (userTotalPaymentInPeriod >= 200000) {
            userGrade = "골드";
        } else if (userTotalPaymentInPeriod >= 100000) {
            userGrade = "실버";
        }

        // 등급 업그레이드를 위해 필요한 추가 결제 금액 계산
        let additionalPayment = 0;
        let upperGrade = "";

        if (userGrade === "프렌즈" && userTotalPaymentInPeriod < 100000) {
            additionalPayment = 100000 - userTotalPaymentInPeriod;
            upperGrade = "실버";
        } else if (userGrade === "실버" && userTotalPaymentInPeriod < 200000) {
            additionalPayment = 200000 - userTotalPaymentInPeriod;
            upperGrade = "골드";
        } else if (userGrade === "골드" && userTotalPaymentInPeriod < 300000) {
            additionalPayment = 300000 - userTotalPaymentInPeriod;
            upperGrade = "플래티넘";
        } else if (userGrade === "플래티넘" && userTotalPaymentInPeriod >= 300000) {
            additionalPayment = 0; // 플래티넘 등급은 최상위 등급이므로 추가 결제 금액은 없음
            upperGrade = ""; //더 높은 등급 없음음
        }

        res.json({
            userGrade,
            additionalPayment,
            message: "더 구매하면 " + upperGrade,
        });
    });
});
//전체 주문내역
router.get("/orderHistory", async (req, res) => {
    const userEmail = req.query.userEmail; // 사용자 이메일 파라미터 받아오기

    const query = `

    SELECT
      o.ORDER_ID,
      o.ORDER_PAYDATE,
      o.ORDER_STATE,
      o.ORDER_PAY,
      o.ORDER_USER_EMAIL,
      SUM(oi.ORDERITEM_CNT) AS ORDER_CNT,
      b.BOOK_TITLE,
      b.BOOK_AUTHOR,
      b.BOOK_COVER,
      oi.ORDERITEM_BOOK_ID
    FROM \`order\` o
    JOIN orderitem oi ON o.ORDER_ID = oi.ORDERITEM_ORDER_ID
    JOIN book b ON oi.ORDERITEM_BOOK_ID = b.BOOK_ID
    WHERE o.ORDER_USER_EMAIL = 'whitemk49@naver.com'
    GROUP BY
      o.ORDER_ID,
      o.ORDER_PAYDATE,
      o.ORDER_STATE,
      o.ORDER_PAY,
      o.ORDER_USER_EMAIL,
      b.BOOK_TITLE,
      b.BOOK_AUTHOR,
      b.BOOK_COVER,
      oi.ORDERITEM_BOOK_ID

      ORDER BY
       oi.ORDERITEM_BOOK_ID;
  `;

    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            const orders = {}; // 각 주문 정보를 저장할 객체
            results.forEach((result) => {
                const orderDate = new Date(result.ORDER_PAYDATE); // 데이터베이스에서 가져온 날짜 문자열을 Date 객체로 변환

                if (!orders[result.ORDER_ID]) {
                    orders[result.ORDER_ID] = {
                        ORDER_ID: result.ORDER_ID,
                        ORDER_PAYDATE: `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, "0")}-${orderDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`, // 원하는 형식으로 날짜 변환
                        ORDER_STATE: result.ORDER_STATE,
                        ORDER_PAY: result.ORDER_PAY,
                        ORDER_USER_EMAIL: result.ORDER_USER_EMAIL,
                        ORDER_CNT: 0,
                        items: [],
                    };
                }
                orders[result.ORDER_ID].ORDER_CNT += result.ORDER_CNT;
                // 주문에 대한 책 정보 객체를 배열에 추가
                orders[result.ORDER_ID].items.push({
                    ORDERITEM_CNT: result.ORDER_CNT, // 수정된 부분
                    BOOK_TITLE: result.BOOK_TITLE,
                    BOOK_AUTHOR: result.BOOK_AUTHOR,
                    BOOK_COVER: result.BOOK_COVER,
                });
            });

            // 객체를 배열로 변환하여 응답
            const modifiedResults = Object.values(orders);
            res.status(200).json(modifiedResults);
        }
    });
});

//배송준비일ㄸㅐ만 주문취소가능
router.post("/ordercancel", (req, res) => {
    const { orderId, userEmail } = req.body;

    const query = `SELECT * FROM moonmoon.order WHERE order_id = ? AND order_user_email = ?`;

    db.query(query, [orderId, userEmail], (err, results) => {
        if (err) {
            console.error("주문 조회 오류:", err);
            return res.status(500).json({ message: "주문 조회 과정에서 오류가 발생했습니다." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
        }

        const orderResult = results[0];
        console.log(orderResult.ORDER_STATE);
        if (orderResult.ORDER_STATE !== "배송준비") {
            return res.status(200).json({ message: "주문 취소가 불가능한 상태입니다." });
        }

        const query = `UPDATE moonmoon.order SET ORDER_STATE = '주문취소' WHERE ORDER_ID = ?`;

        db.query(query, [orderId], (updateErr) => {
            if (updateErr) {
                console.error("주문 취소 처리 오류:", updateErr);
                return res.status(500).json({ message: "주문 취소 과정에서 오류가 발생했습니다." });
            }

            return res.status(200).json({ message: "주문이 취소되었습니다." });
        });
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

    let query = `
    SELECT
    o.ORDER_ID,
    o.ORDER_PAYDATE,
    o.ORDER_STATE,
    o.ORDER_PAY,
    o.ORDER_USER_EMAIL,
    SUM(oi.ORDERITEM_CNT) AS ORDER_CNT,
    MAX(b.BOOK_TITLE) AS BOOK_TITLE,
    MAX(b.BOOK_COVER) AS BOOK_COVER,
    oi.ORDERITEM_BOOK_ID
FROM
    \`order\` AS o
JOIN
    ORDERITEM AS oi ON o.ORDER_ID = oi.ORDERITEM_ORDER_ID
JOIN
    BOOK AS b ON oi.ORDERITEM_BOOK_ID = b.BOOK_ID
WHERE
    o.ORDER_USER_EMAIL = ?
    AND o.ORDER_STATE = ?
GROUP BY
    o.ORDER_ID,
    o.ORDER_PAYDATE,
    o.ORDER_STATE,
    o.ORDER_PAY,
    o.ORDER_USER_EMAIL,
    oi.ORDERITEM_BOOK_ID
ORDER BY
    oi.ORDERITEM_BOOK_ID;
    `;

    db.query(query, [userEmail, orderState], (err, results) => {
        if (err) {
            console.error("에러발생:", err);
            res.status(500).json({ error: "에러발생" });
            return;
        }

        const orders = {};
        results.forEach((result) => {
            const orderDate = new Date(result.ORDER_PAYDATE);

            const order = {
                ORDER_ID: result.ORDER_ID,
                ORDER_PAYDATE: `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, "0")}-${orderDate
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`,
                ORDER_STATE: result.ORDER_STATE,
                ORDER_PAY: result.ORDER_PAY,
                ORDER_USER_EMAIL: result.ORDER_USER_EMAIL,
                ORDER_CNT: result.ORDER_CNT, // 주문 수량 정보 추가
                items: [],
            };

            if (!orders[order.ORDER_ID]) {
                orders[order.ORDER_ID] = order;
            }

            const item = {
                ORDERITEM_CNT: result.ORDERITEM_CNT,
                BOOK_TITLE: result.BOOK_TITLE,
                BOOK_COVER: result.BOOK_COVER,
            };
            orders[order.ORDER_ID].items.push(item);
        });

        const modifiedResults = Object.values(orders);
        res.json(modifiedResults);
    });
});
//주문검색(주문상품)
router.get("/ordersearchbook", (req, res) => {
    const userEmail = req.query.userEmail;
    const bookKeyword = req.query.bookKeyword;

    let query = `
        SELECT o.*, oi.*, b.BOOK_TITLE, b.BOOK_COVER
        FROM \`order\` AS o
        JOIN ORDERITEM AS oi ON o.ORDER_ID = oi.ORDERITEM_ORDER_ID
        JOIN BOOK AS b ON oi.ORDERITEM_BOOK_ID = b.BOOK_ID
        WHERE 1
    `;

    if (userEmail) {
        query += ` AND o.ORDER_USER_EMAIL = '${userEmail}'`;
    }

    if (bookKeyword) {
        const keywordWithoutSpaces = bookKeyword.replace(/\s+/g, ""); // Remove spaces
        query += ` AND REPLACE(b.BOOK_TITLE, ' ', '') LIKE '%${keywordWithoutSpaces}%'`;
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            res.status(500).json({ error: "Error fetching orders" });
            return;
        }

        const orders = {};
        results.forEach((result) => {
            const orderDate = new Date(result.ORDER_PAYDATE);

            const order = {
                ORDER_ID: result.ORDER_ID,
                ORDER_PAYDATE: `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, "0")}-${orderDate
                    .getDate()
                    .toString()
                    .padStart(2, "0")}`,
                ORDER_STATE: result.ORDER_STATE,
                ORDER_PAY: result.ORDER_PAY,
                ORDER_USER_EMAIL: result.ORDER_USER_EMAIL,
                items: [],
            };

            if (!orders[order.ORDER_ID]) {
                orders[order.ORDER_ID] = order;
            }

            const item = {
                ORDERITEM_CNT: result.ORDERITEM_CNT,
                BOOK_TITLE: result.BOOK_TITLE,
                BOOK_COVER: result.BOOK_COVER,
            };
            orders[order.ORDER_ID].items.push(item);
        });

        const modifiedResults = Object.values(orders);
        res.json(modifiedResults);
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

    let query = "SELECT * FROM `order` WHERE ORDER_PAYDATE BETWEEN ? AND ?";
    const queryParams = [formattedStartDate, formattedEndDate];

    if (userEmail) {
        query += " AND ORDER_USER_EMAIL = ?";
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

    const query = "SELECT ORDER_USER_EMAIL, DATE_FORMAT(ORDER_PAYDATE, '%y-%m-%d %T') AS ORDER_PAYDATE FROM `order` WHERE ORDER_USER_EMAIL = ?";

    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error("Error fetching orders:", err);
            res.status(500).json({ error: "Error fetching orders" });
            return;
        }

        // 변환된 날짜 형식을 다시 전체 결과 배열로 매핑
        const formattedResults = results.map((result) => ({
            ...result,
            ORDER_PAYDATE: result.ORDER_PAYDATE, // 날짜 형식은 이미 원하는 형식인 "yy-mm-dd"로 되어 있음
        }));

        res.json(formattedResults);
    });
});
//bookTitle, bookCover, orderPay,orderCnt 데이터 받아오기

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

// 구매확정 처리 (userEmail과 orderId 기반)
router.put("/updatebuycheck/:userEmail/:orderId", (req, res) => {
    const userEmail = req.params.userEmail;
    const orderId = req.params.orderId;

    const selectQuery = `
    SELECT o.ORDER_STATE
    FROM \`order\` o
    WHERE o.ORDER_ID = ? AND o.ORDER_USER_EMAIL = ?
  `;

    db.query(selectQuery, [orderId, userEmail], (selectErr, selectResults) => {
        if (selectErr) {
            console.error(selectErr);
            res.status(500).json({ error: "서버 에러" });
            return;
        }

        if (selectResults.length === 0) {
            res.status(400).json({ error: "주문을 찾을 수 없습니다." });
            return;
        }

        const orderState = selectResults[0].ORDER_STATE;

        if (orderState !== "배송완료") {
            res.status(400).json({
                error: "배송완료 상태가 아닙니다. 구매확정 할 수 없습니다.",
            });
            return;
        }

        const updateQuery = `
      UPDATE orderitem 
      SET ORDERITEM_BUYCHECK = 1, ORDERITEM_CONFIRMED_AT = NOW() 
      WHERE ORDERITEM_ORDER_ID = ?
    `;

        db.query(updateQuery, [orderId], (updateErr, updateResults) => {
            if (updateErr) {
                console.error(updateErr);
                res.status(500).json({ error: "서버 에러" });
                return;
            }

            res.json({ message: "구매확정 처리 되었습니다." });
        });
    });
});

//BUYCHCEK가져오는
router.get("/getbuycheck", (req, res) => {
    const orderId = req.query.orderId;
    const userEmail = req.query.userEmail;

    // 데이터베이스에서 주문 상세 정보 및 구매확정 상태를 조회하는 쿼리
    const query = `
        SELECT oi.ORDERITEM_BUYCHECK
        FROM ORDERITEM oi
        JOIN \`ORDER\` o ON oi.ORDERITEM_ORDER_ID = o.ORDER_ID
        WHERE oi.ORDERITEM_ORDER_ID = ? AND o.ORDER_USER_EMAIL = ?;
    `;

    db.query(query, [orderId, userEmail], (err, results) => {
        if (err) {
            console.error("구매확정 상태 조회 중 오류:", err);
            res.status(500).json({ message: "내부 서버 오류" });
        } else {
            if (results.length === 0) {
                res.status(404).json({ message: "주문의 구매확정 상태를 찾을 수 없습니다." });
            } else {
                const buyCheckStatus = results[0].ORDERITEM_BUYCHECK;
                res.json({ buyCheckStatus });
            }
        }
    });
});

//신간 책 가져오기
router.post(`/getNew`, async (req, res) => {
    db.query(
        `select b.BOOK_COVER, b.BOOK_ID, b.BOOK_TITLE, b.BOOK_AUTHOR, date_format(b.BOOK_PUBDATE, '%Y.%m.%d') as BOOK_PUBDATE, b.BOOK_PRICE, b.BOOK_DESCRIPTION, COALESCE(ROUND(AVG(r.REV_RATING), 1), 0) AS reviewpoint
      from book b left join review r on b.BOOK_ID = r.REV_ORDERITEM_BOOK
      group by b.BOOK_ID
      order by b.BOOK_PUBDATE LIMIT 8;`,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                res.status(200).send(result);
            }
        }
    );
});

//내가 쓴 리뷰 가져오기

router.get("/mypagereview/:email", (req, res) => {
    const userEmail = req.params.email;

    const query = `
  SELECT r.REV_WRITER, r.REV_COMMENT, r.REV_RATING, r.REV_CREATED_AT, b.BOOK_TITLE
  FROM REVIEW r
  JOIN BOOK b ON r.REV_ORDERITEM_BOOK = b.BOOK_ID
  WHERE r.REV_WRITER = ?
  ORDER BY r.REV_CREATED_AT DESC;
  `;

    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            res.json(results);
        }
    });
});

//마이페이지 리뷰 작성할 책 데이터
router.get("/notYetReview/:userEmail", (req, res) => {
    const userEmail = req.params.userEmail;

    const notReviewQuery = `
    SELECT oi.ORDERITEM_BOOK_ID, oi.ORDERITEM_CONFIRMED_AT,b.book_author, b.book_cover, b.book_title
    FROM orderitem oi
    JOIN book b ON oi.ORDERITEM_BOOK_ID = b.BOOK_ID
    WHERE oi.ORDERITEM_ORDER_ID IN (
      SELECT o.ORDER_ID
      FROM \`order\` o
      WHERE o.ORDER_USER_EMAIL = ? AND o.ORDER_STATE = '배송완료'
    )
    AND oi.ORDERITEM_BUYCHECK = 1 AND oi.ORDERITEM_REVCHECK = 0
  `;

    db.query(notReviewQuery, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            res.status(200).json(results);
        }
    });
});

router.post("/updateUserInfo", async (req, res) => {
    const email = req.body.email;
    const updatedFields = req.body.updatedFields;

    const add1 = updatedFields.updatedFields.add1;
    const add2 = updatedFields.updatedFields.add2;
    const zipcode = updatedFields.updatedFields.zipcode;
    const phone_num = updatedFields.updatedFields.phone_num;

    let query = `UPDATE moonmoon.user SET`;
    let queryParams = [];

    if (add1 !== null) {
        query += ` USER_ADD1 = ?,`;
        queryParams.push(add1);
    }

    if (add2 !== null) {
        query += ` USER_ADD2 = ?,`;
        queryParams.push(add2);
    }

    if (zipcode !== null) {
        query += ` USER_ZIPCODE = ?,`;
        queryParams.push(zipcode);
    }

    if (phone_num !== null) {
        query += ` USER_PHONE = ?,`;
        queryParams.push(phone_num);
    }

    query = query.slice(0, -1);
    query += ` WHERE USER_EMAIL = ?`;
    queryParams.push(email);

    db.query(query, queryParams, (err) => {
        if (err) {
            res.status(400).json({ error: "수정실패" });
        } else {
            res.status(200).json({ message: "회원정보 수정 완료" });
        }
    });
});
router.post("/updateUserPw", async (req, res) => {
    // console.log(req.body);
    const email = req.body.email;
    const password = req.body.updatedFields.password;

    let encryptedpw = null;

    if (password !== "") {
        encryptedpw = await bcrypt.hash(password, 12);
    }
    db.query(`update user set USER_PW = ? where USER_EMAIL = ?`, [encryptedpw, email], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send("비밀번호 변경 성공");
        }
    });

    // console.log(password);
});

// 회원정보 가져오는 라우터
router.get("/getUserInfo", async (req, res) => {
    const userEmail = req.query.userEmail; // 쿼리 파라미터로 사용자 이메일 받아오기

    const query = `SELECT * FROM user WHERE user_email = ?`;

    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
        } else {
            if (results.length > 0) {
                const user = results[0]; // 첫 번째 사용자 정보 가져오기

                const userInfo = {
                    email: user.USER_EMAIL,
                    name: user.USER_NAME,
                    password: "", // 비밀번호는 보내지 않도록 설정
                    sex: user.USER_SEX,
                    age: user.USER_AGEGROUP,
                    add1: user.USER_ADD1,
                    add2: user.USER_ADD2,
                    zipcode: user.USER_ZIPCODE,
                    phone_num: user.USER_PHONE,
                };

                res.status(200).json(userInfo);
            } else {
                res.status(404).json({ error: "사용자 정보를 찾을 수 없음" });
            }
        }
    });
});
router.post("/getNextGra", async (req, res) => {
    const now = new Date();
    //7월 31일
    const seven = new Date(Date.UTC(now.getUTCFullYear(), 6, 31, 23, 59, 59, 999));
    //8월 31일
    const eight = new Date(Date.UTC(now.getUTCFullYear(), 7, 31, 23, 59, 59, 999));

    const userEmail = req.body.email;

    const userPaymentQuery = `
    SELECT SUM(o.ORDER_PAY) AS totalPayment
    FROM user u
    JOIN \`order\` o ON u.user_email = o.order_user_email
    WHERE u.user_email = ? AND o.order_paydate >= ? AND o.order_paydate <= ?
  `;

    db.query(userPaymentQuery, [userEmail, seven, eight], (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

// 구매확정 여부 받아오는 코드

//-----------------------------------------------------------

module.exports = router;

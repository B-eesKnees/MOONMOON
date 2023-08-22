const express = require("express");
const db = require("../db");

const router = express.Router();

const queries = {
    payUserInfoQuery: `select USER_NAME, USER_PHONE, USER_ADD1, USER_ADD2
                     from user
                     where USER_EMAIL = ?`,

    payBookInfoQuery: `SELECT b.BOOK_COVER as image, b.BOOK_TITLE as name, b.BOOK_PRICE as price, o.ORDERITEM_CNT as quantity, o.ORDERITEM_PRICE as totalPrice
                     FROM book b
                     JOIN orderitem o ON b.BOOK_ID = o.ORDERITEM_BOOK_ID
                     where o.ORDERITEM_ORDER_ID = ?`,

    couponListQuery: `SELECT c.COUPON_NAME as name, c.COUPON_RATIO as ratio
                    FROM coupon c
                    JOIN cpuser cu ON c.COUPON_ID = cu.CPUSER_COUPON_ID
                    WHERE cu.CPUSER_USER_EMAIL = ?`,

    userPointQuery: `select USER_POINT
                   from user
                   where USER_EMAIL = ?`,

    bookCountQuery: `select sum(ORDERITEM_CNT) as ORDERITEM_CNT
                   from orderitem
                   where ORDERITEM_ORDER_ID = ?`,

    originalPriceQuery: `select sum(ORDERITEM_PRICE*ORDERITEM_CNT) as oP
                       from orderitem
                       where ORDERITEM_ORDER_ID = ?`,

    updatePriceDataQuery: `update \`order\`
                         set ORDER_PAY = ?, ORDER_COST = ?, ORDER_COUPON = ?, ORDER_USEPOINT = ?, ORDER_ADDPOINT = ?, ORDER_PAYMETHOD = ?, ORDER_PAYDATE= CURRENT_TIMESTAMP, ORDER_STATE= ?
                         where ORDER_ID = ?;`,
};

// 데이터베이스 작업 함수
const req = async (query, params) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (error, rows) => {
            if (error) {
                console.log(error);
                resolve({ error });
            } else {
                resolve(rows);
            }
        });
    });
};

// 가입시 입력한 유저/배송지 정보 출력  --ok
router.post("/payUserInfo", async (request, res) => {
    try {
        const userEmail = request.body.userEmail;

        res.send(await req(queries.payUserInfoQuery, userEmail));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 배송지 주소 변경 - 변경한 주소 받아오기
/* router.post('/payAddEdit', (req, res) => {

  const {  } = req.body;

  const query = ``;

  db.query(query, [], (error, result) => {
    if (error) {
      return console.log(error);
    }
    if (result) {
      res.send(alertMove('글이 수정되었습니다', '/qna'));  // 없애고 redirect 사용
    }
  });
});
 */

//

// 주문 상품 총 개수  --ok
router.get("/bookCount", async (request, res) => {
    try {
        const ORDERITEM_ORDER_ID = request.query.payID;

        res.send(await req(queries.bookCountQuery, ORDERITEM_ORDER_ID));
        console.log(ORDERITEM_ORDER_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 상품 정보 출력  --ok
router.post("/payBookInfo", async (request, res) => {
    try {
        const ORDERITEM_ORDER_ID = request.body.payID;

        res.send(await req(queries.payBookInfoQuery, ORDERITEM_ORDER_ID));
        console.log(ORDERITEM_ORDER_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

//------할인 쿠폰 적용
// 사용 가능한 쿠폰 조회 --ok
router.get("/couponList", async (request, res) => {
    try {
        const userEmail = request.query.userEmail;

        res.send(await req(queries.couponListQuery, userEmail));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 사용자가 선택한 쿠폰 가격에 적용
router.post("/applyCoupon", (request, res) => {
    // req.body.selectedCoupon
    const selectedCouponRatio = request.body.selectedCoupon;
    // 선택한 쿠폰의 CouponRatio 받아올 수 있나??? 받아올 수 있으면 위에 selectedCoupon 변수는 빼도 됨
    const originalPrice = request.body.originalPrice; // 쿠폰 적용 전 금액 -- 변수 수정해야함!!!!!!!!!!!!!
    console.log(selectedCouponRatio);
    console.log(originalPrice);

    const applyCouponPrice = calAfterCouponPrice(selectedCouponRatio, originalPrice);
    res.send({ applyCouponPrice });
});

//-----포인트 적용
// 포인트 조회 --ok
router.get("/userPoint", async (request, res) => {
    try {
        const userEmail = request.query.userEmail;

        res.send(await req(queries.userPointQuery, userEmail));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 사용자가 선택한 포인트 가격에 적용

// 상품 금액(총), 배송비, 사용 포인트, 총금액(할인 후), 적립포인트 입력 후 출력
//----입력

//----출력
router.get("/payInfo", (req, res) => {
    const userEmail = "ORDER_ID"; // 아마 ORDER_ID

    const query = ``;

    db.query(query, userEmail, (error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result) {
            res.send({ payInfo: result }); // res.render?-x  res.json?
        }
    });
});

// 가격 관련 ------------------------------------------------------------
// 상품 금액 (정가 합)
router.get("/originalPrice", async (request, res) => {
    try {
        const ORDERITEM_ORDER_ID = request.query.payID;

        res.send(await req(queries.originalPriceQuery, ORDERITEM_ORDER_ID));
        console.log(ORDERITEM_ORDER_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});
// 가격 디비에 저장
router.post("/updatePriceData", async (request, res) => {
    try {
        const ORDER_PAY = request.body.finalPrice;
        const ORDER_COST = request.body.deliveryFee;
        const ORDER_COUPON = request.body.applyCouponPrice;
        const ORDER_USEPOINT = request.body.applyPointPrice;
        const ORDER_ADDPOINT = request.body.earnPoint;
        const ORDER_ID = request.body.payID;
        const ORDER_PAYMETHOD = request.body.payMethod;
        const ORDER_PAYDATE = request.body.payDate;
        const ORDER_STATE = request.body.payState;

        res.send(await req(queries.updatePriceDataQuery, [ORDER_PAY, ORDER_COST, ORDER_COUPON, ORDER_USEPOINT, ORDER_ADDPOINT, ORDER_PAYMETHOD, ORDER_STATE, ORDER_ID]));
        console.log("ORDER_PAY:", ORDER_PAY);
        console.log("ORDER_COST:", ORDER_COST);
        console.log("ORDER_COUPON:", ORDER_COUPON);
        console.log("ORDER_USEPOINT:", ORDER_USEPOINT);
        console.log("ORDER_ADDPOINT:", ORDER_ADDPOINT);
        console.log("ORDER_ID:", ORDER_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// calFinalPrice 함수 선언
function calAfterCouponPrice(couponRatio, originalPrice) {
    const parsedCouponRatio = parseFloat(couponRatio);

    if (isNaN(parsedCouponRatio)) {
        // 변환 불가능하면 원래 가격 반환
        return originalPrice;
    }

    const discountPer = parsedCouponRatio * 0.01;
    const discountPrice = originalPrice * (1 - discountPer);

    return discountPrice;
}

module.exports = router;

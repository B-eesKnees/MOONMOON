const express = require("express");
const db = require("../db");

const router = express.Router();

// 가입시 입력한 유저/배송지 정보 출력  --ok
router.get("/payUserInfo", (req, res) => {
    const userEmail = req.body.userEmail; // req.body.userEmail
    console.log(userEmail);
    const query = `select USER_NAME, USER_PHONE, USER_ADD1, USER_ADD2
                 from user
                 where USER_EMAIL = ?`;

    db.query(query, userEmail, (error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result.length > 0) {
            res.send({ payUserInfo: result }); // res.render?-x  res.json?
        }
    });
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

// 상품 정보 출력  --ok
router.get("/payBookInfo", (req, res) => {
    const ORDERITEM_ORDER_ID = req.body.orderid; // req.body.orderid

    const query = `SELECT b.BOOK_COVER, b.BOOK_TITLE, b.BOOK_PRICE, o.ORDERITEM_CNT, o.ORDERITEM_PRICE
                 FROM book b
                 JOIN orderitem o ON b.BOOK_ID = o.ORDERITEM_BOOK_ID
                 where o.ORDERITEM_ORDER_ID = ?`;

    db.query(query, [ORDERITEM_ORDER_ID], (error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result) {
            res.send({ payBookInfo: result }); // res.render?-x  res.json?
            console.log(req.body.orderid);
        }
    });
});

//------할인 쿠폰 적용
// 사용 가능한 쿠폰 조회 --ok
router.get("/CouponList", (req, res) => {
    const userEmail = req.body.userEmail; // req.body.userEmail

    const query = `SELECT c.COUPON_NAME, c.COUPON_RATIO, c.COUPON_PRICE, date_format(c.COUPON_MAXDATE, '%Y-%m-%d') AS COUPON_MAXDATE
                 FROM coupon c
                 JOIN cpuser cu ON c.COUPON_ID = cu.CPUSER_COUPON_ID
                 WHERE cu.CPUSER_USER_EMAIL = ?`;

    db.query(query, userEmail, (error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result) {
            res.send({ CouponList: result }); // res.render?-x  res.json?
        }
    });
});

// 사용자가 선택한 쿠폰 가격에 적용 --ok
router.post("/applyCoupon", (req, res) => {
    const selectedCoupon = req.body.selectedCoupon; // req.body.selectedCoupon
    const selectedCouponRatio = req.body.selectedCouponRatio;
    // 선택한 쿠폰의 CouponRatio 받아올 수 있나??? 받아올 수 있으면 위에 selectedCoupon 변수는 빼도 됨
    const originalPrice = 10000; // 쿠폰 적용 전 금액 -- 변수 수정해야함!!!!!!!!!!!!!

    const applyCouponPrice = calAfterCouponPrice(selectedCouponRatio, originalPrice);
    res.send({ applyCouponPrice });
});

//-----포인트 적용
// 포인트 조회 --ok
router.get("/userPoint", (req, res) => {
    const userEmail = req.body.userEmail; // req.body.userEmail

    const query = `select USER_POINT
                 from user
                 where USER_EMAIL = ?`;

    db.query(query, userEmail, (error, result) => {
        if (error) {
            return console.log(error);
        }
        if (result) {
            res.send({ userPoint: result }); // res.render?-x  res.json?
        }
    });
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

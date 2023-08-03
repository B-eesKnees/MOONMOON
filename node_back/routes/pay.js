const express = require("express");
const db = require("../db");

const router = express.Router();


// 가입시 입력한 배송지 정보 출력
router.get('/payAdd', (req, res) => {
  
  const userEmail = 'user1@example.com';  // req.body.userEmail

  const query = ``;

 db.query(query, userEmail, (error, result) => {
  if (error) {
    return console.log(error);
  } 
  if (result) {
    res.send({qnaList: result});  // res.render?-x  res.json?
  }
 })
});


// 배송지 주소 변경 - 변경한 주소 받아오기
router.post('/payAddEdit', (req, res) => {

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


// 상품 정보 출력
router.get('/payBookInfo', (req, res) => {
  
  const ORDERITEM_ID = '';  // ORDERITEM 테이블에 각 책별 이미지 컬럼 추가하기

  const query = ``;

 db.query(query, userEmail, (error, result) => {
  if (error) {
    return console.log(error);
  } 
  if (result) {
    res.send({payBookList: result});  // res.render?-x  res.json?
  }
 })
});



// 할인 쿠폰 적용 - 개인 쿠폰 조회 후 출력, 사용한 쿠폰 번호 받아오기, 적용 금액/적용 후 금액 출력
//----쿠폰 조회

//----사용한 쿠폰 디비에 입력

//----적용 금액/적용 후 금액 -> 이거 그냥 위에 사용한 포인트 디비에 입력에서 서브쿼리로 적용해도 되려나




// 포인트 적용 - 개인 포인트 조회 후 출력, 사용한 포인트 금액 받아오기, 적용 금액/적용 후 금액 출력
//----포인트 조회

//----사용한 포인트 디비에 입력

//----적용 금액/적용 후 금액 -> 이거 그냥 위에 사용한 포인트 디비에 입력에서 서브쿼리로 적용해도 되려나




// 상품 금액(총), 배송비, 사용 포인트, 총금액(할인 후), 적립포인트 입력 후 출력
//----입력

//----출력
router.get('/payInfo', (req, res) => {
  
  const userEmail = 'ORDER_ID';  // 아마 ORDER_ID

  const query = ``;

 db.query(query, userEmail, (error, result) => {
  if (error) {
    return console.log(error);
  } 
  if (result) {
    res.send({payInfo: result});  // res.render?-x  res.json?
  }
 })
});




module.exports = router;
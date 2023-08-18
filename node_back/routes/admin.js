const express = require("express");
const db = require("../db");

const router = express.Router();


const queries = {
  adminBookLatestQuery: `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y-%m-%d') as BOOK_PUBDATE, BOOK_PRICE, BOOK_COVER, BOOK_CATEGORYNAME, BOOK_PUBLISHER, BOOK_SALESPOINT
                         from book
                         order by BOOK_ID desc;`,

  adminBookSalesPointQuery: `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y-%m-%d') as BOOK_PUBDATE, BOOK_PRICE, BOOK_COVER, BOOK_CATEGORYNAME, BOOK_PUBLISHER, BOOK_SALESPOINT
                             from book
                             order by BOOK_SALESPOINT desc;`,

  adminBookDelQuery: `delete from book
                      where BOOK_ID = ?`,

  adminUserLatestQuery: `select USER_EMAIL, USER_SEX, USER_AGEGROUP, USER_NAME, date_format(USER_REGDATE, '%Y-%m-%d') as USER_REGDATE, USER_PHONE, USER_ADD1, USER_ADD2, USER_TOTAL_PAY, USER_POINT, USER_PROVIDER, USER_ZIPCODE
                         from user
                         order by USER_REGDATE desc;`,

  adminUserDelQuery: `delete from user
                      where USER_EMAIL = ?`,

  adminQnaWaitQuery: `select QNA_ID, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_USER_EMAIL, QNA_TITLE, QNA_CON
                      from qna
                      where QNA_REP = 0`,

  adminQnaDoneQuery: `select QNA_ID, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_USER_EMAIL, QNA_TITLE, QNA_CON, QNA_REPLY
                      from qna
                      where QNA_REP = 1
                      order by QNA_DATE desc`,

  adminOrderListQuery: ``,
}


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


// 책 관리 페이지 -----------
// 최신순 정렬  --ok
router.post('/adminBookLatest', async (request, res) => {

  try {
    res.send(await req(queries.adminBookLatestQuery, undefined));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});
// 세일즈 포인트 순 정렬  --ok
router.post('/adminBookSalesPoint', async (request, res) => {

  try {
    res.send(await req(queries.adminBookSalesPointQuery, undefined));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});
// 책 삭제  --ok
router.post('/adminBookDel', async (request, res) => {

  try {
   let BOOK_ID = request.body.bookId;
   BOOK_ID = Number(BOOK_ID);

     res.send(await req(queries.adminBookDelQuery, BOOK_ID));
     console.log(BOOK_ID);
  } catch (err) {
   res.status(500).send({
     error: err
   });
  }  
});


// 회원 관리 -------------------
// 최근 가입순 정렬  --ok
router.post('/adminUserLatest', async (request, res) => {

  try {
    res.send(await req(queries.adminUserLatestQuery));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});
// 등급별 어떻게 하지 - 프론트? 백?

// 회원 삭제  --ok
router.post('/adminUserDel', async (request, res) => {

  try {
   const USER_EMAIL = request.body.userEmail;

     res.send(await req(queries.adminUserDelQuery, USER_EMAIL));
     console.log(USER_EMAIL);
  } catch (err) {
   res.status(500).send({
     error: err
   });
  }  
});


// 문의 관리 --------------
// 답변 대기 (과거순 정렬)  --ok
router.post('/adminQnaWait', async (request, res) => {

  try {
    res.send(await req(queries.adminQnaWaitQuery));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});
// 답변 완료 (최근순)  --ok
router.post('/adminQnaDone', async (request, res) => {

  try {
    res.send(await req(queries.adminQnaDoneQuery));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});
// 답변 - update



// 주문 관리 ------------------
// 주문 (최근 주문순)
router.post('/adminOrderList', async (request, res) => {

  try {
    res.send(await req(queries.adminOrderListQuery));
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
});




//오늘 방문자 수
router.post(`/getTodayV`, async (req, res) => {
  //오늘 날짜 new Date().toLocaleDateString()
  const today = req.body.today;
  console.log(today);

  db.query(`select vc_count from viewcount where vc_date = ?`, today, (err, results) => {
      if (err) {
          res.status(200).send(err);
      } else {
          res.status(200).json(results);
      }
  });
});
//날자별 방문자 수
router.post("/getTotalV", async (req, res) => {
  db.query(`select vc_count, vc_date from viewcount`, (err, results) => {
      if (err) {
          res.status(200).send(err);
      } else {
          res.status(200).json(results);
      }
  });
});



module.exports = router;
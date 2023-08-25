const express = require("express");
const db = require("../db");

const router = express.Router();


const queries = {
  adminBookLatestQuery: `select BOOK_ID, BOOK_TITLE, BOOK_AUTHOR, date_format(BOOK_PUBDATE, '%Y-%m-%d') as PUBDATE, BOOK_PRICE, BOOK_COVER, BOOK_CATEGORYNAME, BOOK_PUBLISHER, BOOK_SALESPOINT
                         from book
                         order by BOOK_PUBDATE desc;`,

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

  adminQnaWaitQuery: `select QNA_ID, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_USER_EMAIL, QNA_TITLE, QNA_CON, QNA_REP
                      from qna
                      where QNA_REP = 0`,

  adminQnaDoneQuery: `select QNA_ID, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_USER_EMAIL, QNA_TITLE, QNA_CON, QNA_REPLY
                      from qna
                      where QNA_REP = 1
                      order by QNA_DATE desc`,

  adminQnaReplyQuery: `update qna
                       set QNA_REPLY = ?, QNA_REP = 1
                       where QNA_ID = ?`,

  adminOrderListQuery: `select ORDER_ID, ORDER_USER_EMAIL, date_format(ORDER_PAYDATE, '%Y-%m-%d') as ORDER_DATE, ORDER_STATE
                        from \`order\`
                        where ORDER_STATE = '배송준비' or ORDER_STATE = '배송중' or ORDER_STATE = '배송완료' or ORDER_STATE = '주문취소'`,

  adminOrderDetailQuery: `select o.ORDER_ID, o.ORDER_USER_EMAIL, date_format(o.ORDER_PAYDATE, '%Y-%m-%d') as ORDER_DATE, u.USER_NAME as ORDER_NAME, u.USER_PHONE as ORDER_TEL, u.USER_ZIPCODE as ORDER_ZIPCODE, u.USER_ADD1 as ORDER_ADD, u.USER_ADD2  as ORDER_ADDDETAIL, o.ORDER_CNT, o.ORDER_PAY, o.ORDER_COST, o.ORDER_COUPON, o.ORDER_USEPOINT, o.ORDER_ADDPOINT, o.ORDER_PAYMETHOD, o.ORDER_STATE
                        from moonmoon.order o join user u on o.ORDER_USER_EMAIL = u.USER_EMAIL
                        where (ORDER_STATE = '배송준비' or ORDER_STATE = '배송중' or ORDER_STATE = '배송완료' or ORDER_STATE = '주문취소') and ORDER_ID = ?`,

  adminOrderItemDetailQuery: `select oi.ORDERITEM_BOOK_ID, oi.ORDERITEM_PRICE, oi.ORDERITEM_CNT
                              from orderitem oi
                              join \`order\` o on oi.ORDERITEM_ORDER_ID = o.ORDER_ID
                              where (o.ORDER_STATE = '배송준비' or o.ORDER_STATE = '배송중' or o.ORDER_STATE = '배송완료' or o.ORDER_STATE = '주문취소') and oi.ORDERITEM_ORDER_ID = ?`,

  adminStatusChangeQuery: `update \`order\`
                           set ORDER_STATE = '배송중'
                           where ORDER_STATE = '배송준비' and ORDER_ID in (?)`,

  adminDaySalesQuery: `select sum(ORDER_PAY) as daySales
                       from \`order\`
                       where ORDER_PAYDATE BETWEEN ? and ?`,

  userSexRatioQuery: `SELECT
                        SUM(CASE WHEN USER_SEX = 'f' THEN 1 ELSE 0 END) AS female_count,
                        SUM(CASE WHEN USER_SEX = 'm' THEN 1 ELSE 0 END) AS male_count,
                        COUNT(*) AS total_count,
                        ROUND((SUM(CASE WHEN USER_SEX = 'f' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS female_percentage,
                        ROUND((SUM(CASE WHEN USER_SEX = 'm' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS male_percentage
                      FROM user;`,

  bestCategoryQuery: `SELECT b.BOOK_CATEGORYNAME, SUM(oi.ORDERITEM_CNT) AS TOTAL_SALES
                      FROM orderitem oi
                      JOIN book b ON oi.ORDERITEM_BOOK_ID = b.BOOK_ID
                      JOIN \`order\` o ON oi.ORDERITEM_ORDER_ID = o.ORDER_ID
                      WHERE (o.ORDER_STATE = '배송준비' OR o.ORDER_STATE = '배송중' OR o.ORDER_STATE = '배송완료')
                      GROUP BY b.BOOK_CATEGORYNAME
                      ORDER BY TOTAL_SALES DESC
                      LIMIT 5`,
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
      error: err
    });
  }
});
// 세일즈 포인트 순 정렬  --ok
router.post('/adminBookSalesPoint', async (request, res) => {

  try {
    res.send(await req(queries.adminBookSalesPointQuery, undefined));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
// 책 삭제  --ok
router.post('/adminBookDel', async (request, res) => {

  try {
    let BOOK_ID = request.body.book_id;
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
      error: err
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
      error: err
    });
  }
});
// 답변 완료 (최근순)  --ok
router.post('/adminQnaDone', async (request, res) => {

  try {
    res.send(await req(queries.adminQnaDoneQuery));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
// 답변  --ok
router.post('/adminQnaReply', async (request, res) => {

  try {
    const QNA_REPLY = request.body.qna_reply;

    const QNA_ID = request.body.qna_id;

    return res.send(await req(queries.adminQnaReplyQuery, [QNA_REPLY, QNA_ID]));
    console.log(qna_reply);
    console.log(qna_id);
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});


// 주문 관리 ------------------ 배송 상태별 모아보기는 v-if 하면 될 듯, 안되면 노션에 써줘
// 주문 (최근 주문순) - 리스트
// -모든 주문에 대한 간단한 정보(리스트 출력시 사용)  --ok
router.post('/adminOrderList', async (request, res) => {

  try {
    res.send(await req(queries.adminOrderListQuery));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
// 주문 내역 - 상세(order)
// -모달 창에 띄워지는 각 주문에 대한 정보  --ok
router.post("/adminOrderDetail", async (request, res) => {
  try {
    const ORDER_ID = request.body.order_id;

    res.send(await req(queries.adminOrderDetailQuery, ORDER_ID));
    console.log(ORDER_ID);
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
// 주문 내역 - 상세(orderitem)  --ok
// -각 주문에 주문된 책에 대한 정보(배열)_여러개라 반복문으로 돌려서 받아야할 듯
router.post("/adminOrderItemDetail", async (request, res) => {
  try {
    const ORDER_ID = request.body.order_id;

    res.send(await req(queries.adminOrderItemDetailQuery, ORDER_ID));
    console.log(ORDER_ID);
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
// 주문 상태 변경_배송준비 > 배송중  --ok
router.post('/adminStatusChange', async (request, res) => {

  try {
    const ORDER_ID = request.body.order_id;

    return res.send(await req(queries.adminStatusChangeQuery, [ORDER_ID]));
    console.log(order_id);
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});


// 매출 관리 ---------------------
// 일매출 계산  --ok
// -혹시 하다가 당일/전일 계산 따로 필요하면 노션에 써줘
router.post('/adminDaySales', async (request, res) => {

  try {
    const dateStart = request.body.date_start;
    // '2023-08-17 00:00:00' 이런식으로 원하는 날짜에 00:00:00 붙여서 보내줘야됨
    const dateEnd = request.body.date_end;
    // '2023-08-17 23:59:59' 이건 23:59:59 붙여서

    return res.send(await req(queries.adminDaySalesQuery, [dateStart, dateEnd]));
    console.log(date_start);
    console.log(date_end);
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});

// 성별 분포
router.post('/userSexRatio', async (request, res) => {

  try {
    res.send(await req(queries.userSexRatioQuery));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});
//------- 프론트에서 이런식으로 받으면 돼
/* axios.get("/api/getUserSexRatio")
  .then(response => {
    const data = response.data;
    const femaleCount = data.female_count;
    const MaleCount = data.male_count;
    const femalePercentage = data.female_percentage;
    const malePercentage = data.male_percentage; */

// 많이 팔린 장르 top5
router.post('/bestCategory', async (request, res) => {

  try {
    res.send(await req(queries.bestCategoryQuery));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  }
});















//오늘 방문자 수
router.post(`/getTodayV`, async (request, res) => {
  //오늘 날짜 new Date().toLocaleDateString()
  const today = request.body.today;
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
router.post("/getTotalV", async (request, res) => {
  db.query(`select vc_count, vc_date from viewcount`, (err, results) => {
    if (err) {
      res.status(200).send(err);
    } else {
      res.status(200).json(results);
    }
  });
});



module.exports = router;
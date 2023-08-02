const express = require("express");
const db = require("../db");

const router = express.Router();


// 문의 내역 출력  --ok
router.get('/qnaList', (req, res) => {
  
    const userEmail = 'user1@example.com';  // req.body.userEmail
    const query = `select QNA_ID, QNA_REP, QNA_TITLE, QNA_DATE, QNA_CON, QNA_REPLY
                   from qna
                   where QNA_USERID = ?
                   order by QNA_DATE desc`;

   db.query(query, userEmail, (error, result) => {
    if (error) {
      return console.log(error);
    } 
    if (result) {
      res.send({qnaList: result});  // res.render? res.json?
    }
   })
  });


/* // 문의 내용 출력 (V-FOR로 쓰면 인덱스 보낼 수 있음)
router.post('/qnaView', async (req, res) => {
  const index = Number(req.query.index);
  const query = ``;
  db.query(query, (error, result) => {
    if (error) return console.log(error);

    if (result) {
      res.render('qna.vue', {qnaView:result[0]});
    }
  });
}); */

// 문의글 작성  
//--?post 요청은 됐다 db에 들어왂다!!
// get 요청이 왜 같이 들어오지..(아무래도 redirect 부분인 듯..)
router.post('/qnaWrite', (req, res) => {
  const QNA_USERID = 'user1@example.com';  // req.body.email
  const { QNA_TITLE, QNA_CON } = req.body;
  const QNA_REP = 0;
  const query = `INSERT INTO qna (QNA_USERID, QNA_TITLE, QNA_CON, QNA_REP)
                 VALUES (?,?,?,?)`;
  
  if (QNA_TITLE ==='' || QNA_CON ==='') {
    res.send(alertMove('제목이나 내용을 입력해주세요', '/qna/write'));
  } else {
    db.query(query, [QNA_USERID, QNA_TITLE, QNA_CON, QNA_REP], (error, result) => {
      if (error) {
        return console.log(error);
      }
      if (result) {
        return res.redirect(`/qna`);
      }
    });
  }
});

// 문의 내용 수정


// 문의 삭제

// 문의 답변 작성(admin 계정만)

// 답변 달렸을 시 db에 반영


//alertMove함수 선언
function alertMove(msg, path) {
  let script = `
  <script type="text/javascript">
  alert("${msg}")
  location.href="${path}"
  </script>
  `
  return script
}

module.exports = router;
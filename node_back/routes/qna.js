const express = require("express");
const router = express.Router();


// 문의 내역 출력
router.post('/qnaList', async (req, res) => {
  try {
    const userEmail = req.body.userEmail;
    const query = ``;

    res.send(await req(query, userEmail));
  } catch (err) {
    res.status(500).send({
      error: err
    });
  } 
});

res.render('', {userEmail})

// 문의 내용 출력 (V-FOR로 쓰면 인덱스 보낼 수 있음)
router.post('/qnaView', async (req, res) => {
  const index = Number(req.query.index);
  const query = ``;
  db.query(query, (error, result) => {
    if (error) return console.log(error);

    if (result) {
      res.render('qna.vue', {qnaView:result[0]});
    }
  });
});

// 문의 내용 수정

// 문의 삭제

// 문의글 작성
router.post('/qnaWrite', async (req, res) => {
  const name = req.body.email;
  const query = ``;


})
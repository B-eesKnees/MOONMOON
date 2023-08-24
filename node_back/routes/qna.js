const express = require("express");
const db = require("../db");

const router = express.Router();

const queries = {
    qnaAllQuery: `select QNA_ID, QNA_REP, QNA_TITLE, QNA_DATE as qd, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_CON, QNA_REPLY
                from qna
                where QNA_USER_EMAIL = ?
                order by qd desc;`,

    qnaWaitQuery: `select QNA_ID, QNA_TITLE, QNA_DATE as qd, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_CON, QNA_REPLY
                    from qna
                    where QNA_USER_EMAIL = ? and QNA_REP = 0
                    order by qd desc;`,

    qnaDoneQuery: `select QNA_ID, QNA_TITLE, QNA_DATE as qd, date_format(QNA_DATE, '%Y-%m-%d') as QNA_DATE, QNA_CON, QNA_REPLY
                 from qna
                 where QNA_USER_EMAIL = ? and QNA_REP = 1
                 order by qd desc;`,

    qnaWriteQuery: `INSERT INTO qna (QNA_USER_EMAIL, QNA_TITLE, QNA_CON, QNA_REP)
                  VALUES (?,?,?,?)`,

    qnaDelQuery: `delete from qna
                where QNA_ID = ?`,

    qnaOriginalDataQuery: `select QNA_TITLE, QNA_CON
                         from qna
                         where QNA_ID = ?`,

    qnaEditQuery: `update qna
                 set QNA_TITLE = ?, QNA_CON = ?
                 where QNA_ID = ?`,
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

// 문의 내역 출력_all  --ok
router.post("/qnaAll", async (request, res) => {
    try {
        const userEmail = request.body.email;

        res.send(await req(queries.qnaAllQuery, [userEmail]));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 문의 내역 출력_wait  --ok
router.post("/qnaWait", async (request, res) => {
    try {
        const userEmail = request.body.email;

        res.send(await req(queries.qnaWaitQuery, [userEmail]));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 문의 내역 출력_done  --ok
router.post("/qnaDone", async (request, res) => {
    try {
        const userEmail = request.body.email;

        res.send(await req(queries.qnaDoneQuery, [userEmail]));
        console.log(userEmail);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
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

// 문의글 작성 --ok
router.post("/qnaWrite", async (request, res) => {
    try {
        const userEmail = request.body.email;
        const QNA_TITLE = request.body.qna_title;
        const QNA_CON = request.body.qna_con;
        const QNA_REP = request.body.qna_rep;

        if (QNA_TITLE === "" || QNA_CON === "") {
            return res.send(alertMove("제목이나 내용을 입력해주세요", "/qnawrite"));
        } else {
            res.send(await req(queries.qnaWriteQuery, [userEmail, QNA_TITLE, QNA_CON, QNA_REP]));
            console.log(userEmail);
            console.log(QNA_TITLE);
            console.log(QNA_CON);
        }
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 수정할 문의 원래 내용 받아오기
router.post("/qnaOriginalData", async (request, res) => {
    try {
        const QNA_ID = request.body.QNA_ID;
        console.log("이거", QNA_ID);

        res.send(await req(queries.qnaOriginalDataQuery, QNA_ID));
        console.log(QNA_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 문의 내용 수정 - 수정하기
router.post("/qnaEdit", async (request, res) => {
    try {
        const QNA_TITLE = request.body.qna_title;
        const QNA_CON = request.body.qna_con;

        const QNA_ID = request.body.qna_id;

        return res.send(await req(queries.qnaEditQuery, [QNA_TITLE, QNA_CON, QNA_ID]));
        console.log(qna_title);
        console.log(qna_con);
        console.log(qna_id);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

// 문의 삭제  --ok
router.post("/qnaDel", async (request, res) => {
    try {
        let { QNA_ID } = request.body;
        QNA_ID = Number(QNA_ID);

        res.send(await req(queries.qnaDelQuery, QNA_ID));
        console.log(QNA_ID);
    } catch (err) {
        res.status(500).send({
            error: err,
        });
    }
});

/* // 답변 완료 갯수
router.get("/qnaDoneCount", async (request, res) => {
  try {
    const userEmail = request.body.userEmail;

    res.send(await req(queries.qnaDoneCountQuery, userEmail));
    console.log(userEmail);
  } catch (err) {
    res.status(500).send({
      error:err
    });
  }
}); */

// 문의 답변 작성(admin 계정만) - update로 써야할 듯
//---- 답변 달렸을 시 db에 반영

// alertMove함수 선언
function alertMove(msg, path) {
    let script = `
  <script type="text/javascript">
  alert("${msg}")
  location.href="${path}"
  </script>
  `;
    return script;
}

router.post("/getCountQna", async (req, res) => {
    let allC = "";
    let WC = "";
    let FC = "";
    db.query(`select count(*) as count from qna`, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            allC = result[0].count;

            db.query(`select count(*) as count from qna where QNA_REP = 0`, (err2, result2) => {
                if (err) {
                    res.send(err2);
                } else {
                    WC = result2[0].count;

                    db.query(`select count(*) as count from qna where QNA_REP = 1`, (err3, result3) => {
                        if (err) {
                            res.send(err2);
                        } else {
                            FC = result3[0].count;
                            res.send({ allC, WC, FC });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;

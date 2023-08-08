const express = require("express");
const db = require("../db"); //db연결
const router = express.Router();

router.get("/", async (req, res) => {
    const useremail = req.query.email;
    console.log(useremail);

    db.query(
        `select ATT_NO from attendance where ATT_USER_EMAIL = ?`,
        useremail,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                if (result.length == 0) {
                    res.status(200).send("출석체크 기록이 없습니다.");
                } else {
                    const attArray = result.map((row) => row.ATT_NO); // 결과를 LL_NUM으로 이루어진 배열로 변환
                    res.status(200).send(attArray);
                }
            }
        }
    );
});

router.post("/attendance", async (req, res) => {
    const attInfo = { ATT_USER_EMAIL: req.body.email, ATT_NO: req.body.date };

    db.query(`insert into attendance set ?`, attInfo, (err, result) => {
        if (err) {
            res.status(200).send(err);
        } else {
            const USER_EMAIL = req.body.email;
            db.query(
                `update user set USER_POINT = USER_POINT+100 where USER_EMAIL = ?`,
                USER_EMAIL,
                (err) => {
                    if (err) {
                        res.status(200).send(err);
                    } else {
                        res.status(200).send("출석체크 성공");
                    }
                }
            );
        }
    });
});

module.exports = router;

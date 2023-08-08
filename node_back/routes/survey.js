const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
    const surveyInfo = {
        SUR_USER_EMAIL: req.body.email,
        SUR_LIKE_1: req.body.sur1,
        SUR_LIKE_2: req.body.sur2,
        SUR_LIKE_3: req.body.sur3,
        SUR_LIKE_4: req.body.sur4,
        SUR_LIKE_5: req.body.sur5,
    };

    db.query(`insert into SURVEY set ?`, surveyInfo, (err) => {
        if (err) {
            res.status(200).send(err);
        } else {
            res.status(200).send("저장 성공");
        }
    });
});

router.post("/check", async (req, res) => {
    const userEmail = req.body.email;

    db.query(
        `select * from survey where SUR_USER_EMAIL = ?`,
        userEmail,
        (err, result) => {
            if (err) {
                res.status(200).send(err);
            } else {
                if (result.length > 0) {
                    res.status(200).send("설문조사 완료한 유저");
                } else {
                    res.status(200).send("설문조사 안한 유저");
                }
            }
        }
    );
});

module.exports = router;

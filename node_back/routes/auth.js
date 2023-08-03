const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db"); //db연결
const mailer = require("../mail");
const router = express.Router();

router.post("/sendEmail", async (req, res) => {
    const email = req.body.email;

    const verifyNum = Math.floor(Math.random() * 888889 + 111111); //111111~999999

    let emailParam = {
        toEmail: email,
        subject: "문문서점 인증메일",
        html: `<html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>이메일 인증 코드</title>
              </head>
              <body style="justify-content: center; align-items: center;">
                <div style="width: 40vw; border-radius: 10px; overflow: hidden; border:1px solid #ccc; box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, .1);">
                  <div style="background-color: #4E4EFF; width: 100%; height: 60px;">
                    <h1 style="font-size: 23px; font-family: 'Open Sans'; height: 60px; line-height: 60px; margin: 0; text-align: center; color: white;">
                    이메일 인증 코드
                    </h1>
                  </div>
                  <div style="width: 100%; height: 300px; flex-direction: column; justify-content: space-around; align-items: center; flex-wrap: wrap; background-color: #fff; padding: 15px;">
                    <p style="font-size: 20px; font-family: 'Open Sans'; text-align: center; color: #343434; margin-top: 8%;">
                      아래의 인증 코드를 입력해 주세요
                    </p>
                    <div style="display: block; width: 60%; margin: 30px auto; background-color: #ddd; border-radius: 40px; padding: 20px; text-align: center; font-size: 36px; font-family: 'Open Sans'; letter-spacing: 10px; box-shadow: 0px 7px 22px 0px rgba(0, 0, 0, .1);">
                      <span style="display: block;">${verifyNum}</span>
                    </div>
                    <p style="font-size: 12px; text-align: center; color: #343434; margin-top: 0; font-style: italic; opacity: 0.3;">
                      인증코드 유효 시간은 3분입니다.
                    </p>
                  </div>
                  <div style="width: 100%; height: 60px; background-color: #fff;"></div>
                </div>
              </body>
              </html>`,
    };
    mailer
        .sendGmail(emailParam)
        .then(() => {
            res.status(200).json({
                message: "success",
                verifyNum: verifyNum,
            });
        })
        .catch((error) => {
            res.status(200).send("에러" + error);
        });
});

router.post("/checkemail", async (req, res) => {
    const email = req.body.email;

    db.query(
        `select * from users where USER_EMAIL = ?`,
        email,
        (err, results) => {
            if (err) {
                res.status(200).send(err);
            } else {
                if (results.length > 0) {
                    res.status(200).send("존재하는 이메일입니다.");
                } else {
                    res.status(200).send("사용가능한 이메일입니다.");
                }
            }
        }
    );
});

router.post(`/join`, async (req, res) => {
    const frontUserData = req.body;
    const bcryptPassword = await bcrypt.hash(frontUserData.password, 12);

    const userdata = {
        USER_EMAIL: frontUserData.email,
        USER_PW: bcryptPassword,
        USER_NAME: frontUserData.name,
        USER_SEX: frontUserData.sex,
        USER_AGEGROUP: frontUserData.agegroup,
        USER_PHONE: frontUserData.phone,
        USER_ZIPCODE: frontUserData.zipcode,
        USER_ADD1: frontUserData.add1,
        USER_ADD2: frontUserData.add2,
    };

    db.query(`insert into users set ?`, userdata, (err, result) => {
        if (err) {
            res.status(200).send("에러 발생: " + err);
        } else {
            res.status(200).send("회원가입 성공");
        }
    });
});
router.post("/kakaologin", async (req, res) => {
    let sex = "";

    if (req.body.sex === "male") {
        sex = "m";
    } else {
        sex = "f";
    }

    const user = {
        //프론트에서 전달해주는 데이터
        USER_EMAIL: req.body.email,
        USER_IMAGE: req.body.image,
        USER_SEX: sex,
        USER_AGEGROUP: req.body.agegroup,
        USER_NICKNAME: req.body.nick,
        USER_PROVIDER: req.body.provider,
        USER_ADD: req.body.add,
    };

    db.query("insert into weavewego.user set ?", user, (err) => {
        //쿼리 실행
        if (err) {
            res.send({
                // 에러 발생 시
                code: 400,
                failed: "error occurred",
                error: err,
            });
        } else {
            res.send({
                //쿼리 실행 성공시
                code: 200,
                message: "회원가입 성공",
            });
        }
    });
});
//카카오 로그인 후-----------------------------------
router.post("/kakaoData", async (req, res) => {
    const email = req.body.email;

    db.query(
        `select * from weavewego.user where USER_EMAIL = ?`,
        email,
        async (err, results) => {
            if (err) {
                res.send({
                    // 에러 발생 시
                    code: 400,
                    failed: "error occurred",
                    error: err,
                });
            } else {
                res.send({
                    email: results[0].USER_EMAIL,
                    nick: results[0].USER_NICKNAME,
                    image: results[0].USER_IMAGE,
                    provider: results[0].USER_PROVIDER,
                });
            }
        }
    );
});
//------------네이버 로그인---------
router.post("/naverlogin", async (req, res) => {
    let sex = "";

    if (req.body.sex === "M") {
        sex = "m";
    } else {
        sex = "f";
    }

    const user = {
        //프론트에서 전달해주는 데이터
        USER_EMAIL: req.body.email,
        USER_IMAGE: req.body.image,
        USER_SEX: sex,
        USER_AGEGROUP: req.body.agegroup,
        USER_NICKNAME: req.body.nick,
        USER_PROVIDER: req.body.provider,
    };

    db.query("insert into weavewego.user set ?", user, (err) => {
        //쿼리 실행
        if (err) {
            res.send({
                // 에러 발생 시
                code: 400,
                failed: "error occurred",
                error: err,
            });
        } else {
            res.send({
                //쿼리 실행 성공시
                code: 200,
                message: "회원가입 성공",
            });
        }
    });
});
//네이버 로그인 후-------------------------------------
router.post("/naverData", async (req, res) => {
    const email = req.body.email;

    db.query(
        `select * from weavewego.user where USER_EMAIL = ?`,
        email,
        async (err, results) => {
            if (err) {
                res.send({
                    // 에러 발생 시
                    code: 400,
                    failed: "error occurred",
                    error: err,
                });
            } else {
                res.send({
                    email: results[0].USER_EMAIL,
                    nick: results[0].USER_NICKNAME,
                    image: results[0].USER_IMAGE,
                    provider: results[0].USER_PROVIDER,
                });
            }
        }
    );
});

module.exports = router;

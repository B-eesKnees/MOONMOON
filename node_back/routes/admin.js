const express = require("express");
const db = require("../db");
const router = express.Router();

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

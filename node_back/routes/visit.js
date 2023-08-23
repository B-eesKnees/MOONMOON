const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/", async (req, res) => {
    const today = req.body.today;
    // const today = console.log(today);

    db.query(`select * from viewcount where vc_date = ?`, today, (err, result) => {
        if (err) {
            res.status(200).send(err);
        } else {
            if (result.length === 0) {
                db.query(`insert into viewcount (vc_count, vc_date) value (?,?)`, [1, today], (err, result) => {
                    if (err) {
                        res.status(200).send(err);
                    } else {
                        res.status(200).send("첫 방문");
                    }
                });
            } else {
                db.query(`update viewcount set vc_count = vc_count + 1 where vc_date = ?`, today, (err, result) => {
                    if (err) {
                        res.status(200).send(err);
                    } else {
                        res.status(200).send("방문 성공");
                    }
                });
            }
        }
    });
});

module.exports = router;

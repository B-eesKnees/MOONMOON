const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/", async (req, res) => {
    const goods = "굿즈";

    db.query(`select * from book where BOOK_CATEGORYNAME = "${goods}"`, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;

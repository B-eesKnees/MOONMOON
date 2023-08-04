const express = require("express");
const db = require("../db"); //db연결

const router = express.Router();

router.post("/", async(req, res)=>{
    // console.log(req.body);
    const ORDER_USEREMAIL = req.body.email;
    const testdata = req.body.books_info;

    const paymentDate = {
        ORDER_USER_EMAIL : req.body.email,
        ORDER_PAY : req.body.total_pay,
        ORDER_ADDPOINT : req.body.total_point,
        ORDER_COST : req.body.fee

    }

    db.query(`insert into order set ?`, paymentDate, (err, results)=>{
        if(err) {
            res.send({ // 에러 발생 시
                'code':400,
                'failed': 'error occurred',
                'error': err
            })
        } else {
            const order_id = results.insertId;
            const orderItems = testdata.map(item => [order_id, ORDER_USER_EMAIL, item.ORDERITEM_BOOK_ID, item.ORDERITEM_CNT, item.ORDERITEM_PRICE, item.ORDERITEM_POINT]);
            console.log(orderItems);
            db.query(`INSERT INTO orderItem (ORDERITEM_ID, ORDERITEM_ORDER_ID, ORDERITEM_BOOK_ID, ORDERITEM_CNT, ORDERITEM_PRICE, ORDERITEM_POINT) VALUES ?`, [orderItems], (err)=>{
                if(err) {
                    res.status(401).send({ // 에러 발생 시
                        'code':400,
                        'failed': 'error occurred',
                        'error': err
                    })
                } else {
                    res.status(200).send({
                        "message": "성공",
                        "orderID" : order_id
                    });
                }  
            })
        }
    })
});


module.exports = router;
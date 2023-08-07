const express = require("express");
const db = require("../db"); //db연결
const axios = require("axios");
const convert = require("xml-js");

const router = express.Router();

router.post("/getInfo", (req, res) => {
    //클라이언트측에서 책이름으로 검색 시 실행됩니다.

    const bookTitle = req.body.bookname; //책 제목을 받아서 저장합니다.
    const url = "http://www.aladin.co.kr/ttb/api/ItemSearch.aspx";
    const ttbkey = "ttbbj37571606001"; //알라딘에서 부여한 고유번호입니다.
    const params = {
        ttbkey: ttbkey,
        QueryType: "Title", //제목 검색입니다.
        MaxResults: 10, // 10개까지 검색합니다.
        start: 1,
        SearchTarget: "Book",
        output: "xml",
        Version: "20131101",
        // Sort: "SalesPoint", //판매량 순으로 정렬했습니다 기본값은 관련도 입니다.
        Query: bookTitle, // 책 제목을 쿼리에 포함시킵니다.
    };

    axios
        .get(url, { params })
        .then((response) => {
            // 여기서 받아온 데이터(response.data)를 원하는대로 처리합니다.
            let aladinJson = convert.xml2json(response.data, {
                compact: true,
                spaces: 4,
            }); //spaces: 4 공백 길이 라는데 뭔지 모르겠습니다.
            res.send(aladinJson); //xml2json 이용해서 json 형식으로 보내줍니다.
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("Error fetching data");
        });
});

router.post("/naverBookImage", (req, res) => {
    //책 이미지 받아올때 사용됩니다.
    const isbn = req.body.isbn; //isbn 받아옵니다.
    axios
        .get("https://openapi.naver.com/v1/search/book_adv.xml", {
            //네이버 책 상세검색 api입니다.
            params: { d_isbn: isbn },
            headers: {
                "X-Naver-Client-Id": "21jTgTjyYK_UYwgjh73o",
                "X-Naver-Client-Secret": "1ZIfl_Whst",
            },
        })
        .then((response) => {
            const xmlData = response.data;
            const jsonData = convert.xml2json(xmlData, {
                compact: true,
                spaces: 4,
            }); //json으로 바꿉니다.
            //   console.log(jsonData);
            const bookData = JSON.parse(jsonData); //JSON.parse JSON형식의 문자열을 JSON형식으로 바꾸는 건데 왜 써야 작동할까요?

            const imageUrl = bookData.rss.channel.item.image._text; //isbn은 주민번호같은거라 배열 [0]같은거 안써도 됩니다 아마.

            console.log(imageUrl);
            res.send(imageUrl); //이미지 주소 보내줍니다.
        })
        .catch((err) => {
            res.status(401).send(err);
        });
});
router.post("/aladinBookImage", (req, res) => {
    console.log(req.body.isbn);
    console.log(req.body.itemID);
    const id = req.body.itemID; //알리딘 책 api
    const url = `http://www.aladin.co.kr/ttb/api/ItemLookUp.aspx`;
    const ttbkey = "ttbbj37571606001";
    const params = {
        ttbkey: ttbkey,
        ItemId: id,
        ItemIdType: "ItemId",
        Cover: "Big", //이게 시발 빅이야?
        Output: "JS",
        Version: 20131101,
    };

    axios
        .get(url, { params })
        .then((response) => {
            res.send(response.data); //근데 이미지 해상도가 너무 별로다 네이버를 병행해야할까?
        })
        .catch((err) => {
            res.status(401).send(err);
        });
});
router.post("/insertInfo", async (req, res) => {
    const bookInfo = req.body;

    db.query(
        `select * from book where BOOK_TITLE = ?`,
        bookInfo.book_title,
        (err, results) => {
            if (err) {
                res.status(401).send("오류 발생: " + err);
            } else if (results.length > 0) {
                res.status(401).send("이미 등록된 책입니다.");
            } else {
                db.query(`insert into book set ?`, bookInfo, (err) => {
                    if (err) {
                        res.status(401).send("오류 발생: " + err);
                    } else {
                        res.status(200).send("ok");
                    }
                });
            }
        }
    );
});
module.exports = router;

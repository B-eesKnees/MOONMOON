const express = require("express");
const router = express.Router();
const db = require("../db");
const session = require("express-session");

router.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 600000, //10분
    },
  })
);

//최근 본 책 데이터 가져오기//ok
router.get("/recentbook", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  let query;

  if (userEmail) {
    // 회원인 경우에는 회원의 최근 본 책 목록 조회
    query =
      "SELECT * FROM recentbook WHERE REC_USER_EMAIL=? ORDER BY REC_VIEWED_AT DESC LIMIT 10";
    db.query(query, [userEmail], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버에러" });
      } else {
        res.json({ recentBooks: results });
      }
    });
  } else {
    // 비회원인 경우에는 세션의 최근 본 책 목록 조회
    const recentBooks = req.session.recentBooks || [];
    res.json({ recentBooks });
  }
});

//최근 본 책 추가ok
router.post("/addrecentbook", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.body.bookId; // 요청 바디에서 추가할 책의 ID 가져오기

  if (userEmail) {
    // 회원인 경우, 데이터베이스에 최근 본 책 추가
    const query =
      "INSERT INTO recentbook (REC_USER_EMAIL, REC_BOOK_ID) VALUES (?, ?)";
    db.query(query, [userEmail, bookId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버에러" });
      } else {
        res.json({ message: "책이 최근 본 책 목록에 추가되었습니다ddd." });
      }
    });
  } else {
    // 비회원인 경우, 세션에 최근 본 책 추가
    req.session.recentBooks = req.session.recentBooks || [];
    const MAX_RECENT_BOOKS = 10;
    if (!req.session.recentBooks.includes(bookId)) {
      req.session.recentBooks.unshift(bookId);
      if (req.session.recentBooks.length > MAX_RECENT_BOOKS) {
        req.session.recentBooks = req.session.recentBooks.slice(
          0,
          MAX_RECENT_BOOKS
        );
      }
    }
    res.json({ message: "책이 최근 본 책 목록에 추가되었습니다ttttt." });
  }
});

//최근 본 책 삭제ok
router.delete("/delrecentbook/:id", (req, res) => {
  //const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.params.id; // URL 파라미터에서 삭제할 책의 ID 가져오기
  //console.log(userEmail);
  //console.log(bookId);
  // 회원인 경우에만 userEmail을 사용하여 쿼리 생성
  const query = "DELETE FROM recentbook WHERE REC_BOOK_ID=?";
  console.log(query);
  db.query(query, [bookId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "삭제 성공" });
      } else {
        res.json({ message: "최근 본 책 데이터 없음" });
      }
    }
  });
});

//찜하기
router.get("/likebooks", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기

  if (!userEmail) {
    res.status(401).json({ error: "로그인이 필요한 기능입니다." });
    return;
  }

  const query =
    "SELECT * FROM likedbook WHERE LIKE_USER_EMAIL=? ORDER BY LIKE_CREATED_AT DESC LIMIT 10";
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      res.json({ likeBooks: results });
    }
  });
});

//찜 추가
router.post("/addlikebooks", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.body.bookId; // 요청 바디에서 추가할 책의 ID 가져오기

  if (!userEmail) {
    res.status(401).json({ error: "로그인이 필요한 기능입니다." });
    return;
  }

  const query =
    "INSERT INTO likedbook (LIKE_USER_EMAIL, LIKE_BOOK_ID) VALUES (?, ?)";
  db.query(query, [userEmail, bookId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      res.json({ message: "책이 찜 목록에 추가되었습니다." });
    }
  });
});

//찜 삭제
router.delete("/likebooks/:id", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.params.id; // URL 파라미터에서 삭제할 책의 ID 가져오기

  const query =
    "DELETE FROM likedbook WHERE LIKE_USER_EMAIL=? AND LIKE_BOOK_ID=?";
  db.query(query, [userEmail, bookId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "책이 찜 목록에서 삭제되었습니다." });
      } else {
        res.json({ message: "해당 책을 찜 목록에서 찾을 수 없습니다." });
      }
    }
  });
});

//찜 누르면 추가 다시누르면 삭제
router.post("/cancellikebooks", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.body.bookId; // 요청 바디에서 추가할 책의 ID 가져오기

  if (!userEmail) {
    res.status(401).json({ error: "로그인이 필요한 기능입니다." });
    return;
  }

  const selectQuery =
    "SELECT * FROM likedbook WHERE LIKE_USER_EMAIL=? AND LIKE_BOOK_ID=?";
  db.query(selectQuery, [userEmail, bookId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
    } else {
      if (results.length === 0) {
        // 찜 정보가 없는 경우에만 INSERT 쿼리 실행
        const insertQuery =
          "INSERT INTO likedbook (LIKE_USER_EMAIL, LIKE_BOOK_ID) VALUES (?, ?)";
        db.query(insertQuery, [userEmail, bookId], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
          } else {
            res.json({ message: "책이 찜 목록에 추가되었습니다." });
          }
        });
      } else {
        // 찜 정보가 이미 있는 경우 DELETE 쿼리 실행하여 찜 취소
        const deleteQuery =
          "DELETE FROM likedbook WHERE LIKE_USER_EMAIL=? AND LIKE_BOOK_ID=?";
        db.query(deleteQuery, [userEmail, bookId], (err, result) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: "서버 에러" });
          } else {
            res.json({ message: "책이 찜 목록에서 제거되었습니다." });
          }
        });
      }
    }
  });
});

//플로팅에서 삭제만 가능 추가 불가
//상세페이지에서 추가 혹은 삭제 가능
module.exports = router;

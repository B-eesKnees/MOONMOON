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
      "SELECT rb.REC_VIEWED_AT, b.BOOK_TITLE, b.BOOK_COVER, b.BOOK_AUTHOR, b.BOOK_PRICE, b.BOOK_ID " +
      "FROM recentbook rb " +
      "INNER JOIN book b ON rb.REC_BOOK_ID = b.BOOK_ID " +
      "WHERE rb.REC_USER_EMAIL=? ORDER BY rb.REC_VIEWED_AT DESC LIMIT 10";
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
    const insertQuery =
      "INSERT INTO recentbook (REC_USER_EMAIL, REC_BOOK_ID) VALUES (?, ?)";
    db.query(insertQuery, [userEmail, bookId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버에러" });
      } else {
        // 추가한 데이터와 책 정보를 함께 가져오기 위해 JOIN을 사용한 쿼리 실행
        const selectQuery =
          "SELECT r.RECENT_ID, r.REC_USER_EMAIL, r.REC_BOOK_ID, " +
          "b.BOOK_TITLE, b.BOOK_COVER, b.BOOK_AUTHOR, b.BOOK_PRICE, r.REC_VIEWED_AT " +
          "FROM recentbook r " +
          "JOIN book b ON r.REC_BOOK_ID = b.BOOK_ID " +
          "WHERE r.REC_USER_EMAIL = ? " +
          "ORDER BY r.REC_VIEWED_AT DESC " +
          "LIMIT 10";
        db.query(selectQuery, [userEmail], (selectErr, selectResults) => {
          if (selectErr) {
            console.error(selectErr);
            res.status(500).json({ error: "서버에러" });
          } else {
            res.json({
              message: "책이 최근 본 책 목록에 추가되었습니다.",
              recentBooks: selectResults,
            });
          }
        });
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
    res.json({
      message: "책이 최근 본 책 목록에 추가되었습니다.",
      recentBooks: req.session.recentBooks,
    });
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

//찜하기 데이터 조회 ok
router.get("/likebook", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기

  if (!userEmail) {
    res.status(401).json({ error: "로그인이 필요한 기능입니다." });
    return;
  }

  const query =
    "SELECT lb.LIKE_CREATED_AT, b.BOOK_TITLE, b.BOOK_COVER, b.BOOK_AUTHOR, b.BOOK_PRICE, b.BOOK_ID " +
    "FROM likedbook lb " +
    "INNER JOIN book b ON lb.LIKE_BOOK_ID = b.BOOK_ID " +
    "WHERE lb.LIKE_USER_EMAIL=? ORDER BY lb.LIKE_CREATED_AT DESC LIMIT 10";
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
router.post("/addlikebook", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기
  const bookId = req.body.bookId; // 요청 바디에서 추가할 책의 ID 가져오기

  if (!userEmail) {
    res.status(401).json({ error: "로그인이 필요한 기능입니다." });
    return;
  }

  const getBookInfoQuery = "SELECT * FROM book WHERE BOOK_ID = ?";
  db.query(getBookInfoQuery, [bookId], (err, bookResults) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버 에러" });
      return;
    }

    const bookInfo = bookResults[0];
    if (!bookInfo) {
      res.status(404).json({ error: "해당 책 정보를 찾을 수 없습니다." });
      return;
    }

    const insertLikeQuery =
      "INSERT INTO likedbook (LIKE_USER_EMAIL, LIKE_BOOK_ID) VALUES (?, ?)";
    db.query(insertLikeQuery, [userEmail, bookId], (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: "서버 에러" });
      } else {
        res.json({
          message: "책이 찜 목록에 추가되었습니다.",
          bookInfo: {
            BOOK_ID: bookInfo.BOOK_ID,
            BOOK_TITLE: bookInfo.BOOK_TITLE,
            BOOK_COVER: bookInfo.BOOK_COVER,
            BOOK_AUTHOR: bookInfo.BOOK_AUTHOR,
            BOOK_PRICE: bookInfo.BOOK_PRICE,
          },
        });
      }
    });
  });
});

//찜 삭제ok
router.delete("/dellikebooks/:id", (req, res) => {
  const bookId = req.params.id; // URL 파라미터에서 삭제할 책의 ID 가져오기
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기

  if (!userEmail) {
    res.status(400).json({ error: "사용자 이메일이 필요합니다." });
    return;
  }

  const query =
    "DELETE FROM likedbook WHERE LIKE_USER_EMAIL=? AND LIKE_BOOK_ID=?";
  db.query(query, [userEmail, bookId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "사용자의 좋아요가 취소되었습니다." });
      } else {
        res.json({ message: "해당 사용자의 좋아요를 찾을 수 없습니다." });
      }
    }
  });
});

//찜 누르면 추가 다시누르면 삭제 ok
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

//찜 전체 삭제
router.delete("/delAllLike", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기

  if (!userEmail) {
    res.status(400).json({ error: "사용자 이메일이 필요합니다." });
    return;
  }

  const query = "DELETE FROM likedbook WHERE LIKE_USER_EMAIL=?";
  db.query(query, [userEmail], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (result.affectedRows > 0) {
        res.json({ message: "사용자의 모든 좋아요가 삭제되었습니다." });
      } else {
        res.json({ message: "해당 사용자의 좋아요를 찾을 수 없습니다." });
      }
    }
  });
});

//최근 본 전체 삭제
router.delete("/delAllRec", (req, res) => {
  const userEmail = req.query.userEmail; // 쿼리 파라미터에서 userEmail 가져오기

  if (!userEmail) {
    res.status(400).json({ error: "사용자 이메일이 필요합니다." });
    return;
  }

  const query = "DELETE FROM recentbook WHERE REC_USER_EMAIL=?";
  db.query(query, [userEmail], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "서버에러" });
    } else {
      if (result.affectedRows > 0) {
        res.json({
          message: "사용자의 모든 최근 본 책 데이터가 삭제되었습니다.",
        });
      } else {
        res.json({
          message: "해당 사용자의 최근 본 책 데이터를 찾을 수 없습니다.",
        });
      }
    }
  });
});

//플로팅에서 삭제만 가능 추가 불가
//상세페이지에서 추가 혹은 삭제 가능
module.exports = router;

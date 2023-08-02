const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const session = require("express-session");

app.use(cors({ origin: true, credentials: true }));
app.set("port", process.env.PORT || 3000); //포트 3000번으로 설정

app.use(morgan("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

dotenv.config();

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// 첫번째 처럼 각자 맡은 페이지 라우터 써서 작성 ㄱㄱ
//app.use("/qna", qnaRouter); // qna
//
//
//
//
const cartRouter = require("./routes/cart");
const floatingRouter = require("./routes/floating");
const reviewRouter = require("./routes/review");

app.use("/cart", cartRouter);
app.use("/floating", floatingRouter);
app.use("/review", reviewRouter);

app.listen(app.get("port"), () => {
  //서버 연결
  console.log(app.get("port"), "번 대기중");
});

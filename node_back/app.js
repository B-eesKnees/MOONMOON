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

//
//
const authRouter = require("./routes/auth");
const aladinRouter = require("./routes/aladin");
const cartRouter = require("./routes/cart");
const floatingRouter = require("./routes/floating");
const qnaRouter = require("./routes/qna");
const reviewRouter = require("./routes/review");
const rouletteRouter = require("./routes/roulette");
const payRouter = require("./routes/pay");
const payResultRouter = require("./routes/pay_result");
const mainPageRouter = require("./routes/main");
const detailPageRouter = require("./routes/detail");
const attPageRouter = require("./routes/att");
const booklistPageRouter = require("./routes/bookList");
const surveyRouter = require("./routes/survey");
const mypageRouter = require("./routes/mypage");
const visitRouter = require("./routes/visit");
const adminRouter = require("./routes/admin");
const goodsRouter = require("./routes/goods");

app.use("/cart", cartRouter);
app.use("/floating", floatingRouter);
app.use("/aladin", aladinRouter);
app.use("/auth", authRouter);
app.use("/qna", qnaRouter); // qna
app.use("/review", reviewRouter);
app.use("/roulette", rouletteRouter);
app.use("/pay", payRouter);
app.use("/payresult", payResultRouter);
app.use("/main", mainPageRouter);
app.use("/detail", detailPageRouter);
app.use("/att", attPageRouter);
app.use("/booklist", booklistPageRouter);
app.use("/sur", surveyRouter);
app.use("/mypage", mypageRouter);
app.use("/visit", visitRouter);
app.use("/admin", adminRouter);
app.use("/goods", goodsRouter);

app.listen(app.get("port"), () => {
    //서버 연결
    console.log(app.get("port"), "번 대기중");
});

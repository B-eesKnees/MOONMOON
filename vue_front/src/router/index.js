import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import Login from "../views/Login.vue";
import Join from "../views/Join.vue";

import SearchList from "../views/searchList.vue";
import BestList from "../views/bestList.vue";
import NewList from "../views/newList.vue";
import bookDetail from "../views/bookDetail.vue";

import booktestPage from "../views/bookTest.vue";
import cart from "../views/cart.vue";
import resultpage from "../views/paymentResult.vue";
import bookInsert from "../views/bookInsert.vue";
import pay from "../views/pay.vue";

import qnaList from "../views/qnaList.vue";
import qnaWrite from "../views/qnaWrite.vue";
import qnaEdit from "../views/qnaEdit.vue";
import eventPage from "../views/event.vue";

const requireLogin = () => (to, from, next) => {
  //로그인안하고 접근하려했을때 실행할 함수?
  if (localStorage.getItem("userID") !== null) {
    //localStorage에 데이터 있으면
    return next(); //접근가능
  }
  next("/login"); //localStorage에 데이터 없으면 로그인창으로 리다이렉트
};

// beforeEnter: requireLogin(),  <<로그인 한사람만 들어갈 수 있는 페이지 component아래에 붙여넣으면됨
const routes = [
  {
    path: "/",
    name: "Main",
    component: Main,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/join",
    name: "Join",
    component: Join,
  },
  {
    path: "/test",
    name: "testAPIPage",
    component: booktestPage,
  },
  //---책리스트-------------------------------------------------
  {
    path: "/search",
    name: "SearchList",
    component: SearchList,
  },
  {
    path: "/best",
    name: "BestList",
    component: BestList,
  },
  {
    path: "/new",
    name: "NewList",
    component: NewList,
  },
  {
    path: "/detail/:bookNum",
    name: "bookDetail",
    component: bookDetail,
  },
  //-------------------------------------------------------------
  //장바구니 - 결제 - 결제완료
  {
    path: "/cart",
    name: "cartPage",
    component: cart,
  },
  {
    path: "/pay",
    name: "paymentPage",
    component: pay,
  },
  {
    path: "/result/:orderNum",
    name: "resultpage",
    component: resultpage,
  },
  //-------------------------------------------------------------
  //QNA
  {
    path: "/qna",
    name: "qnaList",
    component: qnaList,
  },
  {
    path: "/qnaWrite",
    name: "qnaWrite",
    component: qnaWrite,
  },
  {
    path: "/qnaEdit",
    name: "qnaEdit",
    component: qnaEdit,
  },
  //-------------------------------------------------------------
  //룰렛, 쿠폰주는 화면
  {
    path: "/event",
    name: "eventPage",
    component: eventPage,
  },
  //-------------------------------------------------------------
  //관리자페이지
  {
    path: "/bookinsert",
    name: "bookInsert",
    component: bookInsert,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
export default router;

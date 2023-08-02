import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue";
import Login from "../views/Login.vue";
import Join from "../views/Join.vue";

import BestList from "../views/bestList.vue"
import NewList from "../views/newList.vue"

import booktestPage from "../views/bookTest.vue";
import cart from "../views/cart.vue";
import resultpage from "../views/paymentResult.vue";
import bookInsert from "../views/bookInsert.vue";

import qnaList from "../views/qnaList.vue";

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
   //---책리스트---
   {
    path: "/best",
    name: "BestList",
    component: BestList
  },
  {
    path: "/new",
    name: "NewList",
    component: NewList
  },
  //-------------
  {
    path: "/cart",
    name: "cartPage",
    component: cart,
  },
  {
    path: "/result/:orderNum",
    name: "resultpage",
    component: resultpage,
  },
  {
    path: "/qna",
    name: "qnaList",
    component: qnaList,
  },
  {
    path: "/bookinsert",
    name: "bookInsert",
    component: bookInsert,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});
export default router;
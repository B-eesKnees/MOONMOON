import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue"
import Login from "../views/Login.vue"
import Join from "../views/Join.vue"

import booktestPage from "../views/bookTest.vue";
import cart from "../views/cart.vue";

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
        component: booktestPage
    },
    {
      path: "/cart",
      name: "cartPage",
      component: cart
    },
    {
      path: "/qna",
      name: "qnaList",
      component: qnaList
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
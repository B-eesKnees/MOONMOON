import { createRouter, createWebHistory } from "vue-router";

import booktestPage from "../views/bookTest.vue";
import cart from "../views/cart.vue";


const routes = [
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
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
      return { top: 0 };
    },
  });
  
  export default router;
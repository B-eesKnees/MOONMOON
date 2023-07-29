import { createRouter, createWebHistory } from "vue-router";

import booktestPage from "../views/bookTest.vue";


const routes = [
    {
        path: "/test",
        name: "testAPIPage",
        component: booktestPage
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
    scrollBehavior() {
      return { top: 0 };
    },
  });
  
  export default router;
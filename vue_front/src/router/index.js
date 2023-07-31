import { createRouter, createWebHistory } from "vue-router";
import Main from "../views/Main.vue"
import Login from "../views/Login.vue"
import Join from "../views/Join.vue"

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
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});
export default router;
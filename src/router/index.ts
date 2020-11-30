import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Test from "../views/Test.vue";
import Day from "../views/Day.vue";
import NotFound from "../views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/test",
    name: "test",
    component: Test
  },
  {
    path: "/day/:number",
    name: "day",
    component: Day,
    props: route => ({ number: +route.params.number || 0 })
  },
  {
    path: "/:catchAll(.*)",
    name: "404",
    component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

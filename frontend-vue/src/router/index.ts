import { createRouter, createMemoryHistory, createWebHashHistory } from "vue-router";

const routerOptions = {
  // history: createMemoryHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "shop",
      component: () => import("../views/Shop.vue"),
    },
    {
        path: "/shop",
        name: "shop",
        component: () => import("../views/Shop.vue"),
    },  
    {
        path: "/cart",
        name: "cart",
        component: () => import("../views/Cart.vue"),
    },
    {
      path: "/feedback",
      name: "feedback",
      component: () => import("../views/Feedback.vue"),
    },
    {
        path: "/login",
        name: "login",
        component: () => import("../views/Login.vue"),
    },  
  ],
};

function routerBuilder() {
  return createRouter(routerOptions);
}

const router = routerBuilder();
// classic export
export default router;
// allow build fresh new isolated instances
export { routerBuilder };
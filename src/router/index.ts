import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import { useUserStore } from "@/store/userStore";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    component: () => import("@/views/LoginPage.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/NotFoundPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.path === "/" || to.path === "/login") {
    if (userStore.isLogin()) {
      next("/main");
    } else {
      next("/login");
    }
    return;
  }

  if (to.meta.auth && !userStore.isLogin()) {
    console.log("인증이 필요합니다");
    next("/login");
    return;
  }
  next();
});

export default router;

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
    path: "/servers/instances",
    component: () => import("@/views/vm/InstanceListView.vue"),
    meta: { auth: true },
  },
  {
    path: "/servers/instances/:instanceId",
    component: () => import("@/views/vm/InstanceDetailView.vue"),
    props: true,
    meta: { auth: true },
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

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore();

  if (
    (to.path === "/" || to.path.toLocaleLowerCase() === "/login") &&
    userStore.isLogin()
  ) {
    next("/servers/instances");
    return;
  }

  if (to.meta.auth && !userStore.isLogin()) {
    next("/login");
    return;
  }

  next();
});

export default router;

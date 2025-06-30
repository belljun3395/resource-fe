import { defineStore } from "pinia";
import { reactive } from "vue";
import {
  getUserFromCookie,
  getEmailFromCookie,
  saveUserToCookie,
  saveEmailToCookie,
  deleteCookie,
} from "@/utils/cookies";
import type { UserState } from "@/types/user";

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserState>({
    username: getUserFromCookie() || "",
    email: getEmailFromCookie() || "",
  });

  function isLogin() {
    return state.username !== "" && state.email !== "";
  }

  function login(userState: UserState) {
    state.username = userState.username;
    state.email = userState.email;
    saveUserToCookie(userState.username);
    saveEmailToCookie(userState.email);
  }

  function logout() {
    state.username = "";
    state.email = "";
    deleteCookie("okestro_user");
    deleteCookie("okestro_email");
  }

  return {
    state,
    isLogin,
    login,
    logout,
  };
});

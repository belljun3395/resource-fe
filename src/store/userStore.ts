import { defineStore } from "pinia";
import { reactive } from "vue";
import {
  getUserFromCookie,
  getEmailFromCookie,
  saveUserToCookie,
  saveEmailToCookie,
  deleteCookie,
} from "@/utils/cookies";

interface UserState {
  username: string;
  email: string;
}

export const useUserStore = defineStore("user", () => {
  const state = reactive<UserState>({
    username: getUserFromCookie() || "",
    email: getEmailFromCookie() || "",
  });

  function isLogin() {
    return state.username !== "" && state.email !== "";
  }

  function login(usernameParam: string, emailParam: string) {
    state.username = usernameParam;
    state.email = emailParam;
    saveUserToCookie(usernameParam);
    saveEmailToCookie(emailParam);
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

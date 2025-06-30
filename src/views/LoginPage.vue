<template>
  <div>
    <h1 class="page-header">{{ t("message.login.page-title") }}</h1>
    <LoginForm
      :form-title="t('message.login.form-title')"
      :email-placeholder="t('message.login.input-email')"
      :name-placeholder="t('message.login.input-name')"
      :button-loading-text="t('message.login.button-loading')"
      :button-login-text="t('message.login.button-login')"
      :loading="loading"
      @login="onLogin"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import LoginForm from "@/components/LoginForm.vue";
import { useI18n } from "vue-i18n";
import type { UserState } from "@/types/user";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);

const onLogin = (userState: UserState) => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    userStore.login(userState);
    router.push("/main");
  }, 500);
};
</script>

<style></style>

<template>
  <div>
    <LoginForm :loading="loading" @login="onLogin" />
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

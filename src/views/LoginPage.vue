<template>
  <div>
    <h1 class="page-header">{{ $t("message.login-page-title") }}</h1>
    <LoginForm></LoginForm>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm.vue";

export default {
  components: {
    LoginForm,
  },
};
</script>

<style></style>

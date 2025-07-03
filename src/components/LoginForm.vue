<template>
  <!-- login -->
  <div class="login-container">
    <!-- login form -->
    <div class="login-box">
      <h2>{{ t("message.login.form-title") }}</h2>
      <a-form layout="vertical" @submit.prevent="onSubmit">
        <a-form-item>
          <a-input
            v-model:value="email"
            type="email"
            :placeholder="t('message.login.input-email')"
            size="large"
            autocomplete="email"
          />
          <div v-if="errors.email" class="error-msg">{{ errors.email }}</div>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="name"
            type="text"
            :placeholder="t('message.login.input-name')"
            size="large"
            autocomplete="username"
          />
          <div v-if="errors.name" class="error-msg">{{ errors.name }}</div>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            {{
              loading
                ? t("message.login.button-loading")
                : t("message.login.button-login")
            }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
/* ==========================================================================
   Imports
   ========================================================================== */
import type { UserState } from "@/types/user";
import { useLoginFormValidation } from "@/composables/loginFormValidation";
import { useI18n } from "vue-i18n";

/* ==========================================================================
   Props
   ========================================================================== */
interface LoginFormProps {
  loading: boolean;
}
defineProps<LoginFormProps>();

/* ==========================================================================
   I18n
   ========================================================================== */
const { t } = useI18n();

/* ==========================================================================
   Emits
   ========================================================================== */
const emits = defineEmits<{ (e: "login", payload: UserState): void }>();

/* ==========================================================================
   Form Validation
   ========================================================================== */
const { email, name, errors, handleSubmit } = useLoginFormValidation();

/* ==========================================================================
   Event Handlers
   ========================================================================== */
const onSubmit = handleSubmit((values) => {
  emits("login", { username: values.name, email: values.email });
});
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5; /* Ant Design 기본 배경 */
}

.login-box {
  width: 100%;
  max-width: 340px;
  padding: 32px 28px 24px 28px;
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  background: #fff;
  text-align: center;
}

.login-box h2 {
  margin-bottom: 24px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #222;
  letter-spacing: -0.5px;
  opacity: 0.85;
}

.desc {
  color: #7a869a;
  font-size: 0.97rem;
  margin-bottom: 22px;
  line-height: 1.5;
}

:deep(.ant-input) {
  border-radius: 6px;
  background: #fafafa;
}

:deep(.ant-btn) {
  border-radius: 6px;
}

@media (max-width: 480px) {
  .login-box {
    padding: 28px 8vw 24px 8vw;
    max-width: 98vw;
  }
}

.error-msg {
  color: #ff4d4f;
  font-size: 0.9em;
  margin-top: 4px;
  text-align: left;
}
</style>

<template>
  <!-- login -->
  <div class="login-container">
    <!-- login form -->
    <div class="login-box">
      <h2>{{ formTitle }}</h2>
      <a-form layout="vertical" @submit.prevent="onSubmit">
        <a-form-item>
          <a-input
            v-model:value="email"
            type="email"
            :placeholder="emailPlaceholder"
            size="large"
            autocomplete="email"
          />
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="name"
            type="text"
            :placeholder="namePlaceholder"
            size="large"
            autocomplete="username"
          />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            :loading="loading"
            block
            size="large"
          >
            {{ loading ? buttonLoadingText : buttonLoginText }}
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import type { UserState } from "@/types/user";

const props = defineProps({
  formTitle: {
    type: String,
    required: true,
  },
  emailPlaceholder: {
    type: String,
    required: true,
  },
  namePlaceholder: {
    type: String,
    required: true,
  },
  buttonLoadingText: {
    type: String,
    required: true,
  },
  buttonLoginText: {
    type: String,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits<{ (e: "login", payload: UserState): void }>();
const email = ref<string>("");
const name = ref<string>("");

const onSubmit = () => {
  emits("login", { username: name.value, email: email.value });
};
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
</style>

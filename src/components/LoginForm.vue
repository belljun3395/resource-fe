<template>
  <!-- login -->
  <div class="login-container">
    <!-- login form -->
    <div class="login-box">
      <h2>{{ $t("message.login.form-title") }}</h2>
      <form @submit.prevent="onLogin">
        <input
          v-model="email"
          type="email"
          :placeholder="$t('message.login.input-email')"
          required
        />
        <input
          v-model="name"
          type="name"
          :placeholder="$t('message.login.input-name')"
          required
        />
        <button type="submit" :disabled="loading">
          {{
            loading
              ? $t("message.login.button-loading")
              : $t("message.login.button-login")
          }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

const router = useRouter();
const userStore = useUserStore();
const email = ref<string>("");
const name = ref<string>("");
const loading = ref<boolean>(false);

const onLogin = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    userStore.login(name.value, email.value);
    router.push("/main");
  }, 500);
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafd;
}

.login-box {
  width: 100%;
  max-width: 370px;
  padding: 40px 32px 32px 32px;
  border-radius: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  background: #fff;
  text-align: center;
}

.login-box h2 {
  margin-bottom: 10px;
  font-size: 1.45rem;
  font-weight: 700;
  color: #222;
}

.desc {
  color: #7a869a;
  font-size: 0.97rem;
  margin-bottom: 22px;
  line-height: 1.5;
}

form input[type="email"],
form input[type="password"],
form input[type="name"] {
  width: 100%;
  padding: 11px 13px;
  margin-bottom: 13px;
  border: 1px solid #dbe4ee;
  border-radius: 7px;
  font-size: 1rem;
  background: #f8fafc;
  transition: border 0.2s;
}

form input:focus {
  border: 1.5px solid #1976d2;
  outline: none;
  background: #fff;
}

form input::placeholder {
  color: #b0b8c1;
  font-size: 0.98rem;
}

button[type="submit"] {
  width: 100%;
  padding: 11px 0;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 7px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s;
  margin-top: 5px;
  margin-bottom: 2px;
}

button[type="submit"]:hover:not([disabled]) {
  background: #1256a3;
}

button[disabled] {
  background: #e0e0e0;
  color: #888;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .login-box {
    padding: 28px 8vw 24px 8vw;
    max-width: 98vw;
  }
}
</style>

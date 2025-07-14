<template>
  <a-layout-header class="header">
    <!-- logo -->
    <h1 class="logo">
      <router-link to="/" class="logo-link">
        <img :src="logoImg" alt="logo" />
      </router-link>
    </h1>
    <!-- header menu -->
    <div class="header-menu-wrapper">
      <div class="header-menu-wrapper-right">
        <div class="auth-menu" v-if="isLogin">
          <div class="profile-setting">
            <span
              class="ant-avatar ant-avatar-sm ant-avatar-circle ant-avatar-image"
            >
              <img :src="avatarImg" />
            </span>
            <div class="personal-information">
              <span class="position">{{ email }}</span>
              <span class="name">{{ username }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-layout-header>
</template>

<script setup lang="ts">
import logoImg from "@/assets/images/logo.png";
import avatarImg from "@/assets/images/icon_avatar.svg";

defineProps<{
  username?: string;
  email?: string;
  isLogin?: boolean;
}>();
</script>

<style scoped>
header {
  display: block;
  unicode-bidi: isolate;
}

.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1053;
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 50px;
  background: #07295c url(@/assets/images/bg_header_user.png) no-repeat left top;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header .header-menu-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding: 0 24px;
}

.header .logo {
  display: flex;
  align-items: center;
  width: fit-content;
  min-width: 232px;
  height: 49px;
  padding: 0 18px;
}

.header .logo .logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.header .logo .logo-link:hover {
  opacity: 0.8;
}

.header .header-menu-wrapper .auth-menu .profile-setting {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 4px;
  border-radius: 2px;
  transition: background 0.3s;
}

.header
  .header-menu-wrapper
  .auth-menu
  .profile-setting
  .personal-information
  .name {
  font-family: Pretendard;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #ffffff;
}

.header
  .header-menu-wrapper
  .auth-menu
  .profile-setting
  .personal-information
  .position {
  font-family: Pretendard;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #fffc;
}

.header .header-menu-wrapper .auth-menu .profile-setting .personal-information {
  display: flex;
  flex-direction: column;
  min-width: 60px;
}
</style>

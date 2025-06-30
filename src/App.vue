<template>
  <main id="wrap">
    <AppHeader
      :username="userStore.state.username"
      :email="userStore.state.email"
      :isLogin="userStore.isLogin()"
    />
    <router-view />
  </main>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
</script>

<style>
wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Pretendard;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: #242424;
}

*,
:after,
:before {
  box-sizing: border-box;
}

* {
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
}

div {
  display: block;
  unicode-bidi: isolate;
}

#wrap {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Pretendard;
  font-weight: 400;
  font-size: 13px;
  line-height: 18px;
  color: var(--text-default);
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

img {
  overflow-clip-margin: content-box;
  overflow: clip;
}
</style>

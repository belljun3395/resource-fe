<template>
  <main id="wrap">
    <AppHeader
      :username="userStore.state.username"
      :email="userStore.state.email"
      :isLogin="userStore.isLogin()"
    />
    <a-layout>
      <router-view />
    </a-layout>
  </main>
</template>

<script setup lang="ts">
import AppHeader from "@/components/AppHeader.vue";
import { useUserStore } from "@/store/userStore";

const userStore = useUserStore();
</script>

<style>
/* ==========================================================================
   Font Face Declarations
   ========================================================================== */
/* Font file not available - using system fonts */

/* ==========================================================================
   Global CSS Variables
   ========================================================================== */
:root {
  /* Typography */
  --font-family-primary: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    sans-serif;
  --font-weight-normal: 400;
  --font-size-base: 13px;
  --line-height-base: 18px;

  /* Colors */
  --text-default: #242424;
  --text-secondary: rgba(0, 0, 0, 0.65);

  /* Layout */
  --header-height: 50px;
  --viewport-full: 100vw;
  --viewport-height: 100vh;
}

/* ==========================================================================
   Global Reset & Base Styles
   ========================================================================== */

/* Box-sizing reset for all elements */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Global reset - remove default margins, paddings, and inherit font styles */
* {
  margin: 0;
  padding: 0;
  font: inherit;
  color: inherit;
}

/* Ensure proper block display for div elements */
div {
  display: block;
  unicode-bidi: isolate;
}

/* ==========================================================================
   Media Elements Optimization
   ========================================================================== */

/* Responsive media elements */
img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

/* Modern image overflow handling */
img {
  overflow-clip-margin: content-box;
  overflow: clip;
}

/* ==========================================================================
   Application Layout
   ========================================================================== */

/* Main application container */
#wrap {
  width: var(--viewport-full);
  height: var(--viewport-height);
  overflow: hidden;
  font-family: var(--font-family-primary);
  font-weight: var(--font-weight-normal);
  font-size: var(--font-size-base);
  line-height: var(--line-height-base);
  color: var(--text-default);
}

/* ==========================================================================
   Ant Design Framework Overrides
   ========================================================================== */

/* Adjust layout to accommodate fixed header */
.ant-layout {
  padding-top: var(--header-height); /* Space for AppHeader component */
  min-height: calc(var(--viewport-height) - var(--header-height));
}

/* ==========================================================================
   Message Component Positioning
   ========================================================================== */

/* Adjust Ant Design message position to avoid header overlap */
.ant-message {
  top: calc(
    var(--header-height) + 16px
  ) !important; /* Header height + margin */
  z-index: 1054 !important; /* Higher than header z-index (1053) */
}
</style>

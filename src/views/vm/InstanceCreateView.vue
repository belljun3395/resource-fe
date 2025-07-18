<template>
  <div class="instance-create-view">
    <div class="page-header">
      <a-breadcrumb>
        <a-breadcrumb-item>{{
          t("message.vm.instance.breadcrumb-server")
        }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{
          t("message.vm.instance.breadcrumb-instance")
        }}</a-breadcrumb-item>
        <a-breadcrumb-item>{{
          t("message.vm.instance.breadcrumb-create")
        }}</a-breadcrumb-item>
      </a-breadcrumb>

      <div class="page-title">
        <h1>{{ t("message.vm.create.page-title") }}</h1>
        <p>{{ t("message.vm.create.page-description") }}</p>
      </div>
    </div>

    <div class="page-content">
      <VmInstanceCreate />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import VmInstanceCreate from "@/components/vm/VmInstanceCreate.vue";

const { t } = useI18n();
</script>

<style scoped>
.instance-create-view {
  padding: 74px 24px 24px 24px; /* top padding: 50px(header) + 24px = 74px */
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.page-title {
  margin-top: 16px;
}

.page-title h1 {
  margin: 0;
  color: #262626;
  font-size: 24px;
  font-weight: 500;
}

.page-title p {
  margin: 8px 0 0;
  color: #666;
  font-size: 14px;
}

.page-content {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

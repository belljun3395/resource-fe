<template>
  <a-dropdown :trigger="['click']">
    <a-button type="primary" :loading="loading">
      {{ t("message.vm.instance.power-status-dropdown") }} <DownOutlined />
    </a-button>
    <template #overlay>
      <a-menu @click="handlePowerStatusAction">
        <a-menu-item key="start" :disabled="powerState === 'RUNNING'">
          {{ t("message.vm.instance.action-start") }}
        </a-menu-item>
        <a-menu-item key="shutdown" :disabled="powerState === 'SHUTDOWN'">
          {{ t("message.vm.instance.action-shutdown") }}
        </a-menu-item>
        <a-menu-item key="reboot" :disabled="powerState !== 'RUNNING'">
          {{ t("message.vm.instance.action-reboot") }}
        </a-menu-item>
        <a-menu-item key="pause" :disabled="powerState !== 'RUNNING'">
          {{ t("message.vm.instance.action-pause") }}
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { DownOutlined } from "@ant-design/icons-vue";
import type { PowerActionString } from "@/types/vm";
import type {
  VmInstancePowerStatusDropdownProps,
  VmInstancePowerStatusDropdownEmits,
  MenuClickEvent,
} from "@/types/components";

const { t } = useI18n();

const props = defineProps<VmInstancePowerStatusDropdownProps>();
const emit = defineEmits<VmInstancePowerStatusDropdownEmits>();

const internalLoading = ref(false);
const loading = computed(() => props.loading ?? internalLoading.value);

const handlePowerStatusAction = async (event: MenuClickEvent) => {
  const action = event.key as PowerActionString;

  if (props.loading === undefined) {
    internalLoading.value = true;
  }

  try {
    emit("powerStatusChange", action);
    // 부모 컴포넌트에서 API 호출 완료를 기다리기 위해 약간의 지연
    if (props.loading === undefined) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } finally {
    if (props.loading === undefined) {
      internalLoading.value = false;
    }
  }
};
</script>

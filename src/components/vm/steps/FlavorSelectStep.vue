<template>
  <div class="step-panel">
    <h3>{{ t("message.vm.create.step-flavor") }}</h3>
    <a-form layout="vertical">
      <a-form-item :label="t('message.vm.create.flavor-select')" required>
        <a-select
          v-model:value="formData.flavorId"
          :placeholder="t('message.vm.create.flavor-select-placeholder')"
          :options="flavorOptions"
          @change="handleFlavorChange"
        >
          <template #option="{ label, description, vcpu, memory, rootDisk }">
            <div class="flavor-option">
              <div class="flavor-name">{{ label }}</div>
              <div class="flavor-specs">
                CPU: {{ vcpu }} | {{ t("message.vm.create.flavor-memory") }}:
                {{ memory }}MB | {{ t("message.vm.create.flavor-disk") }}:
                {{ rootDisk }}GB
              </div>
              <div class="flavor-description">{{ description }}</div>
            </div>
          </template>
        </a-select>
      </a-form-item>
    </a-form>

    <div v-if="selectedFlavor" class="flavor-summary">
      <h4>{{ t("message.vm.create.flavor-selected-info") }}</h4>
      <a-descriptions :column="1" bordered>
        <a-descriptions-item :label="t('message.vm.create.flavor-name')">
          {{ selectedFlavor.name }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.flavor-description')">
          {{ selectedFlavor.description }}
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.flavor-cpu')">
          {{ selectedFlavor.vcpu }} vCPU
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.flavor-memory')">
          {{ selectedFlavor.memory }} MB
        </a-descriptions-item>
        <a-descriptions-item :label="t('message.vm.create.flavor-disk')">
          {{ selectedFlavor.rootDisk }} GB
        </a-descriptions-item>
      </a-descriptions>
    </div>

    <div class="step-actions">
      <a-button @click="$emit('previous')">
        {{ t("message.vm.create.button-previous") }}
      </a-button>
      <a-button
        type="primary"
        @click="handleNext"
        :disabled="!formData.flavorId"
        :loading="loading"
      >
        {{ t("message.vm.create.button-next") }}
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { FlavorSpec } from "@/types/flavor";
import type { VmCreateFormData } from "@/types/vm-form";

interface Props {
  formData: VmCreateFormData;
  flavors: FlavorSpec[];
  loading?: boolean;
}

interface Emits {
  (e: "update:form-data", value: VmCreateFormData): void;
  (e: "next"): void;
  (e: "previous"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();
const { t } = useI18n();

const flavorOptions = computed(() =>
  props.flavors.map((flavor) => ({
    value: flavor.id,
    label: flavor.name,
    description: flavor.description,
    vcpu: flavor.vcpu,
    memory: flavor.memory,
    rootDisk: flavor.rootDisk,
  }))
);

const selectedFlavor = computed(() =>
  props.flavors.find((flavor) => flavor.id === props.formData.flavorId)
);

const handleFlavorChange = (value: number) => {
  const updatedFormData = { ...props.formData };
  updatedFormData.flavorId = value;
  emit("update:form-data", updatedFormData);
};

const handleNext = () => {
  emit("next");
};
</script>

<style scoped>
.step-panel h3 {
  margin-bottom: 32px;
  color: #262626;
  font-size: 18px;
  font-weight: 500;
}

.step-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}

.flavor-option {
  padding: 8px 0;
}

.flavor-name {
  font-weight: 500;
  color: #262626;
}

.flavor-specs {
  font-size: 12px;
  color: #666;
  margin: 4px 0;
}

.flavor-description {
  font-size: 12px;
  color: #999;
}

.flavor-summary {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
}

.flavor-summary h4 {
  margin-bottom: 16px;
  color: #262626;
}

:deep(.ant-select-selector) {
  min-height: 40px;
}
</style>

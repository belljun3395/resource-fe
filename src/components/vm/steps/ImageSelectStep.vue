<template>
  <div class="step-panel">
    <h3>{{ t("message.vm.create.step-image") }}</h3>
    <a-table
      :columns="imageColumns"
      :data-source="images"
      :pagination="false"
      row-key="id"
      :row-selection="{
        type: 'radio',
        selectedRowKeys: formData.sourceId ? [formData.sourceId] : [],
        onChange: handleImageSelect,
      }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'id'">
          <a-tag>{{ record.id }}</a-tag>
        </template>
      </template>
    </a-table>
    <div class="step-actions">
      <a-button @click="$emit('previous')">
        {{ t("message.vm.create.button-previous") }}
      </a-button>
      <a-button
        type="primary"
        @click="handleNext"
        :disabled="!formData.sourceId"
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
import type { ImageSpec } from "@/types/image";
import type { VmCreateFormData } from "@/types/vm-form";

interface Props {
  formData: VmCreateFormData;
  images: ImageSpec[];
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

const imageColumns = computed(() => [
  {
    title: t("message.vm.create.image-id"),
    dataIndex: "id",
    key: "id",
    width: 120,
  },
  {
    title: t("message.vm.create.image-name"),
    dataIndex: "name",
    key: "name",
  },
]);

const handleImageSelect = (selectedRowKeys: number[]) => {
  const updatedFormData = { ...props.formData };
  updatedFormData.sourceId = selectedRowKeys[0] || null;
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

:deep(.ant-table-row-selected) {
  background-color: #e6f7ff !important;
}
</style>

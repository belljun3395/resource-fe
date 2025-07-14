<template>
  <div class="step-panel">
    <h3>{{ t("message.vm.create.step-basic") }}</h3>
    <a-form
      :model="props.formData"
      :rules="basicInfoRules"
      layout="vertical"
      @finish="handleNext"
    >
      <a-form-item
        :label="t('message.vm.create.form-name')"
        name="name"
        required
      >
        <a-input
          :value="props.formData.name"
          @update:value="updateName"
          :placeholder="t('message.vm.create.form-name-placeholder')"
        />
      </a-form-item>
      <a-form-item
        :label="t('message.vm.create.form-description')"
        name="description"
      >
        <a-textarea
          :value="props.formData.description"
          @update:value="updateDescription"
          :placeholder="t('message.vm.create.form-description-placeholder')"
          :rows="3"
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="loading">
          {{ t("message.vm.create.button-next") }}
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { VmCreateFormData } from "@/types/vm-form";

interface Props {
  formData: VmCreateFormData;
  loading?: boolean;
}

interface Emits {
  (e: "update:form-data", value: VmCreateFormData): void;
  (e: "next"): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<Emits>();
const { t } = useI18n();

const basicInfoRules = computed(() => ({
  name: [
    { required: true, message: t("message.vm.create.form-name-required") },
    { min: 2, max: 50, message: t("message.vm.create.form-name-length") },
  ],
}));

const updateName = (value: string) => {
  const updatedFormData = { ...props.formData };
  updatedFormData.name = value;
  emit("update:form-data", updatedFormData);
};

const updateDescription = (value: string) => {
  const updatedFormData = { ...props.formData };
  updatedFormData.description = value;
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
</style>

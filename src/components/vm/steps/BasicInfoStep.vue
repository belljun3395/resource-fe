<template>
  <div class="step-panel">
    <h3>{{ t("message.vm.create.step-basic") }}</h3>
    <a-form
      ref="formRef"
      :model="props.formData"
      :rules="basicInfoRules"
      layout="vertical"
      validateTrigger="input"
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
          :maxlength="80"
          :showCount="true"
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
import { computed, ref, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { getVmApi } from "@/api/vm";
import type { VmCreateFormData } from "@/types/vm-form";
import type { FormInstance } from "ant-design-vue";

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

// Form ref
const formRef = ref<FormInstance>();

// 중복 이름 검증을 위한 캐시
const existingNames = ref<Set<string>>(new Set());

// 기존 인스턴스 이름 목록 가져오기
const loadExistingNames = async () => {
  try {
    const vmApi = await getVmApi();
    const response = await vmApi.getInstanceList({ page: 0, size: 1000 });
    existingNames.value = new Set(
      response.data.map((instance) => instance.name.toLowerCase())
    );
  } catch (error) {
    console.error("Failed to load existing instance names:", error);
  }
};

// 컴포넌트 마운트 시 기존 이름 목록 로드
loadExistingNames();

const basicInfoRules = computed(() => ({
  name: [
    { required: true, message: t("message.vm.create.form-name-required") },
    { min: 2, max: 50, message: t("message.vm.create.form-name-length") },
    {
      validator: (_rule: any, value: string) => {
        if (!value) return Promise.resolve();

        // 공백이 포함되어 있는지 검사 (앞, 뒤, 중간 모든 공백)
        if (/\s/.test(value)) {
          return Promise.reject(
            new Error(t("message.vm.create.form-name-no-whitespace"))
          );
        }

        // 중복 이름 검사 (대소문자 구분 없이)
        if (existingNames.value.has(value.toLowerCase())) {
          return Promise.reject(
            new Error(t("message.vm.create.form-name-duplicate"))
          );
        }

        return Promise.resolve();
      },
    },
  ],
  description: [
    { max: 80, message: t("message.vm.create.form-description-length") },
  ],
}));

const updateName = async (value: string) => {
  const updatedFormData = { ...props.formData };
  updatedFormData.name = value;
  emit("update:form-data", updatedFormData);

  // 즉시 validation 트리거
  await nextTick();
  if (formRef.value) {
    formRef.value.validateFields(["name"]).catch(() => {
      // validation 에러는 UI에서 처리되므로 여기서는 무시
    });
  }
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

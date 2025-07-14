<template>
  <div class="vm-instance-create">
    <a-steps
      :current="currentStep"
      class="create-steps"
      @change="handleStepChange"
    >
      <a-step
        v-for="(step, index) in stepConfig"
        :key="index"
        :title="t(step.title)"
      />
    </a-steps>

    <div class="step-content">
      <component
        :is="currentStepComponent"
        v-model:form-data="formData"
        v-bind="currentStepProps"
        @next="handleNext"
        @previous="handlePrevious"
        @create="handleCreateInstance"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { message } from "ant-design-vue";
import { MOCK_IMAGES } from "@/types/const/image";
import { MOCK_FLAVORS } from "@/types/const/flavor";
import { getVmApi } from "@/api/vm";
import type { ImageSpec } from "@/types/image";
import type { FlavorSpec } from "@/types/flavor";
import type { VmCreateFormData } from "@/types/vm-form";
import BasicInfoStep from "@/components/vm/steps/BasicInfoStep.vue";
import ImageSelectStep from "@/components/vm/steps/ImageSelectStep.vue";
import FlavorSelectStep from "@/components/vm/steps/FlavorSelectStep.vue";
import ReviewStep from "@/components/vm/steps/ReviewStep.vue";

// 단계별 설정 (확장 가능한 구조)
const stepConfig = [
  {
    component: BasicInfoStep,
    title: "message.vm.create.step-basic",
  },
  {
    component: ImageSelectStep,
    title: "message.vm.create.step-image",
  },
  {
    component: FlavorSelectStep,
    title: "message.vm.create.step-flavor",
  },
  {
    component: ReviewStep,
    title: "message.vm.create.step-confirm",
  },
];

// 현재 단계 컴포넌트
const currentStepComponent = computed(
  () => stepConfig[currentStep.value]?.component
);

// 각 단계별 props (formData는 v-model로 별도 처리)
const currentStepProps = computed(() => {
  const baseProps = {
    loading: loading.value,
  };

  switch (currentStep.value) {
    case 1:
      return {
        ...baseProps,
        images: images.value,
      };
    case 2:
      return {
        ...baseProps,
        flavors: flavors.value,
      };
    case 3:
      return {
        ...baseProps,
        images: images.value,
        flavors: flavors.value,
      };
    default:
      return baseProps;
  }
});

// message 위치 설정 (AppHeader 아래에 표시되도록)
message.config({
  top: "70px", // AppHeader(50px) + 여백(20px)
});

const router = useRouter();
const { t } = useI18n();

// 폼 데이터
const formData = ref<VmCreateFormData>({
  name: "",
  description: "",
  imageId: null,
  flavorId: null,
});

// 현재 단계
const currentStep = ref(0);
const loading = ref(false);

// 이미지 및 플레이버 데이터
const images = ref<ImageSpec[]>([]);
const flavors = ref<FlavorSpec[]>([]);

// 데이터 로드
onMounted(() => {
  loadData();
});

const loadData = () => {
  // 현재는 Mock 데이터 사용
  // 향후 API 연동 시 이 부분을 수정하면 됨
  images.value = MOCK_IMAGES;
  flavors.value = MOCK_FLAVORS;
};

// 단계별 검증 규칙
const stepValidations = [
  () => true, // Step 0: 기본 정보 - 항상 true (개별 필드 검증은 컴포넌트에서)
  () => {
    if (!formData.value.name.trim()) {
      message.error(t("message.vm.create.form-name-required"));
      return false;
    }
    return true;
  },
  () => {
    if (!formData.value.imageId) {
      message.error(t("message.vm.create.error-image-required"));
      return false;
    }
    return true;
  },
  () => {
    if (!formData.value.flavorId) {
      message.error(t("message.vm.create.error-flavor-required"));
      return false;
    }
    return true;
  },
];

// 폼 검증 로직 통합
const validateStep = (targetStep: number): boolean => {
  // 현재 단계부터 목표 단계까지 모든 검증 실행
  for (let step = 1; step <= targetStep; step++) {
    if (stepValidations[step] && !stepValidations[step]()) {
      return false;
    }
  }
  return true;
};

// 단계 클릭 시 이동 처리
const handleStepChange = (step: number) => {
  // 현재 단계보다 뒤로는 항상 이동 가능
  if (step < currentStep.value) {
    currentStep.value = step;
    return;
  }

  // 앞으로 이동할 때는 검증 필요
  if (step > currentStep.value && validateStep(step)) {
    currentStep.value = step;
  }
};

// 다음 단계로 이동
const handleNext = () => {
  const nextStep = currentStep.value + 1;
  if (validateStep(nextStep)) {
    currentStep.value = nextStep;
  }
};

const handlePrevious = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleCreateInstance = async () => {
  if (!formData.value.flavorId) {
    message.error(t("message.vm.create.error-flavor-required"));
    return;
  }

  loading.value = true;

  try {
    const vmApi = await getVmApi();
    const response = await vmApi.createInstance({
      name: formData.value.name,
      description: formData.value.description,
      imageId: formData.value.imageId!,
      flavorId: formData.value.flavorId,
    });

    message.success(t("message.vm.create.success-created"));
    router.push(`/servers/instances/${response.id}`);
  } catch (error) {
    console.error("인스턴스 생성 실패:", error);
    message.error(t("message.vm.create.error-create-failed"));
  } finally {
    loading.value = false;
  }
};

// 스토리북에서 접근할 수 있도록 expose
defineExpose({
  currentStep,
  formData,
});
</script>

<style scoped>
.vm-instance-create {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.create-steps {
  margin-bottom: 64px;
  display: flex;
  justify-content: center;
}

:deep(.ant-steps) {
  max-width: 800px;
  margin: 0 auto;
}

:deep(.ant-steps-item) {
  cursor: pointer;
}

:deep(.ant-steps-item:hover .ant-steps-item-title) {
  color: #1890ff;
}

:deep(.ant-steps-item-finish .ant-steps-item-icon) {
  cursor: pointer;
}

:deep(.ant-steps-item-process .ant-steps-item-icon) {
  cursor: pointer;
}

:deep(.ant-steps-item-wait .ant-steps-item-icon) {
  cursor: pointer;
}

/* 4번 단계 스타일 커스터마이징 */
:deep(
    .ant-steps-item:nth-child(4).ant-steps-item-process .ant-steps-item-icon
  ) {
  background-color: #52c41a;
  border-color: #52c41a;
}

.step-content {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  margin: 24px;
  min-height: 70vh;
}

/* 버튼 그림자 제거 */
:deep(.ant-btn-primary) {
  box-shadow: none !important;
}

:deep(.ant-btn-primary:hover) {
  box-shadow: none !important;
}

:deep(.ant-btn-primary:focus) {
  box-shadow: none !important;
}
</style>

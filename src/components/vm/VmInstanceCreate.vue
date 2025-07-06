<template>
  <div class="vm-instance-create">
    <a-steps
      :current="currentStep"
      class="create-steps"
      @change="handleStepChange"
    >
      <a-step :title="t('message.vm.create.step-basic')" />
      <a-step :title="t('message.vm.create.step-image')" />
      <a-step :title="t('message.vm.create.step-flavor')" />
      <a-step :title="t('message.vm.create.step-confirm')" />
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

// 컴포넌트 매핑
const stepComponents: Record<number, any> = {
  0: BasicInfoStep,
  1: ImageSelectStep,
  2: FlavorSelectStep,
  3: ReviewStep,
};

// 현재 단계 컴포넌트
const currentStepComponent = computed(() => stepComponents[currentStep.value]);

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
  // TODO: 실제 환경에서는 API 호출로 변경
  images.value = MOCK_IMAGES;
  flavors.value = MOCK_FLAVORS;
};

// 단계 클릭 시 이동 처리
const handleStepChange = (step: number) => {
  // 현재 단계보다 뒤로는 항상 이동 가능
  if (step < currentStep.value) {
    currentStep.value = step;
    return;
  }

  // 앞으로 이동할 때는 검증 필요
  if (step > currentStep.value) {
    // Step 1 -> Step 2: 이름 입력 확인
    if (currentStep.value === 0 && step >= 1) {
      if (!formData.value.name.trim()) {
        message.error(t("message.vm.create.form-name-required"));
        return;
      }
    }

    // Step 2 -> Step 3: 이미지 선택 확인
    if (currentStep.value <= 1 && step >= 2) {
      if (!formData.value.imageId) {
        message.error(t("message.vm.create.error-image-required"));
        return;
      }
    }

    // Step 3 -> Step 4: 플레이버 선택 확인
    if (currentStep.value <= 2 && step >= 3) {
      if (!formData.value.flavorId) {
        message.error(t("message.vm.create.error-flavor-required"));
        return;
      }
    }

    currentStep.value = step;
  }
};

// 통합된 이벤트 핸들링
const handleNext = () => {
  switch (currentStep.value) {
    case 0:
      if (formData.value.name.trim()) currentStep.value = 1;
      else message.error(t("message.vm.create.form-name-required"));
      break;
    case 1:
      if (formData.value.imageId) currentStep.value = 2;
      else message.error(t("message.vm.create.error-image-required"));
      break;
    case 2:
      if (formData.value.flavorId) currentStep.value = 3;
      else message.error(t("message.vm.create.error-flavor-required"));
      break;
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

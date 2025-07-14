// @ts-nocheck
import VmInstanceCreate from "@/components/vm/VmInstanceCreate.vue";
import BasicInfoStep from "@/components/vm/steps/BasicInfoStep.vue";
import ImageSelectStep from "@/components/vm/steps/ImageSelectStep.vue";
import FlavorSelectStep from "@/components/vm/steps/FlavorSelectStep.vue";
import ReviewStep from "@/components/vm/steps/ReviewStep.vue";
import { MOCK_IMAGES } from "@/types/const/image";
import { MOCK_FLAVORS } from "@/types/const/flavor";

export default {
  title: "Components/VM/VmInstanceCreate",
  component: VmInstanceCreate,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: "VM 인스턴스 생성을 위한 4단계 마법사 컴포넌트입니다.",
      },
    },
  },
};

// 각 단계 컴포넌트 개별 스토리
const StepWrapper = (component, props = {}) => ({
  components: { [component.name]: component },
  data() {
    return {
      formData: {
        name: "Example VM",
        description: "테스트용 VM 인스턴스",
        imageId: 1,
        flavorId: 2,
        ...props.formData,
      },
      loading: false,
      ...props,
    };
  },
  template: `
    <div style="min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 800px; margin: 0 auto; background: white; padding: 24px; border-radius: 8px;">
        <component 
          :is="$options.components[Object.keys($options.components)[0]]"
          v-model:form-data="formData"
          :loading="loading"
          v-bind="$props"
          @next="() => {}"
          @previous="() => {}"
          @create="() => {}"
        />
      </div>
    </div>
  `,
});

// 완전한 마법사 컴포넌트 - 각 단계별 시나리오
const WizardStepWrapper = (initialStep, initialFormData = {}) => ({
  components: { VmInstanceCreate },
  data() {
    return {
      targetStep: initialStep,
      targetFormData: {
        name: "",
        description: "",
        imageId: null,
        flavorId: null,
        ...initialFormData,
      },
    };
  },
  template: `
    <div style="min-height: 100vh; background-color: #f5f5f5;">
      <VmInstanceCreate ref="vmComponent" />
    </div>
  `,
  mounted() {
    // 마운트 후 강제로 단계와 폼 데이터 설정
    this.$nextTick(() => {
      if (this.$refs.vmComponent) {
        this.$refs.vmComponent.currentStep = this.targetStep;
        Object.assign(this.$refs.vmComponent.formData, this.targetFormData);
      }
    });
  },
});

// 마법사 1단계 - 기본 정보 입력
export const Step1_BasicInfo = {
  render: () => WizardStepWrapper(0, {}),
  parameters: {
    docs: {
      description: {
        story: "완전한 마법사 화면에서 1단계 기본정보 입력 상태를 보여줍니다.",
      },
    },
  },
};

// 마법사 2단계 - 이미지 선택
export const Step2_ImageSelection = {
  render: () =>
    WizardStepWrapper(1, {
      name: "Example VM",
      description: "테스트용 VM",
    }),
  parameters: {
    docs: {
      description: {
        story: "완전한 마법사 화면에서 2단계 이미지 선택 상태를 보여줍니다.",
      },
    },
  },
};

// 마법사 3단계 - 플레이버 선택
export const Step3_FlavorSelection = {
  render: () =>
    WizardStepWrapper(2, {
      name: "Example VM",
      description: "테스트용 VM",
      imageId: 1,
    }),
  parameters: {
    docs: {
      description: {
        story: "완전한 마법사 화면에서 3단계 플레이버 선택 상태를 보여줍니다.",
      },
    },
  },
};

// 마법사 4단계 - 검토 및 생성
export const Step4_Review = {
  render: () =>
    WizardStepWrapper(3, {
      name: "Production VM",
      description: "프로덕션 환경용 VM 인스턴스",
      imageId: 1,
      flavorId: 2,
    }),
  parameters: {
    docs: {
      description: {
        story: "완전한 마법사 화면에서 4단계 검토 및 생성 상태를 보여줍니다.",
      },
    },
  },
};

// 실제 동작하는 컴포넌트
export const InteractiveDemo = {
  render: () => ({
    components: { VmInstanceCreate },
    template: `
      <div style="min-height: 100vh; background-color: #f5f5f5;">
        <VmInstanceCreate />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story:
          "실제로 동작하는 VM 생성 컴포넌트입니다. 모든 단계를 직접 체험해볼 수 있습니다.",
      },
    },
  },
};

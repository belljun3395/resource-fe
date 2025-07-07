// @ts-nocheck
import VmInstanceCreate from "@/components/vm/VmInstanceCreate.vue";

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

// 각 단계를 보여주는 독립적인 컴포넌트 생성
const StoryWrapper = (stepIndex, initialFormData = {}) => ({
  components: { VmInstanceCreate },
  data() {
    return {
      formData: {
        name: "",
        description: "",
        imageId: null,
        flavorId: null,
        ...initialFormData,
      },
      currentStep: stepIndex,
      loading: false,
    };
  },
  template: `
    <div style="min-height: 100vh; background-color: #f5f5f5; padding: 20px;">
      <div style="max-width: 1200px; margin: 0 auto;">
        <VmInstanceCreate 
          :initial-step="currentStep"
          :initial-form-data="formData"
          :force-step="currentStep"
        />
      </div>
    </div>
  `,
});

// 1단계 - 기본 정보 입력
export const Step1_BasicInfo = {
  render: () => StoryWrapper(0, {}),
  parameters: {
    docs: {
      description: {
        story:
          "VM 인스턴스 생성의 첫 번째 단계입니다. VM 이름과 설명을 입력합니다.",
      },
    },
  },
};

// 2단계 - 이미지 선택
export const Step2_ImageSelection = {
  render: () =>
    StoryWrapper(1, {
      name: "Example VM",
      description: "테스트용 VM",
    }),
  parameters: {
    docs: {
      description: {
        story:
          "이미지 선택 단계입니다. 사용 가능한 이미지 목록에서 VM에 사용할 이미지를 선택합니다.",
      },
    },
  },
};

// 3단계 - 플레이버 선택
export const Step3_FlavorSelection = {
  render: () =>
    StoryWrapper(2, {
      name: "Example VM",
      description: "테스트용 VM",
      imageId: 1,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "플레이버 선택 단계입니다. VM의 CPU, 메모리, 디스크 사양을 결정합니다.",
      },
    },
  },
};

// 4단계 - 검토 및 생성
export const Step4_Review = {
  render: () =>
    StoryWrapper(3, {
      name: "Production VM",
      description: "프로덕션 환경용 VM 인스턴스",
      imageId: 1,
      flavorId: 2,
    }),
  parameters: {
    docs: {
      description: {
        story:
          "최종 검토 단계입니다. 모든 입력 정보를 확인하고 VM 인스턴스를 생성합니다.",
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

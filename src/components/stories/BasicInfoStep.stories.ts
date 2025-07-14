// @ts-nocheck
import BasicInfoStep from "@/components/vm/steps/BasicInfoStep.vue";

export default {
  title: "Components/VM/Steps/BasicInfoStep",
  component: BasicInfoStep,
  argTypes: {
    loading: {
      control: "boolean",
      description: "로딩 상태를 제어합니다.",
    },
    "onUpdate:form-data": { action: "update:form-data" },
    onNext: { action: "next" },
  },
  parameters: {
    docs: {
      description: {
        component: "VM 생성의 첫 번째 단계인 기본 정보 입력 컴포넌트입니다.",
      },
    },
  },
};

const Template = (args: any) => ({
  components: { BasicInfoStep },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 24px; background-color: #f5f5f5; min-height: 500px;">
      <BasicInfoStep v-bind="args" />
    </div>
  `,
});

// 기본 상태 - 빈 폼
export const Default = Template.bind({});
Default.args = {
  formData: {
    name: "",
    description: "",
    imageId: null,
    flavorId: null,
  },
  loading: false,
};
Default.parameters = {
  docs: {
    description: {
      story:
        "기본 상태의 빈 폼입니다. 사용자가 VM 이름과 설명을 입력할 수 있습니다.",
    },
  },
};

// 입력된 상태
export const WithData = Template.bind({});
WithData.args = {
  formData: {
    name: "my-awesome-vm",
    description: "Production web server for e-commerce platform",
    imageId: null,
    flavorId: null,
  },
  loading: false,
};
WithData.parameters = {
  docs: {
    description: {
      story: "사용자가 이름과 설명을 입력한 상태입니다.",
    },
  },
};

// 긴 텍스트 입력
export const WithLongText = Template.bind({});
WithLongText.args = {
  formData: {
    name: "very-long-vm-name-that-might-cause-ui-issues-in-some-cases",
    description:
      "This is a very long description that tests how the UI handles extensive text input. It should wrap properly and maintain good readability even with large amounts of text content that users might enter.",
    imageId: null,
    flavorId: null,
  },
  loading: false,
};
WithLongText.parameters = {
  docs: {
    description: {
      story: "긴 텍스트가 입력되었을 때의 UI 처리를 확인할 수 있습니다.",
    },
  },
};

// 로딩 상태
export const Loading = Template.bind({});
Loading.args = {
  formData: {
    name: "loading-test-vm",
    description: "Testing loading state",
    imageId: null,
    flavorId: null,
  },
  loading: true,
};
Loading.parameters = {
  docs: {
    description: {
      story: "다음 버튼이 로딩 상태일 때의 모습입니다.",
    },
  },
};

// 필수 필드 누락 (이름 없음)
export const MissingName = Template.bind({});
MissingName.args = {
  formData: {
    name: "",
    description: "Description without name",
    imageId: null,
    flavorId: null,
  },
  loading: false,
};
MissingName.parameters = {
  docs: {
    description: {
      story:
        "필수 필드인 이름이 입력되지 않은 상태입니다. 폼 검증 에러를 확인할 수 있습니다.",
    },
  },
};

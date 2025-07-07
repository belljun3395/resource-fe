// @ts-nocheck
import FlavorSelectStep from "@/components/vm/steps/FlavorSelectStep.vue";
import { MOCK_FLAVORS } from "@/types/const/flavor";

export default {
  title: "Components/VM/Steps/FlavorSelectStep",
  component: FlavorSelectStep,
  argTypes: {
    loading: {
      control: "boolean",
      description: "로딩 상태를 제어합니다.",
    },
    "onUpdate:form-data": { action: "update:form-data" },
    onNext: { action: "next" },
    onPrevious: { action: "previous" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "VM 생성의 세 번째 단계인 플레이버(인스턴스 크기) 선택 컴포넌트입니다.",
      },
    },
  },
};

const Template = (args: any) => ({
  components: { FlavorSelectStep },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 24px; background-color: #f5f5f5; min-height: 500px;">
      <FlavorSelectStep v-bind="args" />
    </div>
  `,
});

// 기본 상태 - 플레이버 선택 안됨
export const Default = Template.bind({});
Default.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: null,
  },
  flavors: MOCK_FLAVORS,
  loading: false,
};
Default.parameters = {
  docs: {
    description: {
      story:
        "플레이버가 선택되지 않은 기본 상태입니다. 드롭다운에서 플레이버를 선택할 수 있습니다.",
    },
  },
};

// 플레이버 선택된 상태
export const WithSelectedFlavor = Template.bind({});
WithSelectedFlavor.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: 1,
  },
  flavors: MOCK_FLAVORS,
  loading: false,
};
WithSelectedFlavor.parameters = {
  docs: {
    description: {
      story:
        "Small 플레이버가 선택된 상태입니다. 선택된 플레이버의 상세 정보가 표시됩니다.",
    },
  },
};

// 중형 플레이버 선택
export const MediumFlavor = Template.bind({});
MediumFlavor.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: 2,
  },
  flavors: MOCK_FLAVORS,
  loading: false,
};
MediumFlavor.parameters = {
  docs: {
    description: {
      story: "Medium 플레이버가 선택된 상태입니다.",
    },
  },
};

// 대형 플레이버 선택
export const LargeFlavor = Template.bind({});
LargeFlavor.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: 3,
  },
  flavors: MOCK_FLAVORS,
  loading: false,
};
LargeFlavor.parameters = {
  docs: {
    description: {
      story: "Large 플레이버가 선택된 상태입니다.",
    },
  },
};

// 로딩 상태
export const Loading = Template.bind({});
Loading.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: 2,
  },
  flavors: MOCK_FLAVORS,
  loading: true,
};
Loading.parameters = {
  docs: {
    description: {
      story: "다음 단계로 이동 중인 로딩 상태입니다.",
    },
  },
};

// 빈 플레이버 목록
export const EmptyFlavors = Template.bind({});
EmptyFlavors.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: null,
  },
  flavors: [],
  loading: false,
};
EmptyFlavors.parameters = {
  docs: {
    description: {
      story: "사용 가능한 플레이버가 없는 상태입니다.",
    },
  },
};

// 커스텀 플레이버 목록
export const CustomFlavors = Template.bind({});
CustomFlavors.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: null,
  },
  flavors: [
    {
      id: 1,
      name: "Micro",
      description: "Minimal resources for testing",
      vcpu: 1,
      memory: 512,
      rootDisk: 5,
    },
    {
      id: 2,
      name: "Standard",
      description: "Balanced compute and memory",
      vcpu: 2,
      memory: 4096,
      rootDisk: 40,
    },
    {
      id: 3,
      name: "High-Memory",
      description: "Memory optimized for data processing",
      vcpu: 4,
      memory: 16384,
      rootDisk: 80,
    },
    {
      id: 4,
      name: "High-CPU",
      description: "CPU optimized for compute workloads",
      vcpu: 8,
      memory: 8192,
      rootDisk: 40,
    },
    {
      id: 5,
      name: "Enterprise",
      description: "High-performance for production workloads",
      vcpu: 16,
      memory: 32768,
      rootDisk: 200,
    },
  ],
  loading: false,
};
CustomFlavors.parameters = {
  docs: {
    description: {
      story: "다양한 크기의 커스텀 플레이버 옵션들입니다.",
    },
  },
};

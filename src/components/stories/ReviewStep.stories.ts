// @ts-nocheck
import ReviewStep from "@/components/vm/steps/ReviewStep.vue";
import { MOCK_IMAGES } from "@/types/const/image";
import { MOCK_FLAVORS } from "@/types/const/flavor";

export default {
  title: "Components/VM/Steps/ReviewStep",
  component: ReviewStep,
  argTypes: {
    loading: {
      control: "boolean",
      description: "로딩 상태를 제어합니다.",
    },
    onCreate: { action: "create" },
    onPrevious: { action: "previous" },
  },
  parameters: {
    docs: {
      description: {
        component: "VM 생성의 마지막 단계인 정보 검토 및 생성 컴포넌트입니다.",
      },
    },
  },
};

const Template = (args: any) => ({
  components: { ReviewStep },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 24px; background-color: #f5f5f5; min-height: 500px;">
      <ReviewStep v-bind="args" />
    </div>
  `,
});

// 기본 상태 - 모든 정보 입력됨
export const Default = Template.bind({});
Default.args = {
  formData: {
    name: "production-web-server",
    description: "Production web server for e-commerce platform",
    imageId: 1,
    flavorId: 2,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
Default.parameters = {
  docs: {
    description: {
      story: "모든 정보가 입력되어 생성 준비가 완료된 상태입니다.",
    },
  },
};

// 설명 없는 경우
export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  formData: {
    name: "simple-vm",
    description: "",
    imageId: 1,
    flavorId: 1,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
WithoutDescription.parameters = {
  docs: {
    description: {
      story: "설명이 입력되지 않은 경우의 표시입니다.",
    },
  },
};

// Small 플레이버
export const SmallFlavor = Template.bind({});
SmallFlavor.args = {
  formData: {
    name: "development-server",
    description: "Development and testing server",
    imageId: 2,
    flavorId: 1,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
SmallFlavor.parameters = {
  docs: {
    description: {
      story: "Small 플레이버가 선택된 VM의 검토 화면입니다.",
    },
  },
};

// Large 플레이버
export const LargeFlavor = Template.bind({});
LargeFlavor.args = {
  formData: {
    name: "enterprise-database",
    description: "High-performance database server for enterprise applications",
    imageId: 3,
    flavorId: 3,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
LargeFlavor.parameters = {
  docs: {
    description: {
      story: "Large 플레이버가 선택된 고성능 VM의 검토 화면입니다.",
    },
  },
};

// 로딩 상태 - VM 생성 중
export const Creating = Template.bind({});
Creating.args = {
  formData: {
    name: "loading-test-vm",
    description: "Testing VM creation process",
    imageId: 1,
    flavorId: 2,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: true,
};
Creating.parameters = {
  docs: {
    description: {
      story: "VM 생성 요청을 처리 중인 로딩 상태입니다.",
    },
  },
};

// 긴 이름과 설명
export const LongContent = Template.bind({});
LongContent.args = {
  formData: {
    name: "very-long-vm-name-for-comprehensive-testing-of-ui-components-and-layout-handling",
    description:
      "This is an extremely long description that tests how the review component handles extensive text content. It should wrap properly and maintain good readability even when users provide detailed descriptions of their virtual machine instances and their intended use cases.",
    imageId: 1,
    flavorId: 3,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
LongContent.parameters = {
  docs: {
    description: {
      story: "긴 이름과 설명이 입력된 경우의 UI 처리를 확인할 수 있습니다.",
    },
  },
};

// 다양한 이미지 선택
export const DifferentImages = Template.bind({});
DifferentImages.args = {
  formData: {
    name: "windows-server",
    description: "Windows-based application server",
    imageId: 4,
    flavorId: 2,
  },
  images: MOCK_IMAGES,
  flavors: MOCK_FLAVORS,
  loading: false,
};
DifferentImages.parameters = {
  docs: {
    description: {
      story: "Windows Server 이미지가 선택된 VM의 검토 화면입니다.",
    },
  },
};

// 커스텀 구성
export const CustomConfiguration = Template.bind({});
CustomConfiguration.args = {
  formData: {
    name: "ml-training-node",
    description: "Machine learning model training node with GPU acceleration",
    imageId: 1,
    flavorId: 3,
  },
  images: [
    ...MOCK_IMAGES,
    {
      id: 10,
      name: "Deep Learning AMI",
      description: "Pre-configured environment for machine learning workloads",
    },
  ],
  flavors: [
    ...MOCK_FLAVORS,
    {
      id: 10,
      name: "GPU-Optimized",
      description: "High-performance instance with GPU acceleration",
      vcpu: 8,
      memory: 32768,
      rootDisk: 100,
    },
  ],
  loading: false,
};
CustomConfiguration.parameters = {
  docs: {
    description: {
      story: "특수 목적의 커스텀 구성을 가진 VM의 검토 화면입니다.",
    },
  },
};

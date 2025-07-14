// @ts-nocheck
import ImageSelectStep from "@/components/vm/steps/ImageSelectStep.vue";
import { MOCK_IMAGES } from "@/types/const/image";

export default {
  title: "Components/VM/Steps/ImageSelectStep",
  component: ImageSelectStep,
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
        component: "VM 생성의 두 번째 단계인 이미지 선택 컴포넌트입니다.",
      },
    },
  },
};

const Template = (args: any) => ({
  components: { ImageSelectStep },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 24px; background-color: #f5f5f5; min-height: 500px;">
      <ImageSelectStep v-bind="args" />
    </div>
  `,
});

// 기본 상태 - 이미지 선택 안됨
export const Default = Template.bind({});
Default.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: null,
    flavorId: null,
  },
  images: MOCK_IMAGES,
  loading: false,
};
Default.parameters = {
  docs: {
    description: {
      story:
        "이미지가 선택되지 않은 기본 상태입니다. 사용자는 테이블에서 이미지를 선택할 수 있습니다.",
    },
  },
};

// 이미지 선택된 상태
export const WithSelectedImage = Template.bind({});
WithSelectedImage.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 1,
    flavorId: null,
  },
  images: MOCK_IMAGES,
  loading: false,
};
WithSelectedImage.parameters = {
  docs: {
    description: {
      story:
        "첫 번째 이미지가 선택된 상태입니다. 선택된 행이 하이라이트되고 다음 버튼이 활성화됩니다.",
    },
  },
};

// 로딩 상태
export const Loading = Template.bind({});
Loading.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: 2,
    flavorId: null,
  },
  images: MOCK_IMAGES,
  loading: true,
};
Loading.parameters = {
  docs: {
    description: {
      story: "다음 단계로 이동 중인 로딩 상태입니다.",
    },
  },
};

// 빈 이미지 목록
export const EmptyImages = Template.bind({});
EmptyImages.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: null,
    flavorId: null,
  },
  images: [],
  loading: false,
};
EmptyImages.parameters = {
  docs: {
    description: {
      story: "사용 가능한 이미지가 없는 상태입니다.",
    },
  },
};

// 많은 이미지 목록
export const ManyImages = Template.bind({});
ManyImages.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: null,
    flavorId: null,
  },
  images: [
    ...MOCK_IMAGES,
    { id: 10, name: "Debian 11", description: "Debian GNU/Linux 11" },
    { id: 11, name: "Fedora 37", description: "Fedora Linux 37" },
    { id: 12, name: "openSUSE Leap 15.4", description: "openSUSE Leap 15.4" },
    { id: 13, name: "Alpine Linux 3.17", description: "Alpine Linux 3.17" },
    { id: 14, name: "Arch Linux", description: "Arch Linux Rolling Release" },
    { id: 15, name: "Rocky Linux 9", description: "Rocky Linux 9.1" },
  ],
  loading: false,
};
ManyImages.parameters = {
  docs: {
    description: {
      story: "많은 이미지 옵션이 있을 때의 테이블 표시입니다.",
    },
  },
};

// 긴 이름의 이미지들
export const LongImageNames = Template.bind({});
LongImageNames.args = {
  formData: {
    name: "test-vm",
    description: "test description",
    imageId: null,
    flavorId: null,
  },
  images: [
    {
      id: 1,
      name: "Ubuntu Server 22.04.2 LTS with Docker and Kubernetes Pre-installed",
      description:
        "A comprehensive Ubuntu server image with pre-configured development tools",
    },
    {
      id: 2,
      name: "Windows Server 2022 Datacenter Edition with IIS and SQL Server Express",
      description:
        "Enterprise-ready Windows server with web server and database capabilities",
    },
    {
      id: 3,
      name: "CentOS Stream 9 Minimal Installation with Security Hardening",
      description:
        "Minimal CentOS installation optimized for security and performance",
    },
  ],
  loading: false,
};
LongImageNames.parameters = {
  docs: {
    description: {
      story: "긴 이름과 설명을 가진 이미지들의 표시 방식을 확인할 수 있습니다.",
    },
  },
};

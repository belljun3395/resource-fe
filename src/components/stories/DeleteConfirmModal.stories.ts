// @ts-nocheck
import { DeleteConfirmModal } from "@/components/vm";

export default {
  title: "Components/VM/DeleteConfirmModal",
  component: DeleteConfirmModal,
  argTypes: {
    open: {
      control: "boolean",
      description: "모달 표시 여부",
    },
    instanceName: {
      control: "text",
      description: "삭제할 인스턴스 이름",
    },
    loading: {
      control: "boolean",
      description: "삭제 진행 중 로딩 상태",
    },
  },
};

const Template = (args: any) => ({
  components: { DeleteConfirmModal },
  setup() {
    const handleConfirm = () => {
      console.log("confirm clicked");
    };
    const handleCancel = () => {
      console.log("cancel clicked");
    };
    const handleUpdateOpen = (value: boolean) => {
      console.log("update:open", value);
    };

    return {
      args,
      handleConfirm,
      handleCancel,
      handleUpdateOpen,
    };
  },
  template: `
    <div>
      <DeleteConfirmModal 
        v-bind="args"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        @update:open="handleUpdateOpen"
      />
    </div>
  `,
});

// 기본 삭제 확인 모달
export const Default = Template.bind({});
Default.args = {
  open: true,
  instanceName: "production-web-server",
  loading: false,
};

// 로딩 상태인 모달
export const Loading = Template.bind({});
Loading.args = {
  open: true,
  instanceName: "production-web-server",
  loading: true,
};

// 긴 인스턴스 이름
export const LongInstanceName = Template.bind({});
LongInstanceName.args = {
  open: true,
  instanceName:
    "very-long-instance-name-for-testing-ui-components-with-extensive-data",
  loading: false,
};

// 닫힌 상태 (테스트용)
export const Closed = Template.bind({});
Closed.args = {
  open: false,
  instanceName: "production-web-server",
  loading: false,
};

// 다양한 인스턴스 이름들
export const DatabaseInstance = Template.bind({});
DatabaseInstance.args = {
  open: true,
  instanceName: "staging-database-001",
  loading: false,
};

export const ApiServer = Template.bind({});
ApiServer.args = {
  open: true,
  instanceName: "api-server-production",
  loading: false,
};

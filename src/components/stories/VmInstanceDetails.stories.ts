// @ts-nocheck
import { VmInstanceDetails } from "@/components/vm";
import { VmInstance } from "@/types/vm";

export default {
  title: "Components/VM/VmInstanceDetails",
  component: VmInstanceDetails,
};

const Template = (args: any) => ({
  components: { VmInstanceDetails },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px; background-color: #f5f5f5;">
      <VmInstanceDetails v-bind="args" />
    </div>
  `,
});

// 기본 실행중인 인스턴스
export const Default = Template.bind({});
Default.args = {
  instanceDetails: new VmInstance({
    name: "production-web-server",
    id: "3d51d0be-8776-4021-adbd-4bbc92999186",
    powerState: "RUNNING",
    alias: "web-server-001",
    host: "192.168.1.100",
  }),
};

// 정지된 인스턴스
export const Stopped = Template.bind({});
Stopped.args = {
  instanceDetails: new VmInstance({
    name: "development-api-server",
    id: "7f82a9c3-1234-5678-9abc-def012345678",
    powerState: "SHUTDOWN",
    alias: "api-dev-002",
    host: "192.168.1.101",
  }),
};

// 일시정지된 인스턴스
export const Paused = Template.bind({});
Paused.args = {
  instanceDetails: new VmInstance({
    name: "staging-database",
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    powerState: "PAUSED",
    alias: "db-staging-003",
    host: "192.168.1.102",
  }),
};

// 긴 이름과 ID를 가진 인스턴스
export const LongData = Template.bind({});
LongData.args = {
  instanceDetails: new VmInstance({
    name: "very-long-instance-name-for-testing-ui-components-with-extensive-data",
    id: "extremely-long-instance-id-that-might-cause-ui-overflow-issues-in-production-environments",
    powerState: "RUNNING",
    alias: "very-long-alias-name-for-testing-purposes",
    host: "very-long-hostname.example.com",
  }),
};

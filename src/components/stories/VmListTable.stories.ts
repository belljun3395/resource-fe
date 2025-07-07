// @ts-nocheck
import VmListTable from "@/components/vm/VmListTable.vue";
import { VmInstanceList } from "@/types/vm";
import type { VmInstanceListData, VmFlavor, VmSource } from "@/types/vm";

export default {
  title: "Components/VM/VmListTable",
  component: VmListTable,
  argTypes: {
    loading: {
      control: "boolean",
    },
  },
};

const Template = (args: any) => ({
  components: { VmListTable },
  setup() {
    return { args };
  },
  template: `
    <div style="padding: 20px; background-color: #f5f5f5;">
      <VmListTable v-bind="args" />
    </div>
  `,
});

// 공통 Mock 데이터
const mockFlavor: VmFlavor = {
  id: 1,
  name: "m1.small",
  description: "Small instance with 1 vCPU and 2GB RAM",
  memory: 2048,
  vcpu: 1,
  rootDisk: 20,
};

const mockSource: VmSource = {
  type: "image",
  id: 1,
  name: "Ubuntu 22.04 LTS",
};

const createMockVmInstance = (
  overrides: Partial<VmInstanceListData> = {}
): VmInstanceList => {
  const defaultData: VmInstanceListData = {
    name: "default-vm",
    id: "vm-default",
    powerState: "RUNNING",
    alias: "default-alias",
    host: "host.example.com",
    description: "Default VM instance",
    source: mockSource,
    flavor: mockFlavor,
    ...overrides,
  };
  return new VmInstanceList(defaultData);
};

// 기본 VM 목록 (다양한 상태)
export const Default = Template.bind({});
Default.args = {
  dataSource: [
    createMockVmInstance({
      name: "production-web-server",
      id: "3d51d0be-8776-4021-adbd-4bbc92999186",
      powerState: "RUNNING",
      alias: "web-server-001",
      host: "192.168.1.100",
      description: "Production web server handling main traffic",
    }),
    createMockVmInstance({
      name: "development-api-server",
      id: "7f82a9c3-1234-5678-9abc-def012345678",
      powerState: "SHUTDOWN",
      alias: "api-dev-002",
      host: "192.168.1.101",
      description: "Development API server for testing",
    }),
    createMockVmInstance({
      name: "staging-database",
      id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
      powerState: "PAUSED",
      alias: "db-staging-003",
      host: "192.168.1.102",
      description: "Staging database server",
    }),
    createMockVmInstance({
      name: "monitoring-server",
      id: "b2c3d4e5-f6g7-8901-2345-678901bcdefg",
      powerState: "SUSPENDED",
      alias: "monitor-004",
      host: "192.168.1.103",
      description: "System monitoring and alerting server",
    }),
  ],
  loading: false,
};

// 로딩 상태
export const Loading = Template.bind({});
Loading.args = {
  dataSource: [
    createMockVmInstance({
      name: "loading-vm",
      id: "loading-vm-id",
      powerState: "RUNNING",
      alias: "loading-alias",
      host: "loading.example.com",
      description: "Loading state example",
    }),
  ],
  loading: true,
};

// 빈 목록
export const Empty = Template.bind({});
Empty.args = {
  dataSource: [],
  loading: false,
};

// 대량 데이터 (성능 테스트용)
export const LargeDataset = Template.bind({});
LargeDataset.args = {
  dataSource: Array.from({ length: 50 }, (_, index) =>
    createMockVmInstance({
      name: `vm-instance-${index + 1}`,
      id: `vm-${String(index + 1).padStart(3, "0")}`,
      powerState: ["RUNNING", "PAUSED", "SHUTDOWN", "SUSPENDED"][
        index % 4
      ] as any,
      alias: `alias-${index + 1}`,
      host: `host-${index + 1}.example.com`,
      description: `Automatically generated VM instance ${
        index + 1
      } for testing large datasets`,
    })
  ),
  loading: false,
};

// 긴 데이터 (UI 오버플로우 테스트)
export const LongData = Template.bind({});
LongData.args = {
  dataSource: [
    createMockVmInstance({
      name: "extremely-long-vm-instance-name-that-might-cause-ui-overflow-issues-in-production-environments",
      id: "extremely-long-instance-id-that-might-cause-ui-overflow-issues-in-production-environments-with-very-long-identifiers",
      powerState: "RUNNING",
      alias:
        "extremely-long-alias-name-for-testing-ui-component-responsiveness-and-overflow-handling",
      host: "extremely-long-hostname.example.com",
      description:
        "This is an extremely long description that tests how the UI handles overflow and text wrapping in table cells with extensive content that might span multiple lines",
    }),
  ],
  loading: false,
};

// 다양한 플레이버 타입
export const DifferentFlavors = Template.bind({});
DifferentFlavors.args = {
  dataSource: [
    createMockVmInstance({
      name: "small-instance",
      id: "small-vm-001",
      powerState: "RUNNING",
      alias: "small-001",
      host: "small.example.com",
      description: "Small instance for light workloads",
      flavor: {
        ...mockFlavor,
        name: "t2.micro",
        description: "Micro instance with 1 vCPU and 1GB RAM",
        memory: 1024,
      },
    }),
    createMockVmInstance({
      name: "medium-instance",
      id: "medium-vm-002",
      powerState: "RUNNING",
      alias: "medium-002",
      host: "medium.example.com",
      description: "Medium instance for moderate workloads",
      flavor: {
        ...mockFlavor,
        name: "t2.medium",
        description: "Medium instance with 2 vCPUs and 4GB RAM",
        memory: 4096,
        vcpu: 2,
      },
    }),
    createMockVmInstance({
      name: "large-instance",
      id: "large-vm-003",
      powerState: "RUNNING",
      alias: "large-003",
      host: "large.example.com",
      description: "Large instance for heavy workloads",
      flavor: {
        ...mockFlavor,
        name: "t2.large",
        description: "Large instance with 4 vCPUs and 8GB RAM",
        memory: 8192,
        vcpu: 4,
      },
    }),
  ],
  loading: false,
};

// 다양한 소스 타입
export const DifferentSources = Template.bind({});
DifferentSources.args = {
  dataSource: [
    createMockVmInstance({
      name: "ubuntu-vm",
      id: "ubuntu-vm-001",
      powerState: "RUNNING",
      alias: "ubuntu-001",
      host: "ubuntu.example.com",
      description: "Ubuntu based virtual machine",
      source: {
        type: "image",
        id: 1,
        name: "Ubuntu 22.04 LTS",
      },
    }),
    createMockVmInstance({
      name: "centos-vm",
      id: "centos-vm-002",
      powerState: "RUNNING",
      alias: "centos-002",
      host: "centos.example.com",
      description: "CentOS based virtual machine",
      source: {
        type: "image",
        id: 2,
        name: "CentOS 8 Stream",
      },
    }),
    createMockVmInstance({
      name: "windows-vm",
      id: "windows-vm-003",
      powerState: "RUNNING",
      alias: "windows-003",
      host: "windows.example.com",
      description: "Windows based virtual machine",
      source: {
        type: "image",
        id: 3,
        name: "Windows Server 2022",
      },
    }),
  ],
  loading: false,
};

// 모든 전원 상태 표시
export const AllPowerStates = Template.bind({});
AllPowerStates.args = {
  dataSource: [
    createMockVmInstance({
      name: "running-vm",
      id: "running-vm-001",
      powerState: "RUNNING",
      alias: "running-001",
      host: "running.example.com",
      description: "VM in running state",
    }),
    createMockVmInstance({
      name: "paused-vm",
      id: "paused-vm-002",
      powerState: "PAUSED",
      alias: "paused-002",
      host: "paused.example.com",
      description: "VM in paused state",
    }),
    createMockVmInstance({
      name: "shutdown-vm",
      id: "shutdown-vm-003",
      powerState: "SHUTDOWN",
      alias: "shutdown-003",
      host: "shutdown.example.com",
      description: "VM in shutdown state",
    }),
    createMockVmInstance({
      name: "suspended-vm",
      id: "suspended-vm-004",
      powerState: "SUSPENDED",
      alias: "suspended-004",
      host: "suspended.example.com",
      description: "VM in suspended state",
    }),
    createMockVmInstance({
      name: "crashed-vm",
      id: "crashed-vm-005",
      powerState: "CRASHED",
      alias: "crashed-005",
      host: "crashed.example.com",
      description: "VM in crashed state",
    }),
    createMockVmInstance({
      name: "nostate-vm",
      id: "nostate-vm-006",
      powerState: "NOSTATE",
      alias: "nostate-006",
      host: "nostate.example.com",
      description: "VM in no state",
    }),
  ],
  loading: false,
};

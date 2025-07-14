import type {
  VmInstanceApiResponse,
  VmInstanceCreateRequest,
} from "@/api/vm/dto";
import type { PowerStatusString } from "@/types/vm";

// Mock 데이터 생성 함수
const createMockVmInstance = (
  instanceId: string | number
): VmInstanceApiResponse => {
  const mockInstances: Record<string, VmInstanceApiResponse> = {
    "1": {
      id: 1,
      name: "production-web-server",
      description: "Production web server for main application",
      alias: "web-prod-001",
      powerStatus: "RUNNING" as PowerStatusString,
      host: "prod-host-01.company.com",
      source: {
        type: "image",
        id: 101,
        name: "ubuntu-22.04-lts",
      },
      flavor: {
        id: 201,
        name: "standard-4",
        description: "4 vCPU, 8GB RAM, 80GB Disk",
        memory: 8192,
        rootDisk: 80,
        vcpu: 4,
      },
      createdAt: "2023-01-15T09:30:00.000Z",
    },
    "2": {
      id: 2,
      name: "development-api-server",
      description: "Development API server for testing",
      alias: "api-dev-002",
      powerStatus: "SHUTDOWN" as PowerStatusString,
      host: "dev-host-02.company.com",
      source: {
        type: "image",
        id: 102,
        name: "centos-8-stream",
      },
      flavor: {
        id: 202,
        name: "small-2",
        description: "2 vCPU, 4GB RAM, 40GB Disk",
        memory: 4096,
        rootDisk: 40,
        vcpu: 2,
      },
      createdAt: "2023-02-20T14:15:00.000Z",
    },
    "3": {
      id: 3,
      name: "staging-database",
      description: "Staging database server",
      alias: "db-staging-003",
      powerStatus: "PAUSED" as PowerStatusString,
      host: "staging-host-03.company.com",
      source: {
        type: "image",
        id: 103,
        name: "postgresql-14",
      },
      flavor: {
        id: 203,
        name: "large-8",
        description: "8 vCPU, 16GB RAM, 200GB Disk",
        memory: 16384,
        rootDisk: 200,
        vcpu: 8,
      },
      createdAt: "2023-03-10T11:45:00.000Z",
    },
  };

  return (
    mockInstances[instanceId.toString()] || {
      id: Number(instanceId),
      name: `vm-instance-${instanceId}`,
      description: `Mock VM instance ${instanceId}`,
      alias: `vm-${instanceId}`,
      powerStatus: "RUNNING" as PowerStatusString,
      host: `host-${instanceId}.example.com`,
      source: {
        type: "image",
        id: 100,
        name: "default-image",
      },
      flavor: {
        id: 200,
        name: "standard-2",
        description: "2 vCPU, 4GB RAM, 40GB Disk",
        memory: 4096,
        rootDisk: 40,
        vcpu: 2,
      },
      createdAt: new Date().toISOString(),
    }
  );
};

// Mock API 응답 시뮬레이션
const mockGetInstance = async (
  instanceId: string | number
): Promise<VmInstanceApiResponse> => {
  // 실제 API 호출과 유사한 지연 시간 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  console.log(`🔧 [Mock] Fetching VM instance: ${instanceId}`);
  return createMockVmInstance(instanceId);
};

const mockDeleteInstance = async (
  instanceId: string | number
): Promise<VmDeleteApiResponse> => {
  // 실제 API 호출과 유사한 지연 시간 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1500)
  );

  console.log(`🔧 [Mock] Deleting VM instance: ${instanceId}`);
  return {
    instanceId: Number(instanceId),
    isAccepted: true,
    isDeleted: true,
// Mock 인스턴스 생성 API
const mockCreateInstance = async (
  data: VmInstanceCreateRequest
): Promise<VmInstanceApiResponse> => {
  // 실제 API 호출과 유사한 지연 시간 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  console.log(`🔧 [Mock] Creating VM instance:`, data);

  const newInstanceId = Date.now();
  return createMockVmInstance(newInstanceId);
const mockUpdatePowerStatus = async (
  instanceId: string | number,
  powerStatusAction: string
): Promise<any> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 1000)
  );

  console.log(
    `🔧 [Mock] Updating power status for VM ${instanceId} with action: ${powerStatusAction}`
  );

  const statusMap: Record<string, string> = {
    "0": "RUNNING", // START
    "1": "SHUTDOWN", // SHUTDOWN
    "2": "RUNNING", // REBOOT (결과적으로 RUNNING)
    "3": "PAUSED", // PAUSE
  };

  return {
    id: instanceId,
    name: `vm-instance-${instanceId}`,
    description: `Power status updated with action: ${powerStatusAction}`,
    alias: `vm-${instanceId}`,
    powerStatus: statusMap[powerStatusAction] || "NOSTATE",
    host: `host-${instanceId}.example.com`,
    message: `Power status action '${powerStatusAction}' applied successfully`,
    code: "200",
  };
};

export const vmApiMock = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceApiResponse> {
    return mockGetInstance(instanceId);
  },
  async deleteInstance(
    instanceId: string | number
  ): Promise<VmDeleteApiResponse> {
    return mockDeleteInstance(instanceId);
  async createInstance(
    data: VmInstanceCreateRequest
  ): Promise<VmInstanceApiResponse> {
    return mockCreateInstance(data);
  async updatePowerStatus(
    instanceId: string | number,
    powerStatusAction: string
  ): Promise<any> {
    return mockUpdatePowerStatus(instanceId, powerStatusAction);
  },
};

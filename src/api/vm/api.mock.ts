import type {
  VmInstanceDetailApiResponse,
  VmInstanceListApiResponse,
  VmListApiResponse,
  VmListRequest,
  VmInstanceCreateRequest,
  PowerStatusUpdateResponse,
  VmDeleteApiResponse,
} from "@/api/vm/dto";
import type { PowerStatusString } from "@/types/vm";

// Mock 데이터 생성 함수 (단일 조회용)
const createMockVmInstanceDetail = (
  instanceId: string | number
): VmInstanceDetailApiResponse => {
  const mockInstances: Record<string, VmInstanceDetailApiResponse> = {
    "1": {
      id: 1,
      name: "production-web-server",
      alias: "web-prod-001",
      powerStatus: "RUNNING" as PowerStatusString,
      host: "prod-host-01.company.com",
    },
    "2": {
      id: 2,
      name: "development-api-server",
      alias: "api-dev-002",
      powerStatus: "SHUTDOWN" as PowerStatusString,
      host: "dev-host-02.company.com",
    },
    "3": {
      id: 3,
      name: "staging-database",
      alias: "db-staging-003",
      powerStatus: "PAUSED" as PowerStatusString,
      host: "staging-host-03.company.com",
    },
  };

  return (
    mockInstances[instanceId.toString()] || {
      id: Number(instanceId),
      name: `vm-instance-${instanceId}`,
      alias: `vm-${instanceId}`,
      powerStatus: "RUNNING" as PowerStatusString,
      host: `host-${instanceId}.example.com`,
    }
  );
};

// Mock API 응답 시뮬레이션 (단일 조회용)
const mockGetInstance = async (
  instanceId: string | number
): Promise<VmInstanceDetailApiResponse> => {
  // 실제 API 호출과 유사한 지연 시간 시뮬레이션
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  console.log(`🔧 [Mock] Fetching VM instance: ${instanceId}`);
  return createMockVmInstanceDetail(instanceId);
};

const createMockVmInstanceList = (
  count: number
): VmInstanceListApiResponse[] => {
  const statuses: PowerStatusString[] = [
    "RUNNING",
    "PAUSED",
    "SHUTDOWN",
    "CRASHED",
    "NOSTATE",
    "SUSPENDED",
  ];
  const hosts = [
    "192.168.0.1",
    "192.168.0.2",
    "192.168.0.3",
    "192.168.0.4",
    "192.168.0.5",
    "192.168.0.6",
    "192.168.0.7",
    "192.168.0.8",
    "192.168.0.9",
    "192.168.0.10",
    "192.168.0.11",
    "192.168.0.12",
    "192.168.0.13",
    "192.168.0.14",
    "192.168.0.15",
  ];
  const flavors = [
    {
      id: 5,
      name: "flavor_5",
      description: "description_5",
      memory: 5120,
      rootDisk: 50,
      vcpu: 3.5,
    },
    {
      id: 4,
      name: "flavor_4",
      description: "description_4",
      memory: 4096,
      rootDisk: 40,
      vcpu: 3,
    },
    {
      id: 3,
      name: "flavor_3",
      description: "description_3",
      memory: 3072,
      rootDisk: 30,
      vcpu: 2.5,
    },
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 3,
    name: `instance_${i + 3}`,
    description: "description",
    alias: `alias_${i + 3}`,
    powerStatus: statuses[i % statuses.length],
    host: hosts[i % hosts.length],
    source: {
      type: "IMAGE",
      id: i + 3,
      name: `image_${i + 3}`,
    },
    flavor: flavors[i % flavors.length],
  }));
};

const mockGetInstanceList = async (
  params: VmListRequest
): Promise<VmListApiResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 300 + Math.random() * 700)
  );

  console.log(`🔧 [Mock] Fetching VM instance list:`, params);

  const allInstances = createMockVmInstanceList(15);
  let filteredInstances = allInstances;

  const startIndex = params.page * params.size;
  const endIndex = startIndex + params.size;
  const paginatedInstances = filteredInstances.slice(startIndex, endIndex);

  return {
    pageSize: params.size,
    pageNumber: params.page,
    totalPageCount: Math.ceil(filteredInstances.length / params.size),
    totalCount: filteredInstances.length,
    data: paginatedInstances,
  };
};

const mockCreateInstance = async (
  params: VmInstanceCreateRequest
): Promise<VmInstanceListApiResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 1000 + Math.random() * 2000)
  );

  console.log(`🔧 [Mock] Creating VM instance:`, params);

  const newId = Math.floor(Math.random() * 10000) + 1000;
  return {
    id: newId,
    name: params.name,
    description: params.description || "",
    alias: `vm-${newId}`,
    powerStatus: "RUNNING" as PowerStatusString,
    host: `host-${Math.floor(Math.random() * 100)}.example.com`,
    source: {
      type: "IMAGE",
      id: params.imageId,
      name: `image_${params.imageId}`,
    },
    flavor: {
      id: params.flavorId,
      name: `flavor_${params.flavorId}`,
      description: `description_${params.flavorId}`,
      memory: 4096,
      rootDisk: 40,
      vcpu: 2,
    },
  };
};

const mockDeleteInstance = async (
  instanceId: string | number
): Promise<VmDeleteApiResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 800 + Math.random() * 1200)
  );

  console.log(`🔧 [Mock] Deleting VM instance: ${instanceId}`);

  return {
    instanceId: Number(instanceId),
    isAccepted: true,
    isDeleted: true,
  };
};

const mockUpdatePowerStatus = async (
  instanceId: string | number,
  actionCode: string
): Promise<PowerStatusUpdateResponse> => {
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 1000)
  );

  console.log(
    `🔧 [Mock] Updating power status for instance ${instanceId} with action ${actionCode}`
  );

  const powerStatusMap: Record<string, PowerStatusString> = {
    "0": "RUNNING",
    "1": "SHUTDOWN",
    "2": "RUNNING",
    "3": "PAUSED",
  };

  return {
    success: true,
    message: "Power status updated successfully",
    instanceId,
    newPowerStatus: powerStatusMap[actionCode] || "RUNNING",
  };
};

export const vmApiMock = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceDetailApiResponse> {
    return mockGetInstance(instanceId);
  },

  async getInstanceList(params: VmListRequest): Promise<VmListApiResponse> {
    console.log("🔧 [Mock] Fetching VM instance list:", params);
    return mockGetInstanceList(params);
  },

  async createInstance(
    params: VmInstanceCreateRequest
  ): Promise<VmInstanceListApiResponse> {
    return mockCreateInstance(params);
  },

  async deleteInstance(
    instanceId: string | number
  ): Promise<VmDeleteApiResponse> {
    return mockDeleteInstance(instanceId);
  },

  async updatePowerStatus(
    instanceId: string | number,
    actionCode: string
  ): Promise<PowerStatusUpdateResponse> {
    return mockUpdatePowerStatus(instanceId, actionCode);
  },
};

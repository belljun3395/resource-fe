import { instance } from "@/api/common";
import type { ApiResponse } from "@/api/common";
import type {
  VmInstanceDetailApiResponse,
  VmListApiResponse,
  VmListRequest,
  VmInstanceCreateRequest,
  VmInstanceListApiResponse,
  PowerStatusUpdateResponse,
  VmDeleteApiResponse,
} from "@/api/vm/dto";

export const vmApi = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceDetailApiResponse> {
    const response = await instance.get<
      ApiResponse<VmInstanceDetailApiResponse>
    >(`/api/v1/servers/instances/${instanceId}`);
    return response.data.data;
  },

  async getInstanceList(params: VmListRequest): Promise<VmListApiResponse> {
    const response = await instance.get<VmListApiResponse>(
      "/api/v1/servers/instances",
      {
        params: {
          page: params.page,
          size: params.size,
        },
      }
    );
    return response.data;
  },

  async createInstance(
    params: VmInstanceCreateRequest
  ): Promise<VmInstanceListApiResponse> {
    const response = await instance.post<
      ApiResponse<VmInstanceListApiResponse>
    >("/api/v1/servers/instances", params);
    return response.data.data;
  },

  async deleteInstance(
    instanceId: string | number
  ): Promise<VmDeleteApiResponse> {
    const response = await instance.delete<ApiResponse<VmDeleteApiResponse>>(
      `/api/v1/servers/instances`,
      {
        data: {
          instanceId: instanceId
        }
      }
    );
    return response.data.data;
  },

  async updatePowerStatus(
    instanceId: string | number,
    actionCode: string
  ): Promise<PowerStatusUpdateResponse> {
    const response = await instance.put<
      ApiResponse<PowerStatusUpdateResponse>
    >(`/api/v1/servers/instances/power`, {
      instanceId: instanceId,
      powerStatusAction: actionCode,
    });
    return response.data.data;
  },
};

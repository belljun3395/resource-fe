import { instance } from "@/api/common";
import type { ApiResponse } from "@/api/common";
import type {
  VmInstanceApiResponse,
  VmInstanceCreateRequest,
} from "@/api/vm/dto";

export const vmApi = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceApiResponse> {
    const response = await instance.get<ApiResponse<VmInstanceApiResponse>>(
      `/api/v1/servers/instances/${instanceId}`
    );
    return response.data.data;
  },

  async createInstance(
    data: VmInstanceCreateRequest
  ): Promise<VmInstanceApiResponse> {
    const response = await instance.post<ApiResponse<VmInstanceApiResponse>>(
      `/api/v1/servers/instances`,
      {
        name: data.name,
        description: data.description,
        host: "192.168.1.1",
        flavorId: data.flavorId,
        sourceType: "IMAGE",
        sourceId: data.imageId,
      }
    );
    return response.data.data;
  },
};

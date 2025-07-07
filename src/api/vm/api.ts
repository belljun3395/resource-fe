import { instance } from "@/api/common";
import type { ApiResponse } from "@/api/common";
import type {
  VmInstanceDetailApiResponse,
  VmListApiResponse,
  VmListRequest,
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
};

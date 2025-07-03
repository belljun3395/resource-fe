import { instance } from "@/api/common";
import type { ApiResponse } from "@/api/common";
import type { VmInstanceApiResponse } from "@/api/vm/dto";

export const vmApi = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceApiResponse> {
    const response = await instance.get<ApiResponse<VmInstanceApiResponse>>(
      `/api/v1/servers/instances/${instanceId}`
    );
    return response.data.data;
  },
};

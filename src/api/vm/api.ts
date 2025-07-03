import { instance } from "@/api/common";
import type { ApiResponse } from "@/api/common";
import type {
  VmInstanceApiResponse,
  PowerStatusUpdateResponse,
} from "@/api/vm/dto";
import type { PowerActionCode } from "@/types/vm";

export const vmApi = {
  async getInstance(
    instanceId: string | number
  ): Promise<VmInstanceApiResponse> {
    const response = await instance.get<ApiResponse<VmInstanceApiResponse>>(
      `/api/v1/servers/instances/${instanceId}`
    );
    return response.data.data;
  },
  async updatePowerStatus(
    instanceId: string | number,
    powerStatusAction: PowerActionCode
  ): Promise<PowerStatusUpdateResponse> {
    const response = await instance.put<ApiResponse<PowerStatusUpdateResponse>>(
      `/api/v1/servers/instances/power`,
      {
        instanceId,
        powerStatusAction,
      }
    );
    return response.data.data;
  },
};

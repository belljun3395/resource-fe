import type { PowerStatusString } from "@/types/vm";

export interface VmSource {
  type: string;
  id: number;
  name: string;
}

export interface VmFlavor {
  id: number;
  name: string;
  description: string;
  memory: number;
  rootDisk: number;
  vcpu: number;
}

export interface VmInstanceApiResponse {
  id: number;
  name: string;
  description: string;
  alias: string;
  powerStatus: PowerStatusString;
  host: string;
  source: VmSource;
  flavor: VmFlavor;
}

export interface PowerStatusUpdateResponse {
  success: boolean;
  message?: string;
  instanceId: string | number;
  newPowerStatus?: PowerStatusString;
}

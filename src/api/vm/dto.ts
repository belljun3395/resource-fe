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

export interface VmInstanceCreateRequest {
  name: string;
  description?: string;
  imageId: number;
  flavorId: number;
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
  createdAt: string;
}

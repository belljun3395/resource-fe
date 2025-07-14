import { FlavorSpec } from "@/types/flavor";

export const MOCK_FLAVORS: FlavorSpec[] = [
  {
    id: 1,
    name: "flavor_1",
    description: "description_1",
    vcpu: 1.5,
    memory: 1024,
    rootDisk: 10,
  },
  {
    id: 2,
    name: "flavor_2",
    description: "description_2",
    vcpu: 2,
    memory: 2048,
    rootDisk: 20,
  },
  {
    id: 3,
    name: "flavor_3",
    description: "description_3",
    vcpu: 2.5,
    memory: 3072,
    rootDisk: 30,
  },
  {
    id: 4,
    name: "flavor_4",
    description: "description_4",
    vcpu: 3,
    memory: 4096,
    rootDisk: 40,
  },
  {
    id: 5,
    name: "flavor_5",
    description: "description_5",
    vcpu: 3.5,
    memory: 5120,
    rootDisk: 50,
  },
];

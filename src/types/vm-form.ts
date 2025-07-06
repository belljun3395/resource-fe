export interface VmCreateFormData {
  name: string;
  description: string;
  imageId: number | null;
  flavorId: number | null;
}

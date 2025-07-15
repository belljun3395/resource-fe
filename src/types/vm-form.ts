export interface VmCreateFormData {
  name: string;
  description: string;
  host: string;
  flavorId: number | null;
  sourceType: string;
  sourceId: number | null;
}

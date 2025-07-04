export enum SourceType {
  IMAGE = 0,
  INSTANCE_SNAPSHOT = 1,
  BOOTABLE_VOLUME = 2,
  VOLUME_SNAPSHOT = 3,
}

export type SourceTypeString = keyof typeof SourceType;

export type SourceTypeCode = `${SourceType}`;

export const FileModeEnum = {
  local: 'local',
  s3: 's3',
} as const;

export type FileModeEnumType = (typeof FileModeEnum)[keyof typeof FileModeEnum];

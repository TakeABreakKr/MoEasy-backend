import { FileModeEnumType } from '@enums/file.mode.enum';

export interface CreateAttachmentDto {
  name: string;
  type: FileModeEnumType;
  path: string;
  deletedYn: boolean;
}

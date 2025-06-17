import { AuthorityEnumType } from '@enums/authority.enum';

export interface CreateMemberDto {
  meetingId: number;
  userId: number;
  authority?: AuthorityEnumType;
  applicationMessage?: string;
}

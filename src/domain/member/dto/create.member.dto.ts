import { AuthorityEnumType } from '@enums/authority.enum';

export interface CreateMemberDto {
  meetingId: number;
  usersId: number;
  authority?: AuthorityEnumType;
  applicationMessage?: string;
}

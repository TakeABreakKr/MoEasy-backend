import { AuthorityEnumType } from '@root/enums/authority.enum';

export interface CreateMemberDto {
  meetingId: number;
  usersId: number;
  authority?: AuthorityEnumType;
  applicationMessage?: string;
}

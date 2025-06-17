import { AuthorityEnumType } from '@enums/authority.enum';

export interface AuthorityComponent {
  validateAuthority(requesterId: number, meetingId: number, validAuthorities?: AuthorityEnumType[]): Promise<void>;
}

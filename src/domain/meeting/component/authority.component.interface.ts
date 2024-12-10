import { AuthorityEnumType } from '@enums/authority.enum';

export interface AuthorityComponent{
    validateAuthority(
        requester_id: number,
        meetingId: number,
        validAuthorities?: AuthorityEnumType[],
      ): Promise<void>;
}
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityComponentImpl } from '@domain/member/component/authority.component';
import { MemberComponentImpl } from '@domain/member/component/member.component';
import { Member } from '../member/entity/member.entity';
import { MemberDaoImpl } from '../member/dao/member.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [
    { provide: 'MemberDao', useClass: MemberDaoImpl },
    { provide: 'AuthorityComponent', useClass: AuthorityComponentImpl },
    { provide: 'MemberComponent', useClass: MemberComponentImpl },
  ],
  exports: ['MemberComponent', 'AuthorityComponent'],
})
export class MemberModule {}

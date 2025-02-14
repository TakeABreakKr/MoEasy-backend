import { Module } from '@nestjs/common';
import { HomeController } from '@service/home/controller/home.controller';
import { HomeServiceImpl } from '@service/home/service/home.service';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { CategoryModule } from '@domain/category/category.module';

@Module({
  imports: [MeetingModule, MemberModule, CategoryModule],
  controllers: [HomeController],
  providers: [{ provide: 'HomeService', useClass: HomeServiceImpl }],
})
export class HomeServiceModule {}

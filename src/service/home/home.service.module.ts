import { Module } from '@nestjs/common';
import { HomeController } from '@service/home/controller/home.controller';
import { HomeServiceImpl } from '@service/home/service/home.service';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { CategoryModule } from '@domain/category/category.module';
import { RegionModule } from '@domain/region/region.module';
import { ActivityModule } from '@domain/activity/activity.module';
import { UsersModule } from '@domain/user/users.module';

@Module({
  imports: [UsersModule, MeetingModule, MemberModule, CategoryModule, RegionModule, ActivityModule],
  controllers: [HomeController],
  providers: [{ provide: 'HomeService', useClass: HomeServiceImpl }],
})
export class HomeServiceModule {}

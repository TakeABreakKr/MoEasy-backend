import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationServiceImpl } from '@domain/notification/service/notification.service';
import { NotificationController } from '@domain/notification/controller/notification.controller';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { Member } from '@domain/meeting/entity/member.entity';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao';
import { Participant } from '@domain/schedule/entity/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Member, Participant])],
  exports: [NotificationComponent],
  providers: [
    NotificationDao,
    NotificationComponent,
    ParticipantDao,
    MemberDao,
    { provide: 'NotificationService', useClass: NotificationServiceImpl },
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { NotificationComponentImpl } from '@domain/notification/component/notification.component';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [
    { provide: 'NotificationDao', useClass: NotificationDaoImpl },
    { provide: 'NotificationComponent', useClass: NotificationComponentImpl },
  ],
  exports: ['NotificationComponent'],
})
export class NotificationModule {}

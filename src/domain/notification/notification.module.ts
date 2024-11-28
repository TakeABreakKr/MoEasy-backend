import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationServiceImpl } from '@domain/notification/service/notification.service';
import { NotificationController } from '@domain/notification/controller/notification.controller';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { NotificationComponent } from '@domain/notification/component/notification.component';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  exports: [NotificationComponent],
  providers: [
    { provide: 'NotificationDao', useClass: NotificationDaoImpl },
    NotificationComponent,
    { provide: 'NotificationService', useClass: NotificationServiceImpl },
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}

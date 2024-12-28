import { Module } from '@nestjs/common';
import { NotificationModule } from '@domain/notification/notification.module';
import { NotificationController } from '@service/notification/controller/notification.controller';
import { NotificationServiceImpl } from '@service/notification/service/notification.service';

@Module({
  imports: [NotificationModule],
  providers: [{ provide: 'NotificationService', useClass: NotificationServiceImpl }],
  controllers: [NotificationController],
})
export class NotificationServiceModule {}

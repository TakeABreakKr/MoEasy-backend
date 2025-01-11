import { Module } from '@nestjs/common';
import { HomeController } from '@service/home/controller/home.controller';
import { HomeServiceImpl } from '@service/home/service/home.service';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [{ provide: 'HomeService', useClass: HomeServiceImpl }],
})
export class HomeServiceModule {}

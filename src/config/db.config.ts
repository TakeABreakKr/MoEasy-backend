import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { envEnum } from '../enums/env.enum';

@Injectable()
export class DBConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {
  }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      username: this.configService.get('db.username'),
      password: this.configService.get('db.password'),
      database: this.configService.get('db.database'),
      autoLoadEntities: true,
      synchronize: this.configService.get('env') !== envEnum.PROD,
    };
  }
}

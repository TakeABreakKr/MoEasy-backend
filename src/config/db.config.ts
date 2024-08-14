import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvEnum } from '@enums/env.enum';

@Injectable()
export class DBConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get('env');
    return {
      type: 'mysql',
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      username: this.configService.get('db.username'),
      password: this.configService.get('db.password'),
      database: this.configService.get('db.database'),
      autoLoadEntities: true,
      synchronize: env !== EnvEnum.PROD,
      dropSchema: env == EnvEnum.DEV,
      logging: true,
    };
  }
}

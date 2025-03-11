import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { NecordModule } from 'necord';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import configuration from '@config/configuration';
import { DiscordConfig } from '@config/discord.config';
import { DBConfig } from '@config/db.config';
import { DomainModule } from '@domain/domain.module';
import { FileModule } from '@file/file.module';
import { ServiceModule } from '@service/service.module';
import { FileModeEnum } from '@enums/file.mode.enum';
import { AppController } from '@root/controller/app.controller';
import AuthGuard from '@root/middleware/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DBConfig,
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    JwtModule.register({
      global: true,
    }),
    NecordModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DiscordConfig,
    }),
    DomainModule,
    ServiceModule,
    FileModule.forRoot({
      fileMode: FileModeEnum.local,
    }),
  ],
  providers: [AuthGuard],
  controllers: [AppController],
})
export class AppModule {}

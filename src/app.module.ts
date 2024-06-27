import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DiscordModule } from '@discord-nestjs/core';
import { addTransactionalDataSource } from 'typeorm-transactional';

import configuration from './config/configuration';
import { DiscordConfig } from './config/discord.config';
import { DBConfig } from './config/db.config';

import { BotModule } from './bot/bot.module';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DiscordConfig,
    }),
    BotModule,
    DomainModule,
  ],
})
export class AppModule {}

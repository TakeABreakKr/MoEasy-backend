import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { EnvEnum, EnvEnumType } from './enums/env.enum';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);

  const env: EnvEnumType = configService.get('env');
  if (env !== EnvEnum.PROD) {
    setupSwagger(app);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = configService.get('port');
  await app.listen(port);
}

void bootstrap();

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { envEnum } from './enums/env.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const env = configService.get('env');
  if (env !== envEnum.PROD) {
    setupSwagger(app);
  }

  const port = configService.get('port');
  await app.listen(port);
}

void bootstrap();

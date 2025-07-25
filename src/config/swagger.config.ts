import { writeFileSync } from 'fs';
import * as path from 'path';
import type { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AuthGuard from '@root/middleware/auth/auth.guard';

export function setupSwagger(app: INestApplication) {
  const configService: ConfigService = app.get(ConfigService);
  const options = new DocumentBuilder()
    .setTitle('MoEasy Backend')
    .setDescription('MoEasy Backend API')
    .setVersion(configService.get('version'))
    .addBearerAuth(
      {
        type: 'apiKey',
        scheme: 'bearer',
        name: AuthGuard.ACCESS_TOKEN_HEADER,
        in: 'header',
        description: 'Enter your access token',
      },
      AuthGuard.ACCESS_TOKEN_HEADER,
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  const specJsonPath = path.join(configService.get('PWD'), './swagger-spec.json');
  writeFileSync(specJsonPath, JSON.stringify(document));
}

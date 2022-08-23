import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { CAPAConfigService, Environment } from './config/capa-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService: CAPAConfigService =
    app.get<CAPAConfigService>(CAPAConfigService);

  if (configService.nodeEnv !== Environment.PRODUCTION) {
    const config = new DocumentBuilder()
      .setTitle('khs Gateway')
      .setDescription('The KHS toy API description')
      .setVersion('1.0.0')
      .addTag('KHS')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'Authorization',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('v1/khs', app, document);
  }

  await app.listen(3000);
}

void bootstrap();

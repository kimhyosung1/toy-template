import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { CAPAConfigService } from './config/capa-config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);

  const configService: CAPAConfigService =
    app.get<CAPAConfigService>(CAPAConfigService);

  console.log('configService =', configService);
  console.log('configService =', configService.dbSchema);
}

void bootstrap();

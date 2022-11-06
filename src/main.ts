import { ValidationPipe } from '@nestjs/common';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@webserver/app.module';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./dist/private-key.pem'),
    cert: fs.readFileSync('./dist/public-certificate.pem'),
  };

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:4200',
      credentials: true,
    },
    httpsOptions,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(443);
}

bootstrap();

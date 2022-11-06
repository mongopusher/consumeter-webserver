import { ValidationPipe } from '@nestjs/common';

if (!process.env.IS_TS_NODE) {
  require('module-alias/register');
}
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@webserver/app.module';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { HttpsOptions } from '@nestjs/common/interfaces/external/https-options.interface'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

async function bootstrap() {
  dotenv.config();

  let httpsOptions: HttpsOptions | undefined;

  if (process.env.PROD === 'true') {
    httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY_PATH),
      cert: fs.readFileSync(process.env.SSL_CERTIFICATE_PATH),
    };
  }

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
  await app.listen(process.env.HTTPS_PORT);
}

bootstrap();

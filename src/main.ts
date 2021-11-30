import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session'); // using require instead of import due to conflict with typescript setting

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      keys: ['cookieSecret'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // additional properties in request body will be stripped by Dto
    }),
  );

  const port = 3000;

  await app.listen(port);

  return port;
}
bootstrap().then(port =>
  console.log(`✅✅✅ App is running on port ${port} ✅✅✅`),
);

import { ValidationPipe } from '@nestjs/common';
import { INestApplication } from '@nestjs/common';
const cookieSession = require('cookie-session');

export const setupApp = (app: INestApplication) => {
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
};

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // App setup is moved to app.module
  // setupApp(app);

  const port = 3000;
  await app.listen(port);
  return port;
}
bootstrap().then(port =>
  console.log(`✅✅✅ App is running on port ${port} ✅✅✅`),
);

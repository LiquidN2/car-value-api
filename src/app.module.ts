import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSession = require('cookie-session');

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),

    // Setup DB Connection
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          type: 'sqlite', // DB type
          database: config.get<string>('DB_NAME'), // Save data in a file named db.sqlite
          entities: [User, Report], // Models/tables in the DB
          synchronize: true, // ONLY IN DEVELOPMENT as this feature allows TypeOrm to change the t
        };
      },
    }),

    UsersModule,

    ReportsModule,
  ],

  controllers: [AppController],

  providers: [
    AppService,
    // Setup global pipe
    {
      provide: APP_PIPE,
      // additional properties in the body will be striped by Dto
      useValue: new ValidationPipe({ whitelist: true }),
    },
  ],
})
export class AppModule {
  // Setup global middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: ['cookieSecret'],
        }),
      )
      .forRoutes('*');
  }
}

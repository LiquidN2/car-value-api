import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';

@Module({
  imports: [
    // Setup DB Connection
    TypeOrmModule.forRoot({
      type: 'sqlite', // DB type
      database: 'db.sqlite', // Save data in a file named db.sqlite
      entities: [User, Report], // Models/tables in the DB
      synchronize: true, // ONLY IN DEVELOPMENT as this feature allows TypeOrm to change the table structure
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

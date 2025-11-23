import { Module } from '@nestjs/common';

import { AuthModule } from '@auth/auth.module';
import { JwtAuthModule } from '@auth/jwt-auth.module';
import { SessionAuthModule } from '@auth/session-auth.module';
import { UsersModule } from '@users/users.module';
import { TasksModule } from '@tasks/tasks.module';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@database/database.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    TasksModule,
    AuthModule,
    SessionAuthModule,
    JwtAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

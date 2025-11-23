import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { SessionAuthModule } from './auth/session/session-auth.module';
import { JwtAuthModule } from './auth/jwt/jwt-auth.module';

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

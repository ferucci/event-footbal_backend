import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardModule } from './player/player.module';
import { TelegramModule } from './telegram/telegram.module';

import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';
import config from './config';
import { BDConfigFactory } from './config/db-config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useClass: BDConfigFactory,
    }),
    // Ограничиваю количество запросов к серверу
    ThrottlerModule.forRoot([{
      ttl: 10000, // Время жизни (в миллисекундах)
      limit: 20,   // Максимальное количество запросов за это время
    }]),
    CardModule,
    TelegramModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    }
  ],
})
export class AppModule { }
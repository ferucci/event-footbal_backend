import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardModule } from './player/player.module';
import { SeedModule } from './seed/seed.module';
import { TelegramModule } from './telegram/telegram.module';

import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './common/guards/throttler.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // В продакшене false, используйте миграции
      }),
      inject: [ConfigService],
    }),
    // Ограничиваю количество запросов
    ThrottlerModule.forRoot([{
      ttl: 10000, // Время жизни (в миллисекундах) - 5 секунд
      limit: 5,   // Максимальное количество запросов за это время
    }]),
    CardModule,
    SeedModule,
    TelegramModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
    AppService],
  controllers: [AppController]
})
export class AppModule { }
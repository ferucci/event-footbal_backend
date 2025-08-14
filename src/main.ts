import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // добавление глобального обработчика ошибок
  app.useGlobalFilters(new HttpExceptionFilter());
  // добавление глобальной валидации
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // удаляет лишние поля, не вызывает ошибку
      // forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Включение CORS с настройками
  app.enableCors({
    origin: `${process.env.UIURL}`,
    methods: 'GET,HEAD,PUT,PATCH,POST',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();

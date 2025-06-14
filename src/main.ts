import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Console } from 'console';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))
  await app.listen(process.env.PORT ?? 3000);
  console.log(`server listening on port ${process.env.PORT ?? 3000}`)
}
bootstrap();

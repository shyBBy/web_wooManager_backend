import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';

// Ładowanie zmiennych środowiskowych na początku
dotenv.config();

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());

    app.enableCors({
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      origin: process.env.FRONTEND_DOMAIN,
    });

    const port = process.env.PORT || 3002; // Port z .env lub domyślny
    await app.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1); // Zakończ proces w przypadku błędu
  }
}

bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ 
    origin: "http://localhost:4200", // Allow frontend access
    credentials: true, 
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
    allowedHeaders: "Content-Type, Authorization"
  });
  await app.listen(process.env.PORT ?? 5000);
  console.log(`API is running on http://localhost:${process.env.PORT}`);
}
bootstrap();

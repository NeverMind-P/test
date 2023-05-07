import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationErrorsPipe } from './shared/pipes/validation.pipe';
import { setupSwagger } from './shared/swagger';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new CustomValidationErrorsPipe());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app);
  await app.listen(PORT);
}
bootstrap();

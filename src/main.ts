import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalExceptionFilter } from './filters/GlobalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable cors
  app.enableCors({
    origin: '*',
  });

  // use validation pipe
  app.useGlobalPipes(new ValidationPipe());


  // use Global filter
  // app.useGlobalFilters(new GlobalExceptionFilter());

  // set global prefix
  app.setGlobalPrefix('api/v1');

  // setup swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Dotlynx Task API Docs')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, document);

  const PORT = process.env.APP_PORT || 3000;
  await app.listen(PORT);
}
bootstrap();

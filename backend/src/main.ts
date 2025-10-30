// Import tracing FIRST to initialize OpenTelemetry SDK before any logger calls
import './tracing';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { OtelLogger } from './common/logger/otel-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new OtelLogger(),
  });
  
  const logger = new Logger('Bootstrap');

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Signal Ops Task Tracker API')
    .setDescription('Task Tracker API with OpenTelemetry observability')
    .setVersion('1.0')
    .addTag('tasks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📊 Metrics available at: http://localhost:${port}/metrics`);
  logger.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  logger.log(`🏥 Health Check: http://localhost:${port}/health`);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application:', error);
  process.exit(1);
});

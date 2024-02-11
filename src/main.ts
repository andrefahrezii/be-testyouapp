import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';

import databaseConfig from './config/database.config';

const mongoUri = databaseConfig.uri;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  setupSwagger(app);

  const mongoUri = databaseConfig.uri;
  mongoose.connect(mongoUri);

  const dbConnection = mongoose.connection;

  dbConnection.on('connected', () => {
    Logger.log('Connected to MongoDB', 'Database');
  });

  dbConnection.on('error', (err) => {
    Logger.error(`MongoDB connection error: ${err}`, '', 'Database');
  });

  await app.listen(3000);
}
bootstrap();

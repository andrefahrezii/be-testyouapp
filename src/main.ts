import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import * as mongoose from 'mongoose';
import { Logger } from '@nestjs/common';

import databaseConfig from './config/database.config';

// Use the URI from the configuration
const mongoUri = databaseConfig.uri;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Tambahkan baris ini

  setupSwagger(app);

  const mongoUri = databaseConfig.uri;
  mongoose.connect(mongoUri);

  // Access the connection instance
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

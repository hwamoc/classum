import { NestFactory } from '@nestjs/core';
import * as config from 'config';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const serverConfig = config.get('server');
  const port = serverConfig.port;

  await app.listen(port);
}
bootstrap();

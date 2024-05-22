import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { exceptionFilters } from './common/web/filters/index.filter';
import { getSwaggerConfiguration } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });

  const configService: ConfigService = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(...exceptionFilters);
  app.useGlobalInterceptors(new ResponseInterceptor());
  await getSwaggerConfiguration(app);
  const port = configService.get<number>('PORT') || 3000;

  process.on('SIGINT', async () => {
    console.log(
      'Received SIGINT signal.Please wait until app is self closed. Closing the application...',
    );
    await app.close();
    console.log('Application closed. Now you can safely eject.');
    process.exit(0);
  });

  await app.listen(port);
}
bootstrap();

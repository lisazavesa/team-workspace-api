import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useStaticAssets('uploads', {
    prefix: '/uploads/',
  })
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

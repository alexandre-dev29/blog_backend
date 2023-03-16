import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({ credentials: true, origin: ['http://localhost:3000'] });
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  await app.register(require('@fastify/cookie'), { secret: '' });
  const config = new DocumentBuilder()
    .setTitle('Community Blog api')
    .setDescription('A little description to go herejkm')
    .setVersion('1.0')
    .addTag('blog')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3005);
}

bootstrap();

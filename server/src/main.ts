import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') ?? 3000;

  // 配置 API 版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // 配置全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 配置全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 自动去除未定义的属性
      forbidNonWhitelisted: true, // 禁止未定义的属性，返回错误
      transform: true, // 自动转换类型
      transformOptions: {
        enableImplicitConversion: true, // 启用隐式类型转换
      },
    }),
  );

  // 配置 Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('What-to-Eat API')
    .setDescription('What-to-Eat 智能饮食助手 API 文档')
    .setVersion('1.0')
    .addTag('users', '用户相关接口')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`API base URL: http://localhost:${port}/v1`);
  console.log(`Swagger UI: http://localhost:${port}/api-docs`);
}
void bootstrap();

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../jwt/jwt.strategy';

/**
 * 当前用户装饰器
 * 从 request.user 中提取当前登录用户信息
 * 
 * 使用方式：
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);


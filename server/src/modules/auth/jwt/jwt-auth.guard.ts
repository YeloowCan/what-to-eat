import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

/**
 * JWT 认证守卫
 * 用于保护需要认证的路由
 * 继承 Passport 的 AuthGuard，使用 'jwt' 策略
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 判断路由是否需要认证
   * 如果路由标记为公开（使用 @Public() 装饰器），则跳过认证
   * @param context 执行上下文
   * @returns 是否需要认证
   */
  canActivate(context: ExecutionContext) {
    // 检查路由是否标记为公开
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    // 如果是公开路由，跳过认证
    if (isPublic) {
      return true;
    }

    // 否则执行 JWT 认证
    return super.canActivate(context);
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JWT Payload 接口
 * 定义 JWT token 中包含的用户信息
 */
export interface JwtPayload {
  sub: number; // 用户 ID
  username: string; // 用户名
  email: string; // 邮箱
  iat?: number; // 签发时间
  exp?: number; // 过期时间
}

/**
 * JWT 策略
 * 用于验证 JWT token 并提取用户信息
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 从 Authorization header 中提取 token
      ignoreExpiration: false, // 不忽略过期时间
      secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    });
  }

  /**
   * 验证 JWT payload
   * 当 token 验证通过后，此方法会被调用
   * @param payload JWT payload
   * @returns 验证后的用户信息
   */
  async validate(payload: JwtPayload): Promise<JwtPayload> {
    // 这里可以添加额外的验证逻辑
    // 例如：检查用户是否仍然存在、是否被禁用等
    if (!payload.sub || !payload.username) {
      throw new UnauthorizedException('无效的 token');
    }

    return {
      sub: payload.sub,
      username: payload.username,
      email: payload.email,
    };
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './jwt/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 用户登录
   * 验证用户凭据，生成并返回 JWT token
   * @param loginDto 登录数据（用户名或邮箱、密码）
   * @returns JWT token 和用户信息
   */
  async login(loginDto: LoginDto) {
    // 验证用户凭据
    const user = await this.usersService.validateUser(
      loginDto.usernameOrEmail,
      loginDto.password,
    );

    // 如果验证失败，抛出未授权异常
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 构建 JWT payload
    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
    };

    // 生成 JWT token
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profile: user.profile,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}

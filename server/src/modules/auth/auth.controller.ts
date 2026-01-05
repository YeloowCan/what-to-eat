import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SuccessResponse } from '../../common/interfaces/api-response.interface';

/**
 * 登录响应数据接口
 */
interface LoginResponseData {
  accessToken: string;
  user: {
    id: number;
    username: string;
    email: string;
    profile: any;
    createdAt: Date;
    updatedAt: Date;
  };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 用户登录
   * @param loginDto 登录数据
   * @returns JWT token 和用户信息
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '用户登录',
    description: '使用用户名或邮箱和密码登录，返回 JWT token',
  })
  @ApiBody({
    type: LoginDto,
    description: '登录信息',
  })
  @ApiResponse({
    status: 200,
    description: '登录成功',
    schema: {
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
          example: true,
        },
        data: {
          type: 'object',
          properties: {
            accessToken: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXJuYW1lIjoiemhhbmdzYW4iLCJlbWFpbCI6InpoYW5nc2FuQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0MDQ4MDAwLCJleHAiOjE3MDQ2NTI4MDB9',
            },
            user: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                username: { type: 'string', example: 'zhangsan' },
                email: { type: 'string', example: 'zhangsan@example.com' },
                profile: { type: 'object', nullable: true, example: null },
                createdAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-12-31T12:00:00.000Z',
                },
                updatedAt: {
                  type: 'string',
                  format: 'date-time',
                  example: '2025-12-31T12:00:00.000Z',
                },
              },
            },
          },
        },
        message: {
          type: 'string',
          example: '登录成功',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '用户名或密码错误',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'AUTH_004' },
            message: { type: 'string', example: '用户名或密码错误' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/auth/login' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '请求参数验证失败',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'VALIDATION_001' },
            message: { type: 'string', example: '请求参数验证失败' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/auth/login' },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<SuccessResponse<LoginResponseData>> {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
      message: '登录成功',
    };
  }
}


import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { SuccessResponse } from '../../common/interfaces/api-response.interface';
import { User } from '../../entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 用户注册
   * @param createUserDto 用户注册数据
   * @returns 创建的用户信息（不含密码）
   */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '用户注册',
    description: '创建新用户账号，需要提供用户名、邮箱和密码',
  })
  @ApiBody({
    type: CreateUserDto,
    description: '用户注册信息',
  })
  @ApiResponse({
    status: 201,
    description: '注册成功',
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
        message: {
          type: 'string',
          example: '注册成功',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: '用户名或邮箱已存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'USER_002' },
            message: { type: 'string', example: '用户名已存在' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/users/register' },
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
        path: { type: 'string', example: '/v1/users/register' },
      },
    },
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SuccessResponse<Omit<User, 'passwordHash'>>> {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
      message: '注册成功',
    };
  }
}


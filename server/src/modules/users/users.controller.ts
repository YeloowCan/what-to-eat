import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { SuccessResponse } from '../../common/interfaces/api-response.interface';
import { User } from '../../entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt/jwt.strategy';

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

  /**
   * 获取当前用户信息
   * @param user JWT payload（包含用户 ID）
   * @returns 当前登录用户的完整信息（包含用户资料）
   */
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取当前用户信息',
    description:
      '获取当前登录用户的完整信息，包括用户资料（身高、体重、年龄、性别）',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
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
            profile: {
              type: 'object',
              nullable: true,
              properties: {
                height: { type: 'number', example: 175 },
                weight: { type: 'number', example: 70 },
                age: { type: 'number', example: 25 },
                gender: {
                  type: 'string',
                  enum: ['male', 'female'],
                  example: 'male',
                },
              },
              example: {
                height: 175,
                weight: 70,
                age: 25,
                gender: 'male',
              },
            },
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
          example: '获取成功',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要登录',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'AUTH_001' },
            message: { type: 'string', example: '未授权，请先登录' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/users/profile' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '用户不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'USER_001' },
            message: { type: 'string', example: '用户不存在' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/users/profile' },
      },
    },
  })
  async getProfile(
    @CurrentUser() jwtPayload: JwtPayload,
  ): Promise<SuccessResponse<Omit<User, 'passwordHash'>>> {
    const user = await this.usersService.findOne(jwtPayload.sub);

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    return {
      success: true,
      data: user,
      message: '获取成功',
    };
  }

  /**
   * 更新当前用户资料
   * @param jwtPayload JWT payload（包含用户 ID）
   * @param updateUserProfileDto 用户资料更新数据
   * @returns 更新后的用户信息（包含用户资料）
   */
  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '更新当前用户资料',
    description:
      '更新当前登录用户的资料信息（身高、体重、年龄、性别），所有字段都是可选的',
  })
  @ApiBody({
    type: UpdateUserProfileDto,
    description: '用户资料更新信息',
  })
  @ApiResponse({
    status: 200,
    description: '更新成功',
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
            profile: {
              type: 'object',
              nullable: true,
              properties: {
                height: { type: 'number', example: 175 },
                weight: { type: 'number', example: 70 },
                age: { type: 'number', example: 25 },
                gender: {
                  type: 'string',
                  enum: ['male', 'female'],
                  example: 'male',
                },
              },
              example: {
                height: 175,
                weight: 70,
                age: 25,
                gender: 'male',
              },
            },
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
          example: '更新成功',
        },
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
        path: { type: 'string', example: '/v1/users/profile' },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: '未授权，需要登录',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'AUTH_001' },
            message: { type: 'string', example: '未授权，请先登录' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/users/profile' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '用户不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'USER_001' },
            message: { type: 'string', example: '用户不存在' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/users/profile' },
      },
    },
  })
  async updateProfile(
    @CurrentUser() jwtPayload: JwtPayload,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ): Promise<SuccessResponse<Omit<User, 'passwordHash'>>> {
    const user = await this.usersService.updateProfile(
      jwtPayload.sub,
      updateUserProfileDto,
    );

    return {
      success: true,
      data: user,
      message: '更新成功',
    };
  }
}

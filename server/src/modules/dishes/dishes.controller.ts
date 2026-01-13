import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { QueryDishesDto } from './dto/query-dishes.dto';
import { CreateDishDto } from './dto/create-dish.dto';
import { SuccessResponse } from '../../common/interfaces/api-response.interface';
import { Dish } from '../../entities/dish.entity';
import { PaginatedResult } from './dishes.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt/jwt.strategy';

@ApiTags('dishes')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  /**
   * 获取菜品列表
   * 支持分页和筛选（按分类、菜系）
   * @param queryDto 查询参数
   * @returns 分页的菜品列表
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取菜品列表',
    description: '获取菜品列表，支持分页和按分类、菜系筛选',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '页码（从 1 开始）',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '每页数量',
    example: 10,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: '菜品分类',
    example: '川菜',
  })
  @ApiQuery({
    name: 'cuisineType',
    required: false,
    type: String,
    description: '菜系类型',
    example: '中式',
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  name: { type: 'string', example: '宫保鸡丁' },
                  category: { type: 'string', example: '川菜' },
                  cuisineType: { type: 'string', example: '中式' },
                  nutrition: {
                    type: 'object',
                    properties: {
                      calories: { type: 'number', example: 250 },
                      protein: { type: 'number', example: 20 },
                      fat: { type: 'number', example: 10 },
                      carbs: { type: 'number', example: 15 },
                    },
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    example: ['辣', '下饭'],
                  },
                  description: {
                    type: 'string',
                    example: '经典川菜，麻辣鲜香',
                  },
                  userId: { type: 'number', nullable: true, example: null },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-12-31T12:00:00.000Z',
                  },
                },
              },
            },
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
          },
        },
        message: { type: 'string', example: '获取成功' },
      },
    },
  })
  async findAll(
    @Query() queryDto: QueryDishesDto,
  ): Promise<SuccessResponse<PaginatedResult<Dish>>> {
    const result = await this.dishesService.findAll(queryDto);

    return {
      success: true,
      data: result,
      message: '获取成功',
    };
  }

  /**
   * 获取单个菜品详情
   * @param id 菜品 ID
   * @returns 菜品详情
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '获取单个菜品详情',
    description: '根据菜品 ID 获取菜品详细信息',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: '菜品 ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '宫保鸡丁' },
            category: { type: 'string', example: '川菜' },
            cuisineType: { type: 'string', example: '中式' },
            nutrition: {
              type: 'object',
              properties: {
                calories: { type: 'number', example: 250 },
                protein: { type: 'number', example: 20 },
                fat: { type: 'number', example: 10 },
                carbs: { type: 'number', example: 15 },
              },
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['辣', '下饭'],
            },
            description: {
              type: 'string',
              example: '经典川菜，麻辣鲜香',
            },
            userId: { type: 'number', nullable: true, example: null },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T12:00:00.000Z',
            },
          },
        },
        message: { type: 'string', example: '获取成功' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '菜品不存在',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'DISH_001' },
            message: { type: 'string', example: '菜品不存在' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/dishes/999' },
      },
    },
  })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponse<Dish>> {
    const dish = await this.dishesService.findOne(id);

    if (!dish) {
      throw new NotFoundException('菜品不存在');
    }

    return {
      success: true,
      data: dish,
      message: '获取成功',
    };
  }

  /**
   * 创建菜品
   * 只有登录用户才能创建菜品
   * @param createDishDto 菜品创建数据
   * @param jwtPayload 当前登录用户信息
   * @returns 创建的菜品信息
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '创建菜品',
    description: '创建新菜品，需要登录认证。创建者用户 ID 会自动保存。',
  })
  @ApiBody({
    type: CreateDishDto,
    description: '菜品信息',
  })
  @ApiResponse({
    status: 201,
    description: '创建成功',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '宫保鸡丁' },
            category: { type: 'string', example: '川菜' },
            cuisineType: { type: 'string', example: '中式' },
            nutrition: {
              type: 'object',
              properties: {
                calories: { type: 'number', example: 250 },
                protein: { type: 'number', example: 20 },
                fat: { type: 'number', example: 10 },
                carbs: { type: 'number', example: 15 },
              },
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['辣', '下饭'],
            },
            description: {
              type: 'string',
              example: '经典川菜，麻辣鲜香',
            },
            userId: { type: 'number', example: 1 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T12:00:00.000Z',
            },
          },
        },
        message: { type: 'string', example: '创建成功' },
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
        path: { type: 'string', example: '/v1/dishes' },
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
        path: { type: 'string', example: '/v1/dishes' },
      },
    },
  })
  async create(
    @Body() createDishDto: CreateDishDto,
    @CurrentUser() jwtPayload: JwtPayload,
  ): Promise<SuccessResponse<Dish>> {
    const dish = await this.dishesService.create(
      createDishDto,
      jwtPayload.sub,
    );

    return {
      success: true,
      data: dish,
      message: '创建成功',
    };
  }

  /**
   * 随机推荐菜品
   * 从数据库中随机选择一条菜品记录
   * @returns 随机菜品信息
   */
  @Get('recommend/random')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '随机推荐菜品',
    description: '从数据库中随机选择一条菜品记录，用于"今天吃什么"功能',
  })
  @ApiResponse({
    status: 200,
    description: '成功返回随机菜品',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: '宫保鸡丁' },
            category: { type: 'string', example: '川菜', nullable: true },
            cuisineType: { type: 'string', example: '中式', nullable: true },
            nutrition: {
              type: 'object',
              properties: {
                calories: { type: 'number', example: 250 },
                protein: { type: 'number', example: 20 },
                fat: { type: 'number', example: 10 },
                carbs: { type: 'number', example: 15 },
              },
            },
            tags: {
              type: 'array',
              items: { type: 'string' },
              example: ['辣', '下饭'],
              nullable: true,
            },
            description: {
              type: 'string',
              example: '经典川菜，麻辣鲜香',
              nullable: true,
            },
            userId: { type: 'number', example: null, nullable: true },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2025-12-31T12:00:00.000Z',
            },
          },
        },
        message: { type: 'string', example: '获取成功' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '数据库中没有菜品',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        error: {
          type: 'object',
          properties: {
            code: { type: 'string', example: 'DISH_001' },
            message: { type: 'string', example: '菜品不存在' },
          },
        },
        timestamp: { type: 'string', format: 'date-time' },
        path: { type: 'string', example: '/v1/dishes/recommend/random' },
      },
    },
  })
  async getRandom(): Promise<SuccessResponse<Dish>> {
    const dish = await this.dishesService.getRandom();

    if (!dish) {
      throw new NotFoundException('数据库中没有菜品，请先添加菜品数据');
    }

    return {
      success: true,
      data: dish,
      message: '获取成功',
    };
  }
}


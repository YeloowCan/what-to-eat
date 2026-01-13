import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { DishesService } from './dishes.service';
import { QueryDishesDto } from './dto/query-dishes.dto';
import { SuccessResponse } from '../../common/interfaces/api-response.interface';
import { Dish } from '../../entities/dish.entity';
import { PaginatedResult } from './dishes.service';

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
}


import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * 查询菜品列表 DTO
 * 用于分页和筛选参数
 */
export class QueryDishesDto {
  @ApiProperty({
    description: '页码（从 1 开始）',
    example: 1,
    required: false,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: '菜品分类',
    example: '川菜',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: '菜系类型',
    example: '中式',
    required: false,
  })
  @IsOptional()
  @IsString()
  cuisineType?: string;
}


import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsObject,
  IsArray,
  IsNumber,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 营养成分 DTO
 * 用于验证营养成分对象
 */
export class NutritionDto {
  @ApiProperty({
    description: '卡路里（kcal）',
    example: 250,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  calories: number;

  @ApiProperty({
    description: '蛋白质（g）',
    example: 20,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  protein: number;

  @ApiProperty({
    description: '脂肪（g）',
    example: 10,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  fat: number;

  @ApiProperty({
    description: '碳水化合物（g）',
    example: 15,
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  carbs: number;
}

/**
 * 创建菜品 DTO
 */
export class CreateDishDto {
  @ApiProperty({
    description: '菜品名称',
    example: '宫保鸡丁',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: '菜品分类',
    example: '川菜',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiProperty({
    description: '菜系类型',
    example: '中式',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  cuisineType?: string;

  @ApiProperty({
    description: '营养成分',
    type: NutritionDto,
    example: {
      calories: 250,
      protein: 20,
      fat: 10,
      carbs: 15,
    },
  })
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => NutritionDto)
  nutrition: NutritionDto;

  @ApiProperty({
    description: '标签数组',
    example: ['辣', '下饭'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({
    description: '菜品描述',
    example: '经典川菜，麻辣鲜香',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}


import { IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UpdateUserProfileDto {
  @ApiProperty({
    description: '身高（cm）',
    example: 175,
    minimum: 50,
    maximum: 250,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(50)
  @Max(250)
  height?: number; // 身高（cm）

  @ApiProperty({
    description: '体重（kg）',
    example: 70,
    minimum: 20,
    maximum: 300,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(20)
  @Max(300)
  weight?: number; // 体重（kg）

  @ApiProperty({
    description: '年龄',
    example: 28,
    minimum: 1,
    maximum: 150,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(150)
  age?: number; // 年龄

  @ApiProperty({
    description: '性别',
    enum: Gender,
    example: Gender.MALE,
    required: false,
  })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender; // 性别
}


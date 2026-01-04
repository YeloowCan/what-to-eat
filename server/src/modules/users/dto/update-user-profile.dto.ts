import { IsNumber, IsEnum, IsOptional, Min, Max } from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export class UpdateUserProfileDto {
  @IsNumber()
  @IsOptional()
  @Min(50)
  @Max(250)
  height?: number; // 身高（cm）

  @IsNumber()
  @IsOptional()
  @Min(20)
  @Max(300)
  weight?: number; // 体重（kg）

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(150)
  age?: number; // 年龄

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender; // 性别
}


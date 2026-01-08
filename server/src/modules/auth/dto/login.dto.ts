import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: '用户名或邮箱',
    example: 'zhangsan',
  })
  @IsString()
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty({
    description: '密码',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

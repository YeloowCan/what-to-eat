import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 密码哈希
   * 使用 bcrypt 对密码进行哈希加密
   * @param password 明文密码
   * @returns 哈希后的密码
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * 密码验证
   * 验证明文密码是否与哈希密码匹配
   * @param password 明文密码
   * @param hashedPassword 哈希密码
   * @returns 是否匹配
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}


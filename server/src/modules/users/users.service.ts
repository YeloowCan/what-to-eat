import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

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

  /**
   * 创建用户
   * 检查用户名和邮箱唯一性，加密密码并保存用户
   * @param createUserDto 用户注册数据
   * @returns 创建的用户信息（不含密码）
   */
  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'passwordHash'>> {
    // 检查用户名是否已存在
    const existingUserByUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUserByUsername) {
      throw new ConflictException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUserByEmail) {
      throw new ConflictException('邮箱已被注册');
    }

    // 加密密码
    const passwordHash = await this.hashPassword(createUserDto.password);

    // 创建用户实体
    const user = this.userRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      passwordHash,
      profile: null,
    });

    // 保存到数据库
    const savedUser = await this.userRepository.save(user);

    // 返回用户信息（不含密码）
    const { passwordHash: _, ...userWithoutPassword } = savedUser;
    return userWithoutPassword;
  }
}
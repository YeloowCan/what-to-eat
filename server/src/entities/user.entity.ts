import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 用户资料接口
 * 用于健康分析和个性化推荐
 */
export interface UserProfile {
  height?: number; // 身高（cm）
  weight?: number; // 体重（kg）
  age?: number; // 年龄
  gender?: 'male' | 'female'; // 性别
}

/**
 * 用户实体
 * 对应数据库中的 users 表
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  username: string;

  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column('jsonb', { nullable: true })
  profile: UserProfile | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


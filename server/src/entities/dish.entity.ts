import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

/**
 * 营养成分接口
 * 用于存储菜品的营养成分信息
 */
export interface Nutrition {
  calories: number; // 卡路里（kcal）
  protein: number; // 蛋白质（g）
  fat: number; // 脂肪（g）
  carbs: number; // 碳水化合物（g）
}

/**
 * 菜品实体
 * 对应数据库中的 dishes 表
 */
@Entity('dishes')
export class Dish {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category: string | null;

  @Column({ name: 'cuisine_type', type: 'varchar', length: 50, nullable: true })
  cuisineType: string | null;

  @Column({ type: 'jsonb' })
  nutrition: Nutrition;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[] | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}


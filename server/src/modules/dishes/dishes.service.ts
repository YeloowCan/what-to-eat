import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../../entities/dish.entity';
import { QueryDishesDto } from './dto/query-dishes.dto';
import { CreateDishDto } from './dto/create-dish.dto';

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class DishesService {
  constructor(
    @InjectRepository(Dish)
    private readonly dishRepository: Repository<Dish>,
  ) {}

  /**
   * 获取菜品列表
   * 支持分页和筛选
   * @param queryDto 查询参数（分页和筛选）
   * @returns 分页的菜品列表
   */
  async findAll(
    queryDto: QueryDishesDto,
  ): Promise<PaginatedResult<Dish>> {
    const { page = 1, limit = 10, category, cuisineType } = queryDto;

    // 构建查询条件
    const queryBuilder = this.dishRepository.createQueryBuilder('dish');

    // 添加筛选条件
    if (category) {
      queryBuilder.andWhere('dish.category = :category', { category });
    }

    if (cuisineType) {
      queryBuilder.andWhere('dish.cuisineType = :cuisineType', {
        cuisineType,
      });
    }

    // 计算总数
    const total = await queryBuilder.getCount();

    // 分页查询
    const items = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('dish.createdAt', 'DESC')
      .getMany();

    // 计算总页数
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * 根据 ID 查找菜品
   * @param id 菜品 ID
   * @returns 菜品信息，如果菜品不存在返回 null
   */
  async findOne(id: number): Promise<Dish | null> {
    const dish = await this.dishRepository.findOne({
      where: { id },
    });

    if (!dish) {
      return null;
    }

    return dish;
  }

  /**
   * 创建菜品
   * @param createDishDto 菜品创建数据
   * @param userId 创建者用户 ID
   * @returns 创建的菜品信息
   */
  async create(
    createDishDto: CreateDishDto,
    userId: number,
  ): Promise<Dish> {
    // 创建菜品实体
    const dish = this.dishRepository.create({
      name: createDishDto.name,
      category: createDishDto.category || null,
      cuisineType: createDishDto.cuisineType || null,
      nutrition: createDishDto.nutrition,
      tags: createDishDto.tags || null,
      description: createDishDto.description || null,
      userId,
    });

    // 保存到数据库
    const savedDish = await this.dishRepository.save(dish);

    return savedDish;
  }
}


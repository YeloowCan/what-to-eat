import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dish } from '../../entities/dish.entity';
import { QueryDishesDto } from './dto/query-dishes.dto';

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
}


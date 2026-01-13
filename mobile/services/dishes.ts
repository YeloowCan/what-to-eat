import api from './api';
import type { ApiSuccessResponse } from '../types/api';
import type { Dish } from '../types/dish';

/**
 * 分页结果接口
 * 与后端 PaginatedResult 保持一致
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * 查询菜品列表参数
 * 与后端 QueryDishesDto 保持一致
 */
export interface QueryDishesParams {
  page?: number; // 页码（从 1 开始），默认 1
  limit?: number; // 每页数量，默认 10
  category?: string; // 菜品分类（可选）
  cuisineType?: string; // 菜系类型（可选）
}

/**
 * 获取菜品列表
 * @param params 查询参数（分页和筛选）
 * @returns Promise<PaginatedResult<Dish>> 分页的菜品列表
 * @throws 如果获取失败，抛出包含友好错误消息的 Error
 */
export async function getDishes(
  params?: QueryDishesParams,
): Promise<PaginatedResult<Dish>> {
  const response = await api.get<
    ApiSuccessResponse<PaginatedResult<Dish>>
  >('/dishes', {
    params,
  });

  // 响应格式：{ success: true, data: { items, total, page, limit, totalPages }, message: '...' }
  return response.data;
}

/**
 * 获取单个菜品详情
 * @param id 菜品 ID
 * @returns Promise<Dish> 菜品详情
 * @throws 如果获取失败，抛出包含友好错误消息的 Error
 */
export async function getDish(id: number): Promise<Dish> {
  const response = await api.get<ApiSuccessResponse<Dish>>(`/dishes/${id}`);

  // 响应格式：{ success: true, data: { id, name, ... }, message: '...' }
  return response.data;
}

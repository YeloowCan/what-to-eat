import { useQuery } from '@tanstack/react-query';
import { getDishes, type QueryDishesParams } from '../services/dishes';
import type { PaginatedResult } from '../services/dishes';
import type { Dish } from '../types/dish';

/**
 * 获取菜品列表的 React Query Hook
 * 自动处理加载状态、错误状态和缓存
 * 支持分页和筛选参数
 * 
 * 使用方式：
 * ```tsx
 * const { data, isLoading, error } = useDishes({ page: 1, limit: 10 });
 * 
 * // 带筛选条件
 * const { data, isLoading, error } = useDishes({ 
 *   page: 1, 
 *   limit: 10,
 *   category: '川菜',
 *   cuisineType: '中式'
 * });
 * ```
 */
export function useDishes(params?: QueryDishesParams) {
  return useQuery<PaginatedResult<Dish>>({
    queryKey: ['dishes', params],
    queryFn: () => getDishes(params),
    staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜，不重新获取
    retry: 1, // 失败时重试 1 次
  });
}

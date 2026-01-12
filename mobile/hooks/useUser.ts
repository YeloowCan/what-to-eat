import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '../services/users';

/**
 * 获取当前用户信息的 React Query Hook
 * 自动处理加载状态、错误状态和缓存
 * 
 * 使用方式：
 * ```tsx
 * const { data: user, isLoading, error } = useUser();
 * ```
 */
export function useUser() {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: getCurrentUser,
    // 只在已认证时获取用户信息
    enabled: true, // 由路由守卫控制是否显示页面
    staleTime: 5 * 60 * 1000, // 5 分钟内数据视为新鲜，不重新获取
    retry: 1, // 失败时重试 1 次
  });
}


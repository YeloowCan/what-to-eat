import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';
import { useAuthStore } from '../store/authStore';

/**
 * 受保护路由守卫 Hook
 * 检查用户是否已认证，未认证时重定向到登录页
 * 
 * 使用方式：
 * ```tsx
 * export default function ProtectedPage() {
 *   useAuthGuard();
 *   // 页面内容
 * }
 * ```
 */
export function useAuthGuard() {
  const { isAuthenticated } = useAuthStore();
  const segments = useSegments();

  useEffect(() => {
    // 如果未认证，重定向到登录页
    if (!isAuthenticated) {
      // 获取当前路径，用于登录后返回
      const currentPath = segments.length > 0 ? `/${segments.join('/')}` : '/';
      
      // 重定向到登录页，并传递返回路径
      router.replace({
        pathname: '/login',
        params: { returnTo: currentPath },
      });
    }
  }, [isAuthenticated, segments]);

  return isAuthenticated;
}


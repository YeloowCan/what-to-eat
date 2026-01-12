import { useEffect, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  // 标记组件已挂载
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // 确保组件已挂载且 Root Layout 已准备好
    if (!isMounted) {
      return;
    }

    // 如果未认证，重定向到登录页
    if (!isAuthenticated) {
      // 使用 setTimeout 确保在下一个事件循环中执行，避免在挂载前导航
      const timer = setTimeout(() => {
        try {
          // 获取当前路径，用于登录后返回
          const currentPath = segments.length > 0 ? `/${segments.join('/')}` : '/';
          
          // 重定向到登录页，并传递返回路径
          router.replace({
            pathname: '/login',
            params: { returnTo: currentPath },
          });
        } catch (error) {
          // 如果导航失败，静默处理（可能是 Root Layout 还未准备好）
          console.warn('Navigation failed:', error);
        }
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, segments, isMounted]);

  return isAuthenticated;
}


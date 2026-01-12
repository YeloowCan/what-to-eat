import api from './api';
import type { ApiSuccessResponse } from '../types/api';
import type { User } from '../store/authStore';

/**
 * 获取当前用户信息
 * @returns Promise<User> 当前登录用户的完整信息（包含用户资料）
 * @throws 如果获取失败，抛出包含友好错误消息的 Error
 */
export async function getCurrentUser(): Promise<User> {
  const response = await api.get<ApiSuccessResponse<User>>('/users/profile');

  // 响应格式：{ success: true, data: { id, username, email, profile, ... }, message: '...' }
  return response.data;
}


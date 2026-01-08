import api from './api';
import type { ApiSuccessResponse } from '../types/api';
import type { User } from '../store/authStore';

/**
 * 登录请求参数
 */
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponseData {
  accessToken: string;
  user: User;
}

/**
 * 登录 API 调用
 * @param credentials 登录凭据（用户名或邮箱、密码）
 * @returns Promise<LoginResponseData> 包含 token 和用户信息
 * @throws 如果登录失败，抛出包含友好错误消息的 Error
 */
export async function login(
  credentials: LoginRequest,
): Promise<LoginResponseData> {
  const response = await api.post<ApiSuccessResponse<LoginResponseData>>(
    '/auth/login',
    credentials,
  );

  // 响应格式：{ success: true, data: { accessToken, user }, message: '...' }
  return response.data;
}

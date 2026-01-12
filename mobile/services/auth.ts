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
 * 注册请求参数
 */
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

/**
 * 注册响应数据
 */
export interface RegisterResponseData {
  id: number;
  username: string;
  email: string;
  profile: User['profile'];
  createdAt: string;
  updatedAt: string;
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

/**
 * 注册 API 调用
 * @param registerData 注册数据（用户名、邮箱、密码）
 * @returns Promise<RegisterResponseData> 创建的用户信息
 * @throws 如果注册失败，抛出包含友好错误消息的 Error
 */
export async function register(
  registerData: RegisterRequest,
): Promise<RegisterResponseData> {
  const response = await api.post<ApiSuccessResponse<RegisterResponseData>>(
    '/users/register',
    registerData,
  );

  // 响应格式：{ success: true, data: { id, username, email, ... }, message: '...' }
  return response.data;
}

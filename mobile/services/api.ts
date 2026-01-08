import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiErrorResponse } from '../types/api';

/**
 * 错误码到用户友好消息的映射
 * 与后端 error-codes.ts 中的 ErrorMessages 保持一致
 */
const ERROR_MESSAGE_MAP: Record<string, string> = {
  // 认证相关错误
  AUTH_001: '未授权，请先登录',
  AUTH_002: 'Token 无效或已过期，请重新登录',
  AUTH_003: 'Token 格式错误',
  AUTH_004: '用户名或密码错误',

  // 用户相关错误
  USER_001: '用户不存在',
  USER_002: '用户名已存在',
  USER_003: '邮箱已被注册',
  USER_004: '用户资料更新失败',

  // 菜品相关错误
  DISH_001: '菜品不存在',
  DISH_002: '菜品创建失败',

  // 验证相关错误
  VALIDATION_001: '请求参数验证失败，请检查输入',
  VALIDATION_002: '请求体格式错误',

  // 系统相关错误
  SYSTEM_001: '服务器内部错误，请稍后重试',
  SYSTEM_002: '数据库连接错误',
  SYSTEM_003: '资源未找到',
};

/**
 * 获取用户友好的错误消息
 */
function getErrorMessage(errorCode: string, defaultMessage?: string): string {
  // 优先使用错误码映射
  if (ERROR_MESSAGE_MAP[errorCode]) {
    return ERROR_MESSAGE_MAP[errorCode];
  }

  // 如果没有映射，使用后端返回的消息
  if (defaultMessage) {
    return defaultMessage;
  }

  // 最后使用通用错误消息
  return '操作失败，请稍后重试';
}

/**
 * 创建 axios 实例
 */
const api: AxiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/v1',
  timeout: 10000, // 10 秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器
 * 可以在这里添加 token、请求日志等
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 开发环境打印请求日志
    if (__DEV__) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        baseURL: config.baseURL,
        params: config.params,
        data: config.data,
      });
    }

    // TODO: 在步骤 2.3 中添加 token
    // const token = useAuthStore.getState().token;
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器
 * 统一处理响应和错误
 */
api.interceptors.response.use(
  (response) => {
    // 开发环境打印响应日志
    if (__DEV__) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
      });
    }

    // 直接返回响应数据（后端已使用统一格式）
    return response.data;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 开发环境打印错误日志
    if (__DEV__) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // 处理 HTTP 错误响应
    if (error.response) {
      const errorData = error.response.data;

      // 如果后端返回了统一错误格式
      if (errorData && typeof errorData === 'object' && 'error' in errorData && !errorData.success) {
        const errorCode = errorData.error.code;
        const errorMessage = getErrorMessage(errorCode, errorData.error.message);

        // 创建一个新的错误对象，包含友好的错误消息
        const friendlyError = new Error(errorMessage);
        (friendlyError as any).code = errorCode;
        (friendlyError as any).status = error.response.status;
        (friendlyError as any).originalError = error;

        return Promise.reject(friendlyError);
      }

      // 如果后端返回了其他格式的错误
      const status = error.response.status;
      let message = '操作失败，请稍后重试';

      switch (status) {
        case 400:
          message = '请求参数错误';
          break;
        case 401:
          message = '未授权，请先登录';
          break;
        case 403:
          message = '没有权限访问此资源';
          break;
        case 404:
          message = '资源未找到';
          break;
        case 409:
          message = '资源冲突';
          break;
        case 500:
          message = '服务器内部错误，请稍后重试';
          break;
        default:
          message = `请求失败 (${status})`;
      }

      const friendlyError = new Error(message);
      (friendlyError as any).status = status;
      (friendlyError as any).originalError = error;

      return Promise.reject(friendlyError);
    }

    // 处理网络错误（无响应）
    if (error.request) {
      const networkError = new Error('网络连接失败，请检查网络设置');
      (networkError as any).originalError = error;
      return Promise.reject(networkError);
    }

    // 处理其他错误
    const unknownError = new Error('未知错误，请稍后重试');
    (unknownError as any).originalError = error;
    return Promise.reject(unknownError);
  },
);

export default api;

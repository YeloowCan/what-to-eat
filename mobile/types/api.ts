/**
 * API 相关类型定义
 * 与后端响应格式保持一致
 */

/**
 * API 错误响应格式
 */
export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
  path: string;
}

/**
 * API 成功响应格式
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
}

/**
 * API 响应类型（成功或错误）
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

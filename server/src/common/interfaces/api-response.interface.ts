/**
 * 统一 API 响应格式接口
 */

/**
 * 成功响应格式
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
}

/**
 * 错误响应格式（已在 http-exception.filter.ts 中定义，这里仅作参考）
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
  path: string;
}

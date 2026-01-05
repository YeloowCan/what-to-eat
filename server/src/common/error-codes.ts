/**
 * 错误码定义
 * 统一管理所有错误码，便于维护和查找
 *
 * 错误码格式：{模块}_{序号}
 * - AUTH: 认证相关错误
 * - USER: 用户相关错误
 * - DISH: 菜品相关错误
 * - VALIDATION: 验证相关错误
 * - SYSTEM: 系统相关错误
 */

export enum ErrorCode {
  // 认证相关错误 (AUTH_001 - AUTH_099)
  AUTH_001 = 'AUTH_001', // 未授权，需要登录
  AUTH_002 = 'AUTH_002', // Token 无效或已过期
  AUTH_003 = 'AUTH_003', // Token 格式错误
  AUTH_004 = 'AUTH_004', // 用户名或密码错误

  // 用户相关错误 (USER_001 - USER_099)
  USER_001 = 'USER_001', // 用户不存在
  USER_002 = 'USER_002', // 用户名已存在
  USER_003 = 'USER_003', // 邮箱已被注册
  USER_004 = 'USER_004', // 用户资料更新失败

  // 菜品相关错误 (DISH_001 - DISH_099)
  DISH_001 = 'DISH_001', // 菜品不存在
  DISH_002 = 'DISH_002', // 菜品创建失败

  // 验证相关错误 (VALIDATION_001 - VALIDATION_099)
  VALIDATION_001 = 'VALIDATION_001', // 请求参数验证失败
  VALIDATION_002 = 'VALIDATION_002', // 请求体格式错误

  // 系统相关错误 (SYSTEM_001 - SYSTEM_099)
  SYSTEM_001 = 'SYSTEM_001', // 服务器内部错误
  SYSTEM_002 = 'SYSTEM_002', // 数据库连接错误
  SYSTEM_003 = 'SYSTEM_003', // 资源未找到
}

/**
 * 错误码对应的用户友好消息
 */
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.AUTH_001]: '未授权，请先登录',
  [ErrorCode.AUTH_002]: 'Token 无效或已过期，请重新登录',
  [ErrorCode.AUTH_003]: 'Token 格式错误',
  [ErrorCode.AUTH_004]: '用户名或密码错误',

  [ErrorCode.USER_001]: '用户不存在',
  [ErrorCode.USER_002]: '用户名已存在',
  [ErrorCode.USER_003]: '邮箱已被注册',
  [ErrorCode.USER_004]: '用户资料更新失败',

  [ErrorCode.DISH_001]: '菜品不存在',
  [ErrorCode.DISH_002]: '菜品创建失败',

  [ErrorCode.VALIDATION_001]: '请求参数验证失败',
  [ErrorCode.VALIDATION_002]: '请求体格式错误',

  [ErrorCode.SYSTEM_001]: '服务器内部错误，请稍后重试',
  [ErrorCode.SYSTEM_002]: '数据库连接错误',
  [ErrorCode.SYSTEM_003]: '资源未找到',
};


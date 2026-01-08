import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ErrorCode, ErrorMessages } from '../error-codes';

/**
 * 统一错误响应格式
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

/**
 * 全局异常过滤器
 * 统一处理所有异常，返回统一的错误响应格式
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // 获取状态码和错误信息
    let status: number;
    let errorCode: string;
    let message: string;

    if (exception instanceof HttpException) {
      // NestJS 内置异常
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // 处理不同类型的异常响应
      if (typeof exceptionResponse === 'string') {
        // 简单字符串响应
        message = exceptionResponse;
        errorCode = this.getErrorCodeFromStatus(status);
      } else if (typeof exceptionResponse === 'object') {
        // 对象响应（可能包含 message 和 error）
        const responseObj = exceptionResponse as any;
        // 处理 ValidationPipe 的数组响应
        if (Array.isArray(responseObj.message)) {
          // 多个验证错误，取第一个错误消息
          message = responseObj.message[0] || '请求参数验证失败';
        } else {
          message = responseObj.message || exception.message;
        }
        errorCode = this.getErrorCodeFromStatus(status);
      } else {
        message = exception.message;
        errorCode = this.getErrorCodeFromStatus(status);
      }

      // 根据异常类型和消息映射到具体错误码
      errorCode = this.mapExceptionToErrorCode(exception, message);
    } else {
      // 未知异常（如系统错误）
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorCode = ErrorCode.SYSTEM_001;
      message = ErrorMessages[ErrorCode.SYSTEM_001];
    }

    // 构建错误响应
    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code: errorCode,
        message: this.getUserFriendlyMessage(errorCode, message),
      },
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // 记录错误日志（开发环境记录详细信息）
    if (process.env.NODE_ENV === 'development') {
      this.logger.error(
        `HTTP ${status} Error: ${errorCode} - ${message}`,
        exception instanceof Error ? exception.stack : undefined,
      );
      this.logger.debug(`Request URL: ${request.url}`);
      this.logger.debug(`Request Method: ${request.method}`);
      this.logger.debug(`Request Body: ${JSON.stringify(request.body)}`);
    } else {
      // 生产环境只记录关键信息
      this.logger.error(
        `HTTP ${status} Error: ${errorCode} - ${message} - Path: ${request.url}`,
      );
    }

    // 返回统一格式的错误响应
    response.status(status).json(errorResponse);
  }

  /**
   * 根据 HTTP 状态码获取默认错误码
   */
  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorCode.VALIDATION_001;
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.AUTH_001;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.AUTH_001;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.SYSTEM_003;
      case HttpStatus.CONFLICT:
        return ErrorCode.USER_002; // 默认冲突错误码，会根据消息进一步映射
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ErrorCode.SYSTEM_001;
      default:
        return ErrorCode.SYSTEM_001;
    }
  }

  /**
   * 根据异常类型和消息映射到具体错误码
   */
  private mapExceptionToErrorCode(
    exception: HttpException,
    message: string,
  ): string {
    const status = exception.getStatus();

    // 根据消息内容映射到具体错误码
    if (message.includes('用户名已存在') || message.includes('username')) {
      return ErrorCode.USER_002;
    }
    if (message.includes('邮箱已被注册') || message.includes('email')) {
      return ErrorCode.USER_003;
    }
    if (message.includes('用户不存在') || message.includes('user not found')) {
      return ErrorCode.USER_001;
    }
    if (message.includes('未授权') || message.includes('unauthorized')) {
      return ErrorCode.AUTH_001;
    }
    if (message.includes('Token') || message.includes('token')) {
      if (message.includes('无效') || message.includes('过期')) {
        return ErrorCode.AUTH_002;
      }
      return ErrorCode.AUTH_003;
    }
    if (message.includes('密码错误') || message.includes('password')) {
      return ErrorCode.AUTH_004;
    }
    if (status === HttpStatus.BAD_REQUEST) {
      return ErrorCode.VALIDATION_001;
    }
    if (status === HttpStatus.NOT_FOUND) {
      return ErrorCode.SYSTEM_003;
    }

    // 返回默认错误码
    return this.getErrorCodeFromStatus(status);
  }

  /**
   * 获取用户友好的错误消息
   * 优先使用错误码对应的消息，如果没有则使用原始消息
   */
  private getUserFriendlyMessage(
    errorCode: string,
    originalMessage: string,
  ): string {
    // 如果错误码在 ErrorMessages 中，使用预定义的消息
    if (errorCode in ErrorMessages) {
      return ErrorMessages[errorCode as ErrorCode];
    }

    // 否则使用原始消息（但确保不暴露技术细节）
    // 在生产环境中，可以进一步处理消息，移除技术细节
    if (process.env.NODE_ENV === 'production') {
      // 生产环境：如果消息包含技术细节，使用通用消息
      if (
        originalMessage.includes('stack') ||
        originalMessage.includes('Error:')
      ) {
        return ErrorMessages[ErrorCode.SYSTEM_001];
      }
    }

    return originalMessage;
  }
}

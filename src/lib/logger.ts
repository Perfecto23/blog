/**
 * 统一日志工具
 * 提供客户端和服务端的日志管理，支持不同环境的日志级别控制
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogContext {
  userId?: string;
  sessionId?: string;
  page?: string;
  component?: string;
  action?: string;
  [key: string]: string | number | boolean | undefined;
}

class Logger {
  private isClient: boolean;
  private isProduction: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.minLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
  }

  /**
   * 格式化时间戳
   */
  private formatTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  }

  /**
   * 格式化上下文信息
   */
  private formatContext(context?: LogContext): string {
    if (!context || Object.keys(context).length === 0) return '';

    const contextStr = Object.entries(context)
      .map(([key, value]) => `${key}=${value}`)
      .join(' ');

    return ` [${contextStr}]`;
  }

  /**
   * 获取日志前缀
   */
  private getPrefix(level: LogLevel, context?: LogContext): string {
    const timestamp = this.formatTimestamp();
    const env = this.isClient ? '客户端' : '服务端';
    const levelText = LogLevel[level];
    const contextStr = this.formatContext(context);

    return `[${timestamp}] [${env}] [${levelText}]${contextStr}`;
  }

  /**
   * 检查是否应该输出日志
   */
  private shouldLog(level: LogLevel): boolean {
    // 生产环境下，客户端不输出任何日志
    if (this.isProduction && this.isClient) {
      return false;
    }

    // 检查日志级别
    return level >= this.minLevel;
  }

  /**
   * 输出调试日志
   */
  debug(message: string, context?: LogContext, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const prefix = this.getPrefix(LogLevel.DEBUG, context);
    console.log(`${prefix} ${message}`, ...args);
  }

  /**
   * 输出信息日志
   */
  info(message: string, context?: LogContext, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.getPrefix(LogLevel.INFO, context);
    console.info(`${prefix} ${message}`, ...args);
  }

  /**
   * 输出警告日志
   */
  warn(message: string, context?: LogContext, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return;

    const prefix = this.getPrefix(LogLevel.WARN, context);
    console.warn(`${prefix} ${message}`, ...args);
  }

  /**
   * 输出错误日志
   */
  error(message: string, error?: Error, context?: LogContext, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const prefix = this.getPrefix(LogLevel.ERROR, context);

    if (error) {
      console.error(`${prefix} ${message}`, error.stack || error.message, ...args);
    } else {
      console.error(`${prefix} ${message}`, ...args);
    }
  }

  /**
   * 性能日志记录
   */
  performance(label: string, startTime: number, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const duration = Date.now() - startTime;
    const prefix = this.getPrefix(LogLevel.INFO, { ...context, type: '性能' });
    console.log(`${prefix} ${label} 耗时: ${duration}ms`);
  }

  /**
   * API 请求日志
   */
  api(method: string, url: string, status: number, duration: number, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.getPrefix(LogLevel.INFO, { ...context, type: 'API' });
    const statusColor = status >= 400 ? '❌' : status >= 300 ? '⚠️' : '✅';
    console.log(`${prefix} ${statusColor} ${method} ${url} - ${status} (${duration}ms)`);
  }

  /**
   * 用户行为日志
   */
  userAction(action: string, details?: Record<string, unknown>, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.getPrefix(LogLevel.INFO, { ...context, type: '用户行为' });
    console.log(`${prefix} 🎯 ${action}`, details || '');
  }

  /**
   * 组件生命周期日志
   */
  component(componentName: string, lifecycle: string, props?: Record<string, unknown>, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;

    const prefix = this.getPrefix(LogLevel.DEBUG, { ...context, component: componentName });
    console.log(`${prefix} 🔄 ${lifecycle}`, props ? { props } : '');
  }

  /**
   * 路由变化日志
   */
  route(from: string, to: string, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.getPrefix(LogLevel.INFO, { ...context, type: '路由' });
    console.log(`${prefix} 🛣️ 页面跳转: ${from} → ${to}`);
  }

  /**
   * 数据加载日志
   */
  dataLoad(dataType: string, success: boolean, count?: number, context?: LogContext): void {
    if (!this.shouldLog(LogLevel.INFO)) return;

    const prefix = this.getPrefix(LogLevel.INFO, { ...context, type: '数据加载' });
    const icon = success ? '📊' : '💥';
    const countStr = count !== undefined ? ` (${count}条)` : '';
    console.log(`${prefix} ${icon} ${dataType} ${success ? '加载成功' : '加载失败'}${countStr}`);
  }
}

// 导出单例实例
export const logger = new Logger();

/**
 * 便捷的日志方法，用于快速记录
 */
export const log = {
  debug: (message: string, context?: LogContext, ...args: unknown[]) => logger.debug(message, context, ...args),
  info: (message: string, context?: LogContext, ...args: unknown[]) => logger.info(message, context, ...args),
  warn: (message: string, context?: LogContext, ...args: unknown[]) => logger.warn(message, context, ...args),
  error: (message: string, error?: Error, context?: LogContext, ...args: unknown[]) =>
    logger.error(message, error, context, ...args),
  performance: (label: string, startTime: number, context?: LogContext) =>
    logger.performance(label, startTime, context),
  api: (method: string, url: string, status: number, duration: number, context?: LogContext) =>
    logger.api(method, url, status, duration, context),
  userAction: (action: string, details?: Record<string, unknown>, context?: LogContext) =>
    logger.userAction(action, details, context),
  component: (componentName: string, lifecycle: string, props?: Record<string, unknown>, context?: LogContext) =>
    logger.component(componentName, lifecycle, props, context),
  route: (from: string, to: string, context?: LogContext) => logger.route(from, to, context),
  dataLoad: (dataType: string, success: boolean, count?: number, context?: LogContext) =>
    logger.dataLoad(dataType, success, count, context),
};

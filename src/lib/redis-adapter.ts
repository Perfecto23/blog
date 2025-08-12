/**
 * Redis适配器 - 支持本地开发和生产环境
 */

import { Redis } from '@upstash/redis';
import { log } from './logger';

// 本地存储模拟Redis
class LocalRedis {
  private storage: Map<string, string> = new Map();

  async get(key: string): Promise<string | null> {
    const value = this.storage.get(key);
    log.debug('LocalRedis GET', { key, value });
    return value || null;
  }

  async set(key: string, value: string | number): Promise<void> {
    this.storage.set(key, String(value));
    log.debug('LocalRedis SET', { key, value });
  }

  async incr(key: string): Promise<number> {
    const current = parseInt(this.storage.get(key) || '0');
    const newValue = current + 1;
    this.storage.set(key, String(newValue));
    log.debug('LocalRedis INCR', { key, oldValue: current, newValue });
    return newValue;
  }

  async mget(...keys: string[]): Promise<(string | null)[]> {
    const values = keys.map(key => this.storage.get(key) || null);
    log.debug('LocalRedis MGET', {
      keys: keys.join(','),
      values: values.map(v => v || 'null').join(','),
    });
    return values;
  }

  clear(): void {
    this.storage.clear();
  }
}

// 创建Redis实例
let backendType: 'upstash' | 'local' = 'local';

function createRedisInstance() {
  const isProduction = process.env.NODE_ENV === 'production';
  const hasUpstashConfig = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;
  const forceUpstash = process.env.FORCE_UPSTASH === '1';

  if (isProduction && !hasUpstashConfig) {
    throw new Error('Upstash Redis配置缺失，生产环境需要UPSTASH_REDIS_REST_URL和UPSTASH_REDIS_REST_TOKEN');
  }

  if (!hasUpstashConfig) {
    log.warn('使用本地Redis模拟器', { reason: 'Upstash配置未提供' });
    backendType = 'local';
    return new LocalRedis();
  }

  // 开发环境允许强制使用 Upstash（需要显式提供配置）
  if (!isProduction && !forceUpstash) {
    log.warn('开发环境检测到 Upstash 配置，仍建议确认是否需要直连云端；如需强制直连请设置 FORCE_UPSTASH=1');
  }

  backendType = 'upstash';
  log.info('使用Upstash Redis', { url: `${process.env.UPSTASH_REDIS_REST_URL?.slice(0, 30)}...` });
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export const redis = createRedisInstance();

/**
 * 返回当前 Redis 后端状态（用于调试）
 */
export function getRedisStatus() {
  return {
    type: backendType,
    hasUpstashConfig: Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN),
    urlPrefix: process.env.UPSTASH_REDIS_REST_URL?.slice(0, 30) || undefined,
  } as const;
}

// Redis键名常量
export const REDIS_KEYS = {
  // 文章访问量：views:article:{slug}
  articleViews: (slug: string) => `views:article:${slug}`,
  // 站点总访问量
  siteViews: 'views:site:total',
  // 每日访问量：views:site:daily:{YYYY-MM-DD}
  dailyViews: (date: string) => `views:site:daily:${date}`,
} as const;

// 访问量统计工具函数
export const viewsUtils = {
  /**
   * 增加文章访问量
   */
  async incrementArticleViews(slug: string): Promise<number> {
    const key = REDIS_KEYS.articleViews(slug);
    return await redis.incr(key);
  },

  /**
   * 获取文章访问量
   */
  async getArticleViews(slug: string): Promise<number> {
    const key = REDIS_KEYS.articleViews(slug);
    const views = await redis.get(key);
    return typeof views === 'number' ? views : parseInt(String(views || '0'));
  },

  /**
   * 批量获取多篇文章的访问量
   */
  async getBatchArticleViews(slugs: string[]): Promise<Record<string, number>> {
    if (slugs.length === 0) return {};

    const keys = slugs.map(slug => REDIS_KEYS.articleViews(slug));
    const views = await redis.mget(...keys);

    const result: Record<string, number> = {};
    slugs.forEach((slug, index) => {
      const value = views[index];
      result[slug] = typeof value === 'number' ? value : parseInt(String(value || '0'));
    });

    return result;
  },

  /**
   * 增加站点总访问量
   */
  async incrementSiteViews(): Promise<number> {
    return await redis.incr(REDIS_KEYS.siteViews);
  },

  /**
   * 获取站点总访问量
   */
  async getSiteViews(): Promise<number> {
    const views = await redis.get(REDIS_KEYS.siteViews);
    return typeof views === 'number' ? views : parseInt(String(views || '0'));
  },

  /**
   * 增加今日访问量
   */
  async incrementTodayViews(): Promise<number> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const key = REDIS_KEYS.dailyViews(today);
    return await redis.incr(key);
  },

  /**
   * 获取今日访问量
   */
  async getTodayViews(): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    const key = REDIS_KEYS.dailyViews(today);
    const views = await redis.get(key);
    return typeof views === 'number' ? views : parseInt(String(views || '0'));
  },

  /**
   * 获取最近7天的访问量统计
   */
  async getRecentViews(days: number = 7): Promise<Array<{ date: string; views: number }>> {
    const dates: string[] = [];
    const keys: string[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      dates.push(dateString);
      keys.push(REDIS_KEYS.dailyViews(dateString));
    }

    const views = await redis.mget(...keys);

    return dates
      .map((date, index) => {
        const value = views[index];
        return {
          date,
          views: typeof value === 'number' ? value : parseInt(String(value || '0')),
        };
      })
      .reverse(); // 最早的日期在前
  },

  // 调试和管理功能
  debug: {
    /**
     * 设置文章访问量（调试用）
     */
    async setArticleViews(slug: string, count: number): Promise<void> {
      const key = REDIS_KEYS.articleViews(slug);
      await redis.set(key, count);
      log.info('手动设置文章访问量', { slug, count });
    },

    /**
     * 设置站点访问量（调试用）
     */
    async setSiteViews(count: number): Promise<void> {
      await redis.set(REDIS_KEYS.siteViews, count);
      log.info('手动设置站点访问量', { count });
    },

    /**
     * 重置所有访问量（调试用）
     */
    async resetAllViews(): Promise<void> {
      // 只有在开发环境或有特殊标记时才允许
      const isDevelopment = process.env.NODE_ENV === 'development';
      const allowReset = process.env.ALLOW_RESET_VIEWS === 'true';

      if (!isDevelopment && !allowReset) {
        throw new Error('重置功能仅在开发环境或明确授权时可用');
      }

      if (redis instanceof LocalRedis) {
        redis.clear();
        log.warn('已重置本地所有访问量数据');
      } else {
        // 对于Upstash Redis，我们需要手动删除相关键
        log.warn('重置功能对云端Redis有限支持，仅重置已知键');
        // 这里我们只重置主要的计数器，不进行全量清理
        await redis.set(REDIS_KEYS.siteViews, 0);
        const today = new Date().toISOString().split('T')[0];
        await redis.set(REDIS_KEYS.dailyViews(today), 0);
        log.warn('已重置站点访问量和今日访问量，文章访问量需要单独设置');
      }
    },
  },
};

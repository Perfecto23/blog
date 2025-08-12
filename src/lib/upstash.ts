/**
 * Upstash Redis配置
 * 用于serverless环境的访问量统计
 */

import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL) {
  throw new Error('UPSTASH_REDIS_REST_URL environment variable is required');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('UPSTASH_REDIS_REST_TOKEN environment variable is required');
}

// 创建Redis实例
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

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
    return typeof views === 'number' ? views : 0;
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
      result[slug] = typeof views[index] === 'number' ? views[index] : 0;
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
    return typeof views === 'number' ? views : 0;
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
    return typeof views === 'number' ? views : 0;
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
      .map((date, index) => ({
        date,
        views: typeof views[index] === 'number' ? views[index] : 0,
      }))
      .reverse(); // 最早的日期在前
  },
};

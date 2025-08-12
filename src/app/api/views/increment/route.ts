import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';
import { viewsUtils } from '@/lib/redis-adapter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, type = 'article', includeSite = true } = body;

    // 验证输入
    if (type === 'article' && !slug) {
      return NextResponse.json({ error: 'Article slug is required' }, { status: 400 });
    }

    // 获取客户端IP/UA用于日志和基础防刷
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const userAgent = request.headers.get('user-agent') || '';

    // 过滤常见爬虫
    const botPattern = /(bot|spider|crawler|preview|pingdom|lighthouse)/i;
    if (botPattern.test(userAgent)) {
      return NextResponse.json({ skipped: true });
    }

    // 60s 节流（IP+UA+Slug）
    try {
      const key = `rate:views:${slug || 'site'}:${clientIP}:${userAgent.slice(0, 40)}`;
      // 依赖 redis-adapter：如果为本地模拟，mget/set 兼容；这里采用 get->set 模拟 TTL（本地不生效则忽略）
      const exists = await (
        viewsUtils as unknown as { redis?: { get?: (k: string) => Promise<string | null> } }
      ).redis?.get?.(key);
      if (exists) {
        return NextResponse.json({ throttled: true });
      }
      await (
        viewsUtils as unknown as { redis?: { set?: (k: string, v: string, opts?: { ex?: number }) => Promise<void> } }
      ).redis?.set?.(key, '1');
      // 尝试设置 60s 过期（Upstash 支持 ex 参数；本地模拟忽略）
      await (
        viewsUtils as unknown as { redis?: { set?: (k: string, v: string, opts?: { ex?: number }) => Promise<void> } }
      ).redis?.set?.(key, '1', { ex: 60 });
    } catch {}

    const result: { articleViews?: number; siteViews?: number; todayViews?: number } = {};

    if (type === 'article' && slug) {
      // 增加文章访问量
      const articleViews = await viewsUtils.incrementArticleViews(slug);
      result.articleViews = articleViews;

      log.info('文章访问量增加', {
        slug,
        views: articleViews,
        ip: clientIP,
        action: '访问量统计',
      });
    }

    if ((type === 'site' || type === 'article') && includeSite) {
      // 增加站点总访问量
      const siteViews = await viewsUtils.incrementSiteViews();
      result.siteViews = siteViews;

      // 增加今日访问量
      const todayViews = await viewsUtils.incrementTodayViews();
      result.todayViews = todayViews;

      log.info('站点访问量增加', {
        siteViews,
        todayViews,
        ip: clientIP,
        action: '访问量统计',
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    log.error('访问量增加失败', error as Error, { action: '访问量统计' });

    // 避免因为统计失败影响用户体验，返回成功但不暴露错误详情
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 支持OPTIONS请求用于CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

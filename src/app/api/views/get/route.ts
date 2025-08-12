import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';
import { viewsUtils } from '@/lib/redis-adapter';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') || 'article';
    const slugs = searchParams.get('slugs'); // 批量查询，逗号分隔

    const result: {
      articleViews?: number;
      batchViews?: Record<string, number>;
      siteViews?: number;
      todayViews?: number;
    } = {};

    // 单篇文章访问量查询
    if (type === 'article' && slug) {
      const articleViews = await viewsUtils.getArticleViews(slug);
      result.articleViews = articleViews;
    }

    // 批量文章访问量查询
    if (type === 'batch' && slugs) {
      const slugArray = slugs.split(',').filter(Boolean);
      const batchViews = await viewsUtils.getBatchArticleViews(slugArray);
      result.batchViews = batchViews;
    }

    // 站点统计信息查询
    if (type === 'site') {
      const [siteViews, todayViews] = await Promise.all([viewsUtils.getSiteViews(), viewsUtils.getTodayViews()]);

      result.siteViews = siteViews;
      result.todayViews = todayViews;
    }

    // 如果是文章页面，同时返回站点总访问量（用于统计显示）
    if (type === 'article' && slug) {
      const siteViews = await viewsUtils.getSiteViews();
      result.siteViews = siteViews;
    }

    log.debug('访问量查询', {
      type: type || 'unknown',
      slug: slug || 'none',
      slugs: slugs || 'none',
      resultKeys: Object.keys(result).join(','),
      action: '访问量查询',
    });

    return NextResponse.json(result);
  } catch (error) {
    log.error('访问量查询失败', error as Error, { action: '访问量查询' });

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 支持OPTIONS请求用于CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

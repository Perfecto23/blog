'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { log } from '@/lib/logger';

interface ViewCounterProps {
  slug: string;
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  /** 是否在挂载时递增计数；列表视图应为 false，仅详情页为 true */
  increment?: boolean;
}

export function ViewCounter({
  slug,
  className = '',
  showIcon = true,
  size = 'md',
  increment = true,
}: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIncremented, setHasIncremented] = useState(false);

  // 根据尺寸设置样式
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  useEffect(() => {
    const initViewCounter = async () => {
      try {
        // 以“天”为单位做去重，避免一天内多次刷新重复计数
        const today = new Date().toISOString().slice(0, 10);
        const articleKey = `viewed_article_${slug}_${today}`;
        const siteKey = `site_viewed_${today}`;
        const hasViewedToday = typeof window !== 'undefined' ? localStorage.getItem(articleKey) : null;
        const hasSiteViewedToday = typeof window !== 'undefined' ? localStorage.getItem(siteKey) : null;

        // 首先获取当前访问量（列表和详情都需要展示数值）
        const response = await fetch(`/api/views/get?type=article&slug=${encodeURIComponent(slug)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch views');
        }

        const data = await response.json();
        setViews(data.articleViews || 0);

        // 列表页展示：不递增
        if (!increment) return;

        // 详情页：如果今天未计数，则增加访问量
        if (!hasViewedToday && !hasIncremented) {
          const includeSite = !hasSiteViewedToday; // 当天首次文章访问才累计站点访问量
          const incrementResponse = await fetch('/api/views/increment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              slug,
              type: 'article',
              includeSite,
            }),
          });

          if (incrementResponse.ok) {
            const incrementData = await incrementResponse.json();
            setViews(incrementData.articleViews || data.articleViews || 0);

            // 标记当天已访问此文章
            localStorage.setItem(articleKey, 'true');
            if (includeSite) {
              localStorage.setItem(siteKey, 'true');
            }
            setHasIncremented(true);

            log.userAction(
              '文章访问',
              {
                slug,
                views: incrementData.articleViews,
              },
              { component: 'ViewCounter' }
            );
          }
        }
      } catch (error) {
        log.error('访问量统计失败', error as Error, {
          slug,
          component: 'ViewCounter',
        });
        // 失败时不影响用户体验，显示为0
        setViews(0);
      } finally {
        setIsLoading(false);
      }
    };

    initViewCounter();
  }, [slug, hasIncremented, increment]);

  if (isLoading) {
    return (
      <div className={`flex items-center gap-1 text-gray-500 ${sizeClasses[size]} ${className}`}>
        {showIcon && <Eye className={`opacity-50 ${iconSizes[size]}`} />}
        <span className='animate-pulse'>--</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 text-gray-600 dark:text-gray-400 ${sizeClasses[size]} ${className}`}
      title={`${views} 次阅读`}
    >
      {showIcon && <Eye className={`opacity-100 ${iconSizes[size]}`} />}
      <span className='font-medium'>{views?.toLocaleString() || 0}</span>
    </div>
  );
}

/**
 * 站点统计组件
 */
interface SiteStatsProps {
  className?: string;
}

export function SiteStats({ className = '' }: SiteStatsProps) {
  const [stats, setStats] = useState<{
    siteViews: number;
    todayViews: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSiteStats = async () => {
      try {
        const response = await fetch('/api/views/get?type=site');
        if (!response.ok) {
          throw new Error('Failed to fetch site stats');
        }

        const data = await response.json();
        setStats({
          siteViews: data.siteViews || 0,
          todayViews: data.todayViews || 0,
        });

        log.debug('站点统计获取成功', {
          siteViews: data.siteViews,
          todayViews: data.todayViews,
          component: 'SiteStats',
        });
      } catch (error) {
        log.error('站点统计获取失败', error as Error, {
          component: 'SiteStats',
        });
        setStats({
          siteViews: 0,
          todayViews: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSiteStats();
  }, []);

  if (isLoading || !stats) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <Eye className='h-4 w-4 opacity-50' />
          <span className='animate-pulse'>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className='flex items-center gap-3'>
        <div className='flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400'>
          <Eye className='h-4 w-4 opacity-100' />
          <span>总访问量</span>
          <span className='font-semibold text-blue-600 dark:text-blue-400'>{stats.siteViews.toLocaleString()}</span>
        </div>

        <div className='text-sm text-gray-500'>
          <span>今日 </span>
          <span className='font-medium text-green-600 dark:text-green-400'>+{stats.todayViews.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

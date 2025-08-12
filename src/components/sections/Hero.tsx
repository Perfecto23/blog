import Link from 'next/link';
import { PageHeader } from '@/components/common/PageHeader';
import { siteConfig } from '@/lib/data';
import { viewsUtils } from '@/lib/redis-adapter';
import { getStats } from '@/lib/stats';

export async function Hero() {
  const stats = getStats();
  const [siteViews, todayViews] = await Promise.all([viewsUtils.getSiteViews(), viewsUtils.getTodayViews()]);

  return (
    <PageHeader
      variant='hero'
      badge={{
        text: '可接受项目合作',
        icon: 'pulse',
        color: 'green',
      }}
      title='你好，我是'
      highlightText={siteConfig.author.name}
      subtitle='前端工程师 · 技术博主 · 开源贡献者'
      description='专注于现代 Web 开发技术，热衷于性能优化和工程化实践。通过代码创造优秀的用户体验，用技术文章分享开发心得。'
    >
      {/* Key Skills */}
      <div className='mx-auto mb-8 max-w-4xl'>
        <div className='flex flex-wrap justify-center gap-2 text-sm text-gray-600'>
          <span>Vue.js/React 生态</span>
          <span className='text-gray-400'>•</span>
          <span>TypeScript 开发</span>
          <span className='text-gray-400'>•</span>
          <span>前端工程化</span>
          <span className='text-gray-400'>•</span>
          <span>性能优化</span>
          <span className='text-gray-400'>•</span>
          <span>用户体验设计</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className='mb-12 flex flex-col justify-center gap-4 sm:flex-row'>
        <Link
          href='/blog'
          className='inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-md hover:from-blue-700 hover:to-purple-700'
        >
          阅读博客
        </Link>
        <Link
          href='/about'
          className='inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-8 py-4 font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700'
        >
          了解更多
        </Link>
      </div>

      {/* Quick Stats */}
      <div className='mx-auto flex max-w-2xl flex-wrap justify-center gap-8 text-center'>
        <div>
          <div className='text-2xl font-bold text-gray-900'>{stats.experience}</div>
          <div className='text-sm text-gray-600'>{stats.experienceLabel}</div>
        </div>
        <div>
          <div className='text-2xl font-bold text-gray-900'>{stats.articles}+</div>
          <div className='text-sm text-gray-600'>{stats.articlesLabel}</div>
        </div>
        <div>
          <div className='text-2xl font-bold text-gray-900'>{siteViews.toLocaleString()}</div>
          <div className='text-sm text-gray-600'>总访问量</div>
        </div>
        <div>
          <div className='text-2xl font-bold text-gray-900'>+{todayViews.toLocaleString()}</div>
          <div className='text-sm text-gray-600'>今日</div>
        </div>
      </div>
    </PageHeader>
  );
}

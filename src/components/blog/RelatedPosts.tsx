'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { BlogPost } from '@/types';

interface RelatedPostsProps {
  /** 当前文章 */
  currentPost: BlogPost;
  /** 全部文章列表（用于计算推荐） */
  allPosts: BlogPost[];
  /** 最多展示的推荐数量，默认 3 */
  maxPosts?: number;
  /** 外层容器样式类名（便于复用） */
  className?: string;
}

/**
 * 计算文章相似度
 * 基于：同分类、共同标签、发布时间接近、标题关键词重合
 * 仅用于排序推荐结果，返回的分数越高越相关
 */
function calculateSimilarity(post1: BlogPost, post2: BlogPost): number {
  let score = 0;

  // 同分类加分
  if (post1.category === post2.category) {
    score += 3;
  }

  // 共同标签加分
  const commonTags = post1.tags.filter(tag => post2.tags.includes(tag));
  score += commonTags.length * 2;

  // 发布时间接近加分（30天内）
  const date1 = new Date(post1.date);
  const date2 = new Date(post2.date);
  const daysDiff = Math.abs((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff <= 30) {
    score += 1;
  }

  // 标题相似度（简单的关键词匹配）
  const title1Words = post1.title.toLowerCase().split(/\s+/);
  const title2Words = post2.title.toLowerCase().split(/\s+/);
  const commonWords = title1Words.filter(word => word.length > 2 && title2Words.includes(word));
  score += commonWords.length * 0.5;

  return score;
}

/**
 * 获取相关文章
 * @param currentPost 当前文章
 * @param allPosts 所有文章
 * @param maxPosts 返回的最大数量
 */
function getRelatedPosts(currentPost: BlogPost, allPosts: BlogPost[], maxPosts: number = 3): BlogPost[] {
  return allPosts
    .filter(post => post.slug !== currentPost.slug)
    .map(post => ({
      ...post,
      similarity: calculateSimilarity(currentPost, post),
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, maxPosts);
}

/**
 * 相关文章推荐组件
 * 基于分类、标签、发布时间等因素推荐相关文章
 */
export function RelatedPosts({ currentPost, allPosts, maxPosts = 3, className = '' }: RelatedPostsProps) {
  // 使用 useMemo 避免不必要的重新计算（客户端渲染时尤为重要）
  const relatedPosts = useMemo(
    () => getRelatedPosts(currentPost, allPosts, maxPosts),
    [currentPost, allPosts, maxPosts]
  );

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className={`mt-12 ${className}`}>
      {/* 区块标题 - 文案与说明 */}
      <div className='mb-6'>
        {/* h2：推荐区块主标题 */}
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>相关文章推荐</h2>
        {/* p：推荐说明文字（弱化颜色，减少视觉负担） */}
        <p className='text-gray-600'>基于分类和标签为您推荐相关的技术文章</p>
      </div>

      {/* 列表容器 - 响应式 1/2/3 列布局，移动优先
          使用 min-h 限定卡片高度以减少加载阶段的布局跳动 */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {relatedPosts.map(post => (
          <Card
            key={post.slug}
            /* 卡片：与博客列表页保持一致的视觉风格 */
            className='group flex h-full transform flex-col border border-gray-200/60 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-500/10'
          >
            {/* 卡片头部区域：分类、标题、元信息 */}
            <CardHeader className='pb-4'>
              {/* 分类 */}
              <div className='mb-4 flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 shadow-sm'>
                  <Tag className='h-3 w-3 text-white' />
                </div>
                <Link
                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                  className='rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-sm'
                  aria-label={`查看分类 ${post.category}`}
                >
                  {post.category}
                </Link>
              </div>

              {/* 标题 */}
              <h3 className='mb-4 line-clamp-2 text-lg leading-tight font-bold'>
                <Link
                  href={`/blog/${post.slug}`}
                  className='bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent transition-all duration-200 group-hover:from-blue-600 group-hover:to-indigo-600 focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:outline-none'
                  aria-label={`阅读：${post.title}`}
                >
                  {post.title}
                </Link>
              </h3>

              {/* 元信息 */}
              <div className='flex items-center gap-4 text-xs text-gray-500'>
                <div className='flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1'>
                  <Calendar className='h-3.5 w-3.5 text-gray-400' />
                  <span className='font-medium'>{post.date}</span>
                </div>
                <div className='flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1'>
                  <Clock className='h-3.5 w-3.5 text-gray-400' />
                  <span className='font-medium'>{post.readingTime}</span>
                </div>
              </div>
            </CardHeader>

            {/* 内容区域：摘要、标签、占位、按钮 */}
            <CardContent className='grid grow grid-rows-[auto_auto_1fr_auto] gap-4 pt-2'>
              {/* 描述 */}
              <p className='line-clamp-3 text-sm leading-relaxed text-gray-600 transition-colors duration-200 group-hover:text-gray-700'>
                {post.description}
              </p>

              {/* 标签 */}
              <div className='flex flex-wrap gap-2'>
                {post.tags.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className='rounded-full border border-gray-200/60 bg-gradient-to-r from-gray-50 to-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-all duration-200 hover:border-blue-200 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 2 && (
                  <span className='rounded-full border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 px-3 py-1 text-xs font-medium text-amber-700'>
                    +{post.tags.length - 2}
                  </span>
                )}
              </div>

              {/* spacer */}
              <div />

              {/* 阅读链接 */}
              <Link
                href={`/blog/${post.slug}`}
                className='group/link inline-flex items-center gap-2 justify-self-end rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25 focus-visible:ring-2 focus-visible:ring-blue-400/40 focus-visible:outline-none'
                aria-label={`阅读全文：${post.title}`}
              >
                阅读全文
                <ArrowRight className='h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-1' />
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

/**
 * 分类相关文章组件
 */
export function CategoryRelatedPosts({
  category,
  allPosts,
  maxPosts = 4,
  excludeSlug,
  className = '',
}: {
  category: string;
  allPosts: BlogPost[];
  maxPosts?: number;
  excludeSlug?: string;
  className?: string;
}) {
  const categoryPosts = allPosts
    .filter(post => post.category === category && post.slug !== excludeSlug)
    .slice(0, maxPosts);

  if (categoryPosts.length === 0) {
    return null;
  }

  return (
    <section className={`${className}`}>
      <div className='mb-6'>
        <h3 className='mb-2 text-xl font-bold text-gray-900'>更多「{category}」文章</h3>
        <p className='text-gray-600'>探索更多同分类下的精彩内容</p>
      </div>

      <div className='space-y-4'>
        {categoryPosts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className='group block rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-blue-200 hover:shadow-sm'
          >
            <div className='flex items-start justify-between gap-4'>
              <div className='flex-1'>
                <h4 className='line-clamp-1 font-medium text-gray-900 transition-colors group-hover:text-blue-600'>
                  {post.title}
                </h4>
                <p className='mt-1 line-clamp-2 text-sm text-gray-600'>{post.description}</p>
                <div className='mt-2 flex items-center gap-3 text-xs text-gray-500'>
                  <span>{post.date}</span>
                  <span>{post.readingTime}</span>
                </div>
              </div>
              <ArrowRight className='h-4 w-4 flex-shrink-0 text-gray-400 transition-colors group-hover:text-blue-600' />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

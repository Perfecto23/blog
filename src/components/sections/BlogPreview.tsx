import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { GradientText } from '@/components/common/GradientText';
import { getAllPosts } from '@/lib/mdx';

export function BlogPreview() {
  // 获取最新的3篇文章
  const allPosts = getAllPosts();
  const latestPosts = allPosts.slice(0, 3);
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 py-24'>
      {/* Background decoration */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.03),transparent_50%)]'></div>

      <div className='relative mx-auto max-w-6xl px-6'>
        <div className='mb-16 text-center'>
          <div className='mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm'>
            <span className='mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500'></span>
            最新发布
          </div>
          <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
            最新<GradientText>文章</GradientText>
          </h2>
          <p className='mx-auto max-w-3xl text-xl text-gray-600/90'>分享前端开发经验、技术心得和学习笔记</p>
        </div>

        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {latestPosts.map((post, index) => {
            // 根据文章索引生成不同的渐变颜色
            const gradients = [
              'from-blue-50 to-indigo-100',
              'from-green-50 to-emerald-100',
              'from-purple-50 to-violet-100',
            ];
            const iconColors = [
              'bg-blue-500/20 text-blue-600',
              'bg-green-500/20 text-green-600',
              'bg-purple-500/20 text-purple-600',
            ];

            return (
              <AnimatedCard className='rounded-2xl' key={post.slug} delay={index * 100}>
                <article className='group flex h-full flex-col overflow-hidden rounded-2xl border border-white/60 bg-white/80 shadow-lg shadow-gray-200/30 backdrop-blur-sm transition-all duration-500 hover:border-white/80 hover:bg-white/90 hover:shadow-2xl hover:shadow-blue-200/20'>
                  <div
                    className={`flex h-48 items-center justify-center bg-gradient-to-br ${gradients[index % 3]} flex-shrink-0`}
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl ${iconColors[index % 3]} transition-all duration-300 group-hover:scale-110`}
                    >
                      <Tag className='h-8 w-8' />
                    </div>
                  </div>
                  <div className='flex flex-1 flex-col px-6 pt-6 pb-6'>
                    <div className='mb-3 flex items-center gap-4 text-sm text-gray-500 transition-colors group-hover:text-gray-600'>
                      <div className='flex items-center gap-1'>
                        <Calendar className='h-3.5 w-3.5 transition-all group-hover:text-blue-500' />
                        <span>{post.date}</span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Clock className='h-3.5 w-3.5 transition-all group-hover:text-blue-500' />
                        <span>{post.readingTime}</span>
                      </div>
                    </div>

                    <div className='mb-3 flex items-center gap-2'>
                      <span className='rounded-full bg-gradient-to-r from-blue-50 to-blue-100/80 px-2.5 py-1 text-xs font-medium text-blue-600 transition-all duration-300 group-hover:from-blue-100 group-hover:to-blue-200/80 group-hover:text-blue-700'>
                        {post.category}
                      </span>
                    </div>

                    <h3 className='mb-3 line-clamp-2 text-xl leading-tight font-bold transition-all duration-300 group-hover:text-blue-600'>
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>

                    <p className='mb-6 line-clamp-2 flex-1 leading-relaxed text-gray-600 transition-colors group-hover:text-gray-700'>
                      {post.description}
                    </p>

                    <Link
                      href={`/blog/${post.slug}`}
                      className='group/link inline-flex items-center font-medium text-blue-600 transition-all duration-300 hover:text-blue-700'
                    >
                      阅读全文
                      <ArrowRight className='ml-1 h-4 w-4 transition-all duration-300 group-hover/link:translate-x-1 group-hover/link:scale-110' />
                    </Link>
                  </div>
                </article>
              </AnimatedCard>
            );
          })}
        </div>

        {/* View All Button */}
        <div className='text-center'>
          <Link
            href='/blog'
            className='group inline-flex items-center rounded-full border border-blue-200/50 bg-gradient-to-r from-blue-50 to-blue-100/80 px-8 py-4 font-semibold text-blue-600 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:from-blue-100 hover:to-blue-200/80 hover:text-blue-700 hover:shadow-xl'
          >
            查看全部文章
            <ArrowRight className='ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110' />
          </Link>
        </div>
      </div>
    </section>
  );
}

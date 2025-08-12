import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Tag } from 'lucide-react';
import { CategoryHierarchy } from '@/components/blog/CategoryHierarchy';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { ViewCounter } from '@/components/common/ViewCounter';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { getAllCategories, getAllPosts, getPostsByCategory } from '@/lib/mdx';
import { generateSEO, generateStructuredData } from '@/lib/metadata';
import { viewsUtils } from '@/lib/redis-adapter';

export const metadata: Metadata = generateSEO({
  title: '博客',
  description: '分享前端开发经验、技术心得和学习笔记',
  path: '/blog',
});

export const revalidate = 3600;

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();
  const categories = getAllCategories();

  // 根据分类筛选文章
  const posts = category ? getPostsByCategory(category) : allPosts;

  // 批量获取阅读量并按阅读量降序排序；阅读量相同则按日期降序
  const slugs = posts.map(p => p.slug);
  const batchViews = await viewsUtils.getBatchArticleViews(slugs);
  const sortedPosts = [...posts].sort((a, b) => {
    const va = batchViews[a.slug] ?? 0;
    const vb = batchViews[b.slug] ?? 0;
    if (vb !== va) return vb - va;
    return a.date > b.date ? -1 : 1;
  });

  // 生成面包屑导航
  const breadcrumbItems = category
    ? [
        { name: '首页', url: '/' },
        { name: '博客', url: '/blog' },
        { name: category, url: `/blog?category=${encodeURIComponent(category)}`, current: true },
      ]
    : [
        { name: '首页', url: '/' },
        { name: '博客', url: '/blog', current: true },
      ];

  return (
    <div className='min-h-screen bg-gradient-to-br via-white from-gray-50/30 to-blue-50/20'>
      {/* JSON-LD: Blog + Breadcrumb */}
      {(() => {
        const blogLd = generateStructuredData('blog');
        const breadcrumbLd = generateStructuredData('breadcrumb', {
          items: [
            { name: '首页', url: '/' },
            { name: '博客', url: '/blog' },
          ],
        });
        return (
          <>
            {blogLd && (
              <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
            )}
            {breadcrumbLd && (
              <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
            )}
          </>
        );
      })()}
      {/* Hero Section */}
      <PageHeader
        badge={{
          text: '技术分享',
          icon: 'pulse',
          color: 'blue',
        }}
        title={category ? `${category}分类` : '博客'}
        description={
          category
            ? `查看${category}分类下的所有技术文章，共${posts.length}篇精选内容`
            : '分享前端开发经验、技术心得和学习笔记，记录技术成长的点点滴滴'
        }
      >
        <div className='inline-flex gap-2 items-center px-6 py-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200 shadow-sm'>
          <span className='h-1.5 w-1.5 rounded-full bg-blue-500'></span>
          {category ? `「${category}」分类` : '全部文章'} · {posts.length} 篇
        </div>
      </PageHeader>

      {/* Main Content */}
      <section className='relative py-12 bg-gradient-to-b to-white from-gray-50/30'>
        <Container size='xl'>
          <div className='px-4 mx-auto max-w-7xl sm:px-6'>
            {/* 面包屑导航 */}
            <div className='mb-8'>
              <Breadcrumb items={breadcrumbItems} />
            </div>

            <div className='flex flex-col gap-6 lg:flex-row lg:gap-6'>
              {/* Sidebar - Category Hierarchy */}
              <aside className='flex-shrink-0 order-2 lg:order-1 lg:w-72 xl:w-80 2xl:w-96'>
                <div className='p-3 bg-white rounded-xl border border-gray-200 shadow-md lg:sticky lg:top-6 lg:p-4'>
                  <CategoryHierarchy categories={categories} currentCategory={category} posts={allPosts} />
                </div>
              </aside>

              {/* Main Content - Blog Posts */}
              <main className='flex-1 order-1 min-w-0 lg:order-2'>
                {posts.length === 0 ? (
                  <div className='py-16 text-center'>
                    <div className='mb-4 text-lg text-gray-400'>
                      {category ? `分类"${category}"下暂无文章` : '暂无文章'}
                    </div>
                    <p className='text-gray-500'>敬请期待更多精彩内容...</p>
                  </div>
                ) : (
                  <>
                    <div className='flex justify-between items-center mb-8'>
                      <h2 className='flex gap-3 items-center text-xl font-bold text-gray-900'>
                        {category ? (
                          <>
                            <span className='text-blue-600'>{category}</span>
                            <span className='inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-sm font-medium text-blue-700'>
                              {posts.length} 篇文章
                            </span>
                          </>
                        ) : (
                          <>
                            <span>全部文章</span>
                            <span className='inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700'>
                              {posts.length} 篇文章
                            </span>
                          </>
                        )}
                      </h2>
                    </div>

                    <div className='grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-2'>
                      {sortedPosts.map((post, index) => (
                        <div key={`${post.slug}-${index}`}>
                          <Card className='group flex h-full transform flex-col border border-gray-200/60 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200/80 hover:shadow-xl hover:shadow-blue-500/10'>
                            <CardHeader className='pb-4'>
                              {/* Category */}
                              <div className='flex gap-2 items-center mb-4'>
                                <div className='flex justify-center items-center w-6 h-6 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm'>
                                  <Tag className='w-3 h-3 text-white' />
                                </div>
                                <Link
                                  href={`/blog?category=${encodeURIComponent(post.category)}`}
                                  className='rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition-all duration-200 hover:from-blue-100 hover:to-indigo-100 hover:shadow-sm'
                                >
                                  {post.category}
                                </Link>
                              </div>

                              {/* Title */}
                              <h3 className='mb-4 text-lg font-bold leading-tight line-clamp-2'>
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className='text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-200 group-hover:from-blue-600 group-hover:to-indigo-600'
                                >
                                  {post.title}
                                </Link>
                              </h3>

                              {/* Meta info */}
                              <div className='flex gap-4 items-center text-xs text-gray-500'>
                                <div className='flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1'>
                                  <Calendar className='h-3.5 w-3.5 text-gray-400' />
                                  <span className='font-medium'>{post.date}</span>
                                </div>
                                <div className='flex items-center gap-1.5 rounded-lg bg-gray-50 px-2 py-1'>
                                  <Clock className='h-3.5 w-3.5 text-gray-400' />
                                  <span className='font-medium'>{post.readingTime}</span>
                                </div>
                                <div className='px-2 py-1 bg-gray-50 rounded-lg'>
                                  <ViewCounter slug={post.slug} size='sm' increment={false} />
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className='grid grow grid-rows-[auto_auto_1fr_auto] gap-4 pt-2'>
                              {/* Description */}
                              <p className='text-sm leading-relaxed text-gray-600 transition-colors duration-200 line-clamp-3 group-hover:text-gray-700'>
                                {post.description}
                              </p>

                              {/* Tags */}
                              <div className='flex flex-wrap gap-2'>
                                {post.tags.slice(0, 2).map(tag => (
                                  <span
                                    key={tag}
                                    className='px-3 py-1 text-xs font-medium text-gray-600 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full border transition-all duration-200 border-gray-200/60 hover:border-blue-200 hover:from-blue-50 hover:to-blue-100 hover:text-blue-700'
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.tags.length > 2 && (
                                  <span className='px-3 py-1 text-xs font-medium text-amber-700 bg-gradient-to-r from-amber-50 to-orange-50 rounded-full border border-amber-200/60'>
                                    +{post.tags.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* Spacer to push the footer button to the bottom consistently */}
                              <div />

                              {/* Read more */}
                              <Link
                                href={`/blog/${post.slug}`}
                                className='group/link inline-flex items-center gap-1 justify-self-end rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/25'
                              >
                                <span>阅读全文</span>
                                <ArrowRight className='w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1' />
                              </Link>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </main>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

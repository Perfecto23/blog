import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { GiscusComments } from '@/components/blog/GiscusComments';
import { RelatedPosts } from '@/components/blog/RelatedPosts';
import { TocControls } from '@/components/blog/TocControls';
import { BlogBreadcrumb } from '@/components/common/Breadcrumb';
import { Container } from '@/components/common/Container';
import { ViewCounter } from '@/components/common/ViewCounter';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { copyScript, renderMarkdown } from '@/lib/markdown';
import { getAllPosts, getPostBySlug } from '@/lib/mdx';
import { generateBlogPostSEO, generateStructuredData } from '@/lib/metadata';

interface BlogPostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ slug: post.slug.split('/') }));
}

export const revalidate = 3600;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathSlug = Array.isArray(slug) ? slug.join('/') : (slug as unknown as string);
  const post = getPostBySlug(pathSlug);

  if (!post) {
    return { title: '文章未找到' };
  }

  return generateBlogPostSEO(post);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const pathSlug = Array.isArray(slug) ? slug.join('/') : (slug as unknown as string);
  const post = getPostBySlug(pathSlug);

  if (!post) {
    notFound();
  }
  // 复用同一批缓存数据，避免在详情页期间触发多次缓存校验/扫描
  const allPosts = getAllPosts();
  const articleStructuredData = generateStructuredData('article', {
    ...post,
    readingTime: post.readingTime,
  });
  const breadcrumbLd = generateStructuredData('breadcrumb', {
    items: [
      { name: '首页', url: '/' },
      { name: '博客', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` },
    ],
  });
  const nonce = (await headers()).get('x-nonce') || undefined;

  const AISummary = dynamic(() => import('@/components/blog/AISummary').then(m => m.AISummary));
  const TableOfContents = dynamic(() => import('@/components/blog/TableOfContents').then(m => m.TableOfContents));

  return (
    <>
      {articleStructuredData && (
        <script
          type='application/ld+json'
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleStructuredData),
          }}
        />
      )}
      {breadcrumbLd && (
        <script
          type='application/ld+json'
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
      )}

      <article className='pt-20 pb-16'>
        <Container size='xl' className='relative'>
          {/* 两栏布局 */}
          <div className='flex gap-6 lg:gap-8 xl:gap-12'>
            {/* 主内容区 */}
            <div className='flex-1 min-w-0'>
              {/* 面包屑导航 */}
              <div className='mb-4'>
                <BlogBreadcrumb category={post.category} title={post.title} slug={post.slug} />
              </div>

              {/* Back Button */}
              <div className='mb-6'>
                <Button variant='ghost' asChild className='text-gray-600 hover:text-gray-900'>
                  <Link href='/blog' className='inline-flex items-center'>
                    <ArrowLeft className='mr-2 w-4 h-4' />
                    返回博客列表
                  </Link>
                </Button>
              </div>

              {/* Article Header */}
              <header className='mb-8'>
                {/* Meta Info */}
                <div className='flex flex-wrap gap-4 items-center mb-6 text-sm text-gray-500'>
                  <div className='flex gap-1 items-center'>
                    <Calendar className='w-4 h-4' />
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  <div className='flex gap-1 items-center'>
                    <Clock className='w-4 h-4' />
                    <span>{post.readingTime}</span>
                  </div>
                  <ViewCounter slug={post.slug} size='md' />
                  <div className='flex gap-2 items-center'>
                    <Tag className='w-4 h-4 text-blue-600' />
                    <Link
                      href={`/blog?category=${encodeURIComponent(post.category)}`}
                      className='px-2 py-1 text-blue-600 bg-blue-50 rounded-full transition-colors hover:bg-blue-100'
                    >
                      {post.category}
                    </Link>
                  </div>
                </div>

                {/* Title */}
                <h1 className='mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl'>{post.title}</h1>

                {/* Tags */}
                <div className='flex flex-wrap gap-2 mb-8'>
                  {post.tags.map((tag, i) => (
                    <Link
                      key={`${tag}-${i}`}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className='px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-full transition-colors hover:bg-gray-200'
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>

                <Separator className='mt-2' />
              </header>

              {/* AI Summary */}
              <AISummary title={post.title} content={post.content || ''} slug={post.slug} />

              {/* Article Content */}
              <div
                id='article-content'
                data-toc-scope='content'
                /* 固定文章内容区域最小高度，减少客户端挂载后因评论/目录出现造成的布局跳动 */
                className='markdown-content prose prose-lg prose-gray prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:text-gray-800 prose-pre:bg-gray-900 prose-blockquote:text-gray-600 prose-a:text-blue-600 hover:prose-a:text-blue-700 min-h-[320px] max-w-none overflow-x-hidden break-words'
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: await renderMarkdown(post.content || '', post.relativePath),
                  }}
                />
              </div>

              {/* Copy Script */}
              <script nonce={nonce} dangerouslySetInnerHTML={{ __html: copyScript }} />

              {/* 相关文章推荐 */}
              <RelatedPosts currentPost={post} allPosts={allPosts} maxPosts={3} />

              {/* 评论 */}
              <GiscusComments className='mt-12' pageTitle={post.title} />

              <Separator className='mt-12 mb-8' />

              {/* Article Footer */}
              <footer className='text-center'>
                <p className='mb-6 text-gray-600'>喜欢这篇文章？欢迎评论区留言！</p>
                <div className='flex gap-4 justify-center'>
                  <Button variant='outline' asChild>
                    <Link href='/blog'>← 查看更多文章</Link>
                  </Button>
                  <Button asChild>
                    <Link href='/about'>了解作者 →</Link>
                  </Button>
                </div>
              </footer>
            </div>

            {/* 目录导航 - 右侧栏 */}
            <div id='toc-aside-wrap' className='hidden lg:block lg:w-72 xl:w-80'>
              <TableOfContents articleTitle={post.title} />
            </div>
          </div>

          {/* 移动端目录导航 */}
          <TableOfContents className='lg:hidden' articleTitle={post.title} />

          {/* 目录侧边控制按钮（仅桌面端显示） */}
          <TocControls />
        </Container>
      </article>
    </>
  );
}

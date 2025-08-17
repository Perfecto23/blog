'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { generateStructuredData } from '@/lib/metadata';

interface BreadcrumbItem {
  name: string;
  url: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

/**
 * 自动生成面包屑导航项
 */
function generateBreadcrumbItems(pathname: string, customItems?: BreadcrumbItem[]): BreadcrumbItem[] {
  if (customItems) {
    return customItems;
  }

  const items: BreadcrumbItem[] = [{ name: '首页', url: '/' }];

  const pathSegments = pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) {
    return items;
  }

  // 处理不同的路径
  if (pathSegments[0] === 'blog') {
    items.push({ name: '博客', url: '/blog' });

    if (pathSegments.length > 1) {
      // 博客文章页面
      items.push({
        name: '文章详情',
        url: pathname,
        current: true,
      });
    }
  } else if (pathSegments[0] === 'about') {
    items.push({
      name: '关于我',
      url: '/about',
      current: true,
    });
  } else {
    // 其他页面
    pathSegments.forEach((segment, index) => {
      const url = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSegments.length - 1;

      items.push({
        name: getSegmentName(segment),
        url,
        current: isLast,
      });
    });
  }

  return items;
}

/**
 * 获取路径段的显示名称
 */
function getSegmentName(segment: string): string {
  const nameMap: Record<string, string> = {
    blog: '博客',
    about: '关于我',
    projects: '项目作品',
    contact: '联系我',
  };

  return nameMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

/**
 * 面包屑导航组件
 * 提供页面层级导航，支持SEO结构化数据
 */
export function Breadcrumb({ items: customItems, className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  const items = generateBreadcrumbItems(pathname, customItems);

  // 生成面包屑结构化数据
  const breadcrumbStructuredData = generateStructuredData('breadcrumb', { items });

  // 如果只有首页，不显示面包屑
  if (items.length <= 1) {
    return null;
  }

  return (
    <>
      {breadcrumbStructuredData && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbStructuredData),
          }}
        />
      )}

      <nav aria-label='面包屑导航' className={`text-sm ${className}`}>
        <ol className='flex items-center space-x-2 text-gray-500'>
          {items.map((item, index) => (
            <li key={item.url} className='flex items-center'>
              {index > 0 && <ChevronRight className='mx-2 h-4 w-4 text-gray-400' aria-hidden='true' />}

              {item.current ? (
                <span className='font-medium text-gray-900' aria-current='page'>
                  {index === 0 && <Home className='mr-1 inline h-4 w-4' aria-hidden='true' />}
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className='transition-colors duration-200 hover:text-gray-700'>
                  {index === 0 && <Home className='mr-1 inline h-4 w-4' aria-hidden='true' />}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

/**
 * 用于博客文章的自定义面包屑
 */
export function BlogBreadcrumb({
  category,
  title,
  slug,
  className = '',
}: {
  category?: string;
  title?: string;
  slug?: string;
  className?: string;
}) {
  const items: BreadcrumbItem[] = [
    { name: '首页', url: '/' },
    { name: '博客', url: '/blog' },
  ];

  if (category) {
    items.push({
      name: category,
      url: `/blog?category=${encodeURIComponent(category)}`,
    });
  }

  if (title && slug) {
    items.push({
      name: title,
      url: `/blog/${slug}`,
      current: true,
    });
  }

  return <Breadcrumb items={items} className={className} />;
}

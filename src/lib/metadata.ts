import type { Metadata } from 'next';
import type { BlogPost } from '@/types';
import { siteConfig } from './data';

// SEO关键词扩展
const additionalKeywords = {
  blog: ['博客', '前端开发', '编程教程', 'Web开发经验'],
  about: ['前端工程师简历', '个人简介', '技术背景'],
  home: ['个人网站', '技术分享', '前端开发者'],
};

// 获取页面特定关键词
function getPageKeywords(path: string, tags?: string[]): string[] {
  const baseKeywords = [...siteConfig.seo.keywords];

  if (path.includes('/blog/')) {
    baseKeywords.push(...additionalKeywords.blog);
  } else if (path === '/about') {
    baseKeywords.push(...additionalKeywords.about);
  } else if (path === '/') {
    baseKeywords.push(...additionalKeywords.home);
  }

  if (tags) {
    baseKeywords.push(...tags);
  }

  return [...new Set(baseKeywords)];
}

export function generateSEO({
  title,
  description,
  image,
  path = '',
  type = 'website',
  publishedTime,
  modifiedTime,
  tags,
  noindex = false,
  category,
  withSiteNameSuffix = true,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  noindex?: boolean;
  category?: string;
  /** 是否在标题后追加站点名，默认 true。文章详情页需要关闭。 */
  withSiteNameSuffix?: boolean;
}): Metadata {
  const seoTitle = title ? (withSiteNameSuffix ? `${title} | ${siteConfig.name}` : title) : siteConfig.title;
  const seoDescription = description || siteConfig.description;
  // 优先使用动态OG图；当没有标题时回落到静态兜底图
  const params = new URLSearchParams({ title: title || siteConfig.title });
  if (category) params.set('badge', category);
  const dynamicOg = `${siteConfig.url}/api/og?${params.toString()}`;
  const seoImage = image || (title ? dynamicOg : '/og-default.svg');
  const url = `${siteConfig.url}${path}`;
  const pageKeywords = getPageKeywords(path, tags);

  const metadata: Metadata = {
    metadataBase: new URL(siteConfig.url),
    title: seoTitle,
    description: seoDescription,
    keywords: pageKeywords,
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    creator: siteConfig.author.name,
    publisher: siteConfig.author.name,
    icons: {
      icon: '/favicon.svg',
      apple: '/favicon.svg',
    },
    alternates: {
      canonical: url,
    },
    verification: {
      google: 'DhzPxbXZA3AtTE2OTTqILI9FwRQVM6PCWDUjaI2LBCo',
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: seoTitle,
        },
      ],
      locale: 'zh_CN',
      type,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: [seoImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    // 添加更多SEO元标签
    other: {
      ...(type === 'article' ? { 'article:author': siteConfig.author.name } : {}),
      ...(type === 'article' && category ? { 'article:section': category } : {}),
      'og:locale:alternate': 'en_US',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'format-detection': 'telephone=no',
      'msapplication-tap-highlight': 'no',
      'theme-color': '#ffffff',
    },
  };

  // Add article-specific metadata
  if (type === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors: [siteConfig.author.name],
      tags,
    };
  }

  return metadata;
}

export function generateBlogPostSEO(post: BlogPost): Metadata {
  return generateSEO({
    title: post.title,
    description: post.description,
    image: post.image,
    path: `/blog/${post.slug}`,
    type: 'article',
    publishedTime: post.date,
    tags: post.tags,
    category: post.category,
    withSiteNameSuffix: false,
  });
}

// 生成分类页面SEO
export function generateCategorySEO(category: string, postCount: number): Metadata {
  return generateSEO({
    title: `${category}分类文章`,
    description: `查看${category}分类下的所有技术文章，共${postCount}篇精选内容`,
    path: `/blog?category=${encodeURIComponent(category)}`,
    type: 'website',
    tags: [category, '技术文章', '分类'],
  });
}

// 生成标签页面SEO
export function generateTagSEO(tag: string, postCount: number): Metadata {
  return generateSEO({
    title: `${tag}标签文章`,
    description: `查看包含${tag}标签的所有技术文章，共${postCount}篇相关内容`,
    path: `/blog?tag=${encodeURIComponent(tag)}`,
    type: 'website',
    tags: [tag, '技术文章', '标签'],
  });
}

export function generateStructuredData(
  type: 'person' | 'article' | 'website' | 'blog' | 'breadcrumb' | 'organization',
  data?: unknown
) {
  const baseUrl = siteConfig.url;

  switch (type) {
    case 'person':
      return {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: siteConfig.author.name,
        url: baseUrl,
        email: siteConfig.author.email,
        jobTitle: '前端工程师',
        description: siteConfig.author.bio,
        worksFor: {
          '@type': 'Organization',
          name: '独立开发者',
        },
        knowsAbout: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Next.js', '前端开发', 'Web开发'],
        address: {
          '@type': 'PostalAddress',
          addressLocality: '深圳',
          addressCountry: 'CN',
        },
        sameAs: Object.values(siteConfig.author.social).filter(Boolean),
      };

    case 'article':
      if (!data || typeof data !== 'object') return null;
      const article = data as {
        title?: string;
        description?: string;
        image?: string;
        date?: string;
        slug?: string;
        category?: string;
        tags?: string[];
        readingTime?: string;
      };
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.title,
        description: article.description,
        image: {
          '@type': 'ImageObject',
          url: article.image ? `${baseUrl}${article.image}` : `${baseUrl}/og-default.svg`,
          width: 1200,
          height: 630,
        },
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.svg`,
            width: 60,
            height: 60,
          },
        },
        datePublished: article.date,
        dateModified: article.date,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${article.slug}`,
        },
        articleSection: article.category,
        keywords: article.tags?.join(', '),
        timeRequired: article.readingTime,
        inLanguage: 'zh-CN',
        isAccessibleForFree: true,
      };

    case 'website':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        description: siteConfig.description,
        url: baseUrl,
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/blog?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        sameAs: Object.values(siteConfig.author.social).filter(Boolean),
        inLanguage: 'zh-CN',
      };

    case 'blog':
      return {
        '@context': 'https://schema.org',
        '@type': 'Blog',
        name: `${siteConfig.name} - 博客`,
        description: '分享前端开发经验、技术心得和学习笔记',
        url: `${baseUrl}/blog`,
        author: {
          '@type': 'Person',
          name: siteConfig.author.name,
          url: baseUrl,
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/favicon.svg`,
          },
        },
        inLanguage: 'zh-CN',
      };

    case 'organization':
      return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: siteConfig.name,
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/favicon.svg`,
        },
        founder: {
          '@type': 'Person',
          name: siteConfig.author.name,
        },
        sameAs: Object.values(siteConfig.author.social).filter(Boolean),
      };

    case 'breadcrumb':
      if (!data || typeof data !== 'object') return null;
      const breadcrumbData = data as {
        items: { name: string; url: string }[];
      };

      // 将相对路径标准化为绝对 URL，满足 Google 对 item/@id 的要求
      // 参考文档：https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
      const ensureAbsoluteUrl = (url: string | undefined): string | undefined => {
        if (!url) return undefined;
        const isAbsolute = url.startsWith('http://') || url.startsWith('https://');
        return isAbsolute ? url : new URL(url, baseUrl).toString();
      };

      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbData.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          // Google 将字符串形式的 item 视为该 ListItem 的标识符（@id），必须是绝对 URL
          item: ensureAbsoluteUrl(item.url),
        })),
      };

    default:
      return null;
  }
}

// 生成FAQ结构化数据
export function generateFAQStructuredData(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// 生成软件应用结构化数据
export function generateSoftwareAppStructuredData(appName: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: appName,
    description,
    url,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
    },
    applicationCategory: 'WebApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CNY',
    },
  };
}

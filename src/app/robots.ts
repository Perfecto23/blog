import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/temp/',
          '/_vercel/',
          '/static/',
          '*.woff',
          '*.woff2',
          '*.ttf',
          '*.eot',
          '*.css',
          '*.js',
          '*.map',
          '*.json',
          '*.ico',
          '*.png',
          '*.jpg',
          '*.jpeg',
          '*.gif',
          '*.svg',
          '*.webp',
          '*.avif',
        ],
        crawlDelay: 1,
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/private/',
          '/admin/',
          '/api/',
          '/_next/',
          '/_vercel/',
          '/static/',
          '*.woff',
          '*.woff2',
          '*.ttf',
          '*.eot',
          '*.css',
          '*.js',
          '*.map',
        ],
        crawlDelay: 0, // Google 爬虫优化，无延迟
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/private/', '/admin/', '/api/'],
      },
      // 明确禁止爬取 www 子域，引导到裸域
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url, // 明确指定首选域名
  };
}

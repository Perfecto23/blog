import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#4F46E5',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'zh-CN',
    categories: ['technology', 'blog', 'frontend'],
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
      // 添加更多移动端图标尺寸
      {
        src: '/images/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: '博客文章',
        short_name: '博客',
        description: '查看最新技术文章',
        url: '/blog',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }],
      },
      {
        name: '关于我',
        short_name: '关于',
        description: '了解作者信息',
        url: '/about',
        icons: [{ src: '/favicon.svg', sizes: '96x96' }],
      },
    ],
  };
}

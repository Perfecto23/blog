import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/data';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/mdx';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();
  const baseUrl = siteConfig.url;
  const currentDate = new Date();

  // 静态页面
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: posts.length > 0 ? new Date(posts[0].date) : currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // 博客文章页面
  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: encodeURI(`${baseUrl}/blog/${post.slug}`),
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // 分类页面
  const categoryPages: MetadataRoute.Sitemap = categories.map(category => {
    const categoryPosts = posts.filter(post => post.category === category);
    const latestPost = categoryPosts[0];

    return {
      url: `${baseUrl}/blog?category=${encodeURIComponent(category)}`,
      lastModified: latestPost ? new Date(latestPost.date) : currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    };
  });

  // 标签页面（只包含文章数量较多的标签）
  const tagPages: MetadataRoute.Sitemap = tags
    .map(tag => {
      const tagPosts = posts.filter(post => post.tags.includes(tag));
      const latestPost = tagPosts[0];

      return {
        tag,
        postCount: tagPosts.length,
        url: `${baseUrl}/blog?tag=${encodeURIComponent(tag)}`,
        lastModified: latestPost ? new Date(latestPost.date) : currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.5,
      };
    })
    .filter(item => item.postCount >= 2) // 只包含至少有2篇文章的标签
    .map(({ tag, url, lastModified, changeFrequency, priority }) => ({
      url,
      lastModified,
      changeFrequency,
      priority,
    }));

  return [...staticPages, ...blogPages, ...categoryPages, ...tagPages];
}

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { log } from '@/lib/logger';
import type { BlogPost } from '@/types';

const contentDirectory = path.join(process.cwd(), 'content');

type MarkdownFileEntry = {
  filePath: string;
  relativePath: string;
  mtimeMs: number;
};

type PostsCache = {
  maxMtimeMs: number;
  files: MarkdownFileEntry[];
  postsBySlug: Map<string, BlogPost>;
  allPosts: BlogPost[];
  categories: string[];
  tags: string[];
};

let cache: PostsCache | null = null;
// 控制是否在运行时持续监听并扫描内容目录：
// - 生产环境默认关闭扫描，仅在首次访问时构建一次缓存，避免每次请求的同步 I/O
// - 通过环境变量 CONTENT_WATCH=1 可在生产开启扫描（例如需要热更新的私有环境）
const isProduction = process.env.NODE_ENV === 'production';
const shouldWatchContent = process.env.CONTENT_WATCH === '1' || !isProduction;

function safeStat(filePath: string): fs.Stats | null {
  try {
    return fs.statSync(filePath);
  } catch {
    return null;
  }
}

function scanMarkdownFiles(dir: string, basePath: string = ''): MarkdownFileEntry[] {
  const results: MarkdownFileEntry[] = [];

  if (!fs.existsSync(dir)) {
    log.warn('内容目录不存在', { dir, action: '获取Markdown文件' });
    return results;
  }

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const itemRelativePath = path.join(basePath, item);
    const stat = safeStat(fullPath);
    if (!stat) continue;

    if (stat.isDirectory() && item !== 'static') {
      results.push(...scanMarkdownFiles(fullPath, itemRelativePath));
    } else if (stat.isFile() && (item.endsWith('.md') || item.endsWith('.mdx'))) {
      results.push({ filePath: fullPath, relativePath: itemRelativePath, mtimeMs: stat.mtimeMs });
    }
  }

  return results;
}

function generateCategoryFromPath(relativePath: string): string {
  const pathParts = path.dirname(relativePath).split(path.sep).filter(Boolean);
  const cleanedParts = pathParts.map(part => part.replace(/^\d+\.\s*/, ''));
  return cleanedParts.length > 0 ? cleanedParts.join('/') : '其他';
}

function slugifySegment(input: string): string {
  return input
    .replace(/^\d+\.\s*/, '')
    .replace(/[^\w\u4e00-\u9fa5]/g, '-')
    .replace(/\-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function generateSlug(relativePath: string): string {
  const parsed = path.parse(relativePath);
  const fileName = parsed.name;
  const category = generateCategoryFromPath(relativePath);
  const categorySegments = category.split('/').filter(Boolean).map(slugifySegment);
  const fileSegment = slugifySegment(fileName);
  return [...categorySegments, fileSegment].filter(Boolean).join('/');
}

function extractDescription(content: string): string {
  const withoutTitle = content.replace(/^#[^\n]*\n/m, '');
  const firstParagraph = withoutTitle
    .split('\n\n')[0]
    .replace(/[#\*\[\]]/g, '')
    .trim()
    .substring(0, 200);
  return firstParagraph || '暂无描述';
}

function extractTitleFromFilename(filename: string): string {
  const parsed = path.parse(filename);
  return parsed.name.replace(/^\d+\.\s*/, '').trim();
}

/**
 * 将 Frontmatter 中的时间字段统一标准化为仅日期字符串（YYYY-MM-DD）。
 * - string：尽量解析为 Date 后取 UTC 的 ISO 日期部分；解析失败则尝试截取 T/空格 前的片段
 * - Date：转为 ISO 字符串后取日期部分（UTC）
 * - 其他：返回 undefined
 */
function normalizeDateInput(input: unknown): string | undefined {
  if (typeof input === 'string') {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().split('T')[0];
    const head = input.trim().split(/[T\s]/)[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(head)) return head;
    return undefined;
  }
  if (input instanceof Date && !Number.isNaN(input.valueOf())) return input.toISOString().split('T')[0];
  return undefined;
}

function getFileDateISO(filePath: string): string {
  const stats = safeStat(filePath);
  if (stats) return stats.mtime.toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}

function parseFileToPost(entry: MarkdownFileEntry): BlogPost | null {
  try {
    const fileContents = fs.readFileSync(entry.filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    const title = (data as Record<string, unknown>).title as string | undefined;
    const description = (data as Record<string, unknown>).description as string | undefined;
    const category = (data as Record<string, unknown>).category as string | undefined;
    const tags = (data as Record<string, unknown>).tags as string[] | undefined;
    const image = (data as Record<string, unknown>).image as string | undefined;
    const date = normalizeDateInput((data as Record<string, unknown>).date);

    const computedCategory = category || generateCategoryFromPath(entry.relativePath);
    const slug = generateSlug(entry.relativePath);

    return {
      slug,
      title: title || extractTitleFromFilename(entry.relativePath),
      description: description || extractDescription(content),
      date: date || getFileDateISO(entry.filePath),
      category: computedCategory,
      tags: Array.isArray(tags) ? tags : [],
      image: image ?? undefined,
      readingTime: stats.text,
      content,
      relativePath: entry.relativePath,
    };
  } catch (error) {
    log.warn('解析Markdown失败', { file: entry.filePath, action: '解析Markdown' });
    return null;
  }
}

function rebuildCache(): PostsCache {
  const startTime = Date.now();
  const files = scanMarkdownFiles(contentDirectory);
  const maxMtimeMs = files.reduce((max, f) => Math.max(max, f.mtimeMs), 0);

  const posts = files
    .map(parseFileToPost)
    .filter((p): p is BlogPost => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  const postsBySlug = new Map<string, BlogPost>();
  for (const post of posts) postsBySlug.set(post.slug, post);

  const categories = Array.from(new Set(posts.map(p => p.category))).filter(Boolean);
  const tags = Array.from(new Set(posts.flatMap(p => p.tags))).filter(Boolean);

  log.performance('构建内容缓存', startTime, { files: files.length, posts: posts.length });

  return { maxMtimeMs, files, postsBySlug, allPosts: posts, categories, tags };
}

function ensureCache(): void {
  // 首次调用时始终构建缓存（避免 cache 为空）
  if (!cache) {
    cache = rebuildCache();
    return;
  }

  // 非监听模式（生产默认）：跳过扫描，直接复用已有缓存
  if (!shouldWatchContent) {
    return;
  }

  // 监听模式（开发 / 显式开启）：按需扫描并在内容变化时重建缓存
  const files = scanMarkdownFiles(contentDirectory);
  const maxMtimeMs = files.reduce((max, f) => Math.max(max, f.mtimeMs), 0);
  if (cache.maxMtimeMs !== maxMtimeMs || cache.files.length !== files.length) {
    cache = rebuildCache();
  }
}

export function getPostSlugs(): string[] {
  ensureCache();
  return cache!.allPosts.map(p => p.slug);
}

export function getPostBySlug(slug: string): BlogPost | null {
  ensureCache();
  const decoded = decodeURIComponent(slug);
  const post = cache!.postsBySlug.get(slug) || cache!.postsBySlug.get(decoded) || null;
  if (!post) {
    log.debug('文章未找到', { slug, decodedSlug: decoded, action: '查找文章' });
  }
  return post;
}

export function getAllPosts(): BlogPost[] {
  ensureCache();
  return cache!.allPosts;
}

export function getPostsByCategory(category: string): BlogPost[] {
  ensureCache();
  // 支持“包含子分类”的查询：当前分类或其任意下级分类都应被匹配
  const normalize = (c: string) => c.trim().replace(/\/+$/g, '').toLowerCase();
  const target = normalize(category);
  return cache!.allPosts.filter(post => {
    const c = normalize(post.category);
    return c === target || c.startsWith(`${target}/`);
  });
}

export function getPostsByTag(tag: string): BlogPost[] {
  ensureCache();
  return cache!.allPosts.filter(post => post.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

export function getAllCategories(): string[] {
  ensureCache();
  return cache!.categories;
}

export function getAllTags(): string[] {
  ensureCache();
  return cache!.tags;
}

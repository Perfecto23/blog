# 项目上下文信息

## 基本信息

- **项目名称**: blog（个人技术网站 - 柯芃丞）
- **技术栈**: Next.js 15 (App Router) + React 19 + TypeScript 5 + Tailwind CSS 4 + Shadcn UI + Radix UI + Lucide Icons
- **内容来源**: `content/` 目录下的 `.md/.mdx` 文件（多级目录，带数字前缀用于排序与分组）
- **语言与站点**: 中文为主（`<html lang="zh-CN">`），站点地址取自 `siteConfig.url`（当前为 `https://itmirror.top`）

## 目录与页面

- `src/app/`
  - `page.tsx` 首页（`Hero`、`BlogPreview`、`AboutPreview`、`ContactCTA`）
  - `about/page.tsx` 关于页（结构化数据 Person + 页面段落/卡片展示）
  - `blog/page.tsx` 博客列表页（分类筛选、`CategoryHierarchy`、文章卡片、`ViewCounter`）
  - `blog/[slug]/page.tsx` 文章详情页（`generateMetadata` 基于文章，`AISummary`、`TableOfContents`、`RelatedPosts`、`ViewCounter`、Markdown 渲染）
  - `robots.ts`、`sitemap.ts`、`manifest.ts`（SEO 相关元数据路由）
- `src/components/` 常用组件（`blog/`、`common/`、`layout/`、`ui/`）
- `src/lib/` 工具与业务核心（`mdx.ts`、`markdown.ts`、`metadata.ts`、`analytics.ts`、`redis-adapter.ts` 等）
- `src/styles/markdown.css` Markdown 渲染样式（极简苹果风格）

## 内容与渲染管线

- `lib/mdx.ts`
  - 递归扫描 `content/`，排除 `static/` 子目录
  - 基于相对路径生成 `category`（剥离数字前缀），`slug` 使用“清洗后的文件名 + 路径Base64哈希后缀”保证唯一
  - 通过 `gray-matter` 解析 Frontmatter，缺省值自动从文件名/内容/mtime 推导
  - 计算 `readingTime`，并按日期倒序排序
- `lib/markdown.ts`
  - 使用 `marked` + `highlight.js` 自定义渲染：
    - 标题自动生成锚点 id
    - 代码块语言显示 + 复制按钮（内联 `copyScript`）
    - 链接内外部区分，外链添加安全属性
    - 图片：相对路径自动映射为 `/content/...`（结合 `next.config.ts` 的 rewrites 与 `api/content/[...path]` 静态代理）

## SEO 与结构化数据

- `lib/metadata.ts`：统一 `generateSEO`、`generateBlogPostSEO`、`generateStructuredData`
  - 页面/文章 `generateMetadata` 全量走该工具，提供 canonical、Open Graph、Twitter、Robots 等
  - 结构化数据类型：`person`、`article`、`website`、`blog`、`breadcrumb`、`organization`、FAQ/SoftwareApp 辅助生成函数
- `robots.ts`、`sitemap.ts`：基于站点与内容生成 Robots 与 Sitemap（分类与标签页纳入，标签需数量阈值≥2）

## 数据与统计

- 浏览量统计：`redis-adapter.ts` 适配 Upstash Redis，未配置时本地内存模拟；API：
  - `GET /api/views/get` 支持单篇/批量/站点统计
  - `POST /api/views/increment` 递增文章/站点/今日访问量
- 客户端组件 `ViewCounter`：先查再增，使用 `sessionStorage` 避免会话内重复计数

## 分析与性能

- Google Analytics：`lib/analytics.ts` + `AnalyticsProvider`（页面浏览、Web Vitals、行为事件）
- 中间件 `src/middleware.ts`：安全/性能响应头；/blog 预加载关键字体；静态资源强缓存；API 路由 no-store
- `next.config.ts`：MDX 支持、包导入优化、CSS 优化、图片优化、全局安全/缓存 Header、内容重写 `/content/:path* → /api/content/:path*`

## 环境变量（关键）

- `ARK_API_KEY`（AI 摘要）
- `NEXT_PUBLIC_GA_ID`（Google Analytics）
- `UPSTASH_REDIS_REST_URL`、`UPSTASH_REDIS_REST_TOKEN`（访问量统计）
- `ALLOW_RESET_VIEWS`（开发下重置统计许可）

## 版本与构建

- `next` 15.4.5、`react` 19.1.0、`tailwindcss` 4、`highlight.js` 11、`marked` 16
- `pnpm` 包管理；`dev --turbopack` 开发；`build:analyze` 支持 Bundle 分析

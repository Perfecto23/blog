# 常用模式和最佳实践

## 架构与数据流

- **RSC 优先**：大部分页面为服务端组件；仅交互性组件标注 `'use client'`（如 `AnalyticsProvider`、`ViewCounter`、`AISummary`、`TableOfContents`）。
- **纯函数式与工具模块化**：`lib/` 中将 SEO、Markdown、统计、日志、数据源等拆分为独立纯函数，避免全局副作用。
- **内容即数据源**：以 `content/` 文件系统为数据源；通过路径推导 `category`，文件名/内容/mtime 推导元信息，确保少配置可运行。

## SEO 策略

- 统一通过 `generateSEO`/`generateBlogPostSEO` 输出 `Metadata`，每页声明 `export const metadata` 或 `generateMetadata`。
- 使用 `generateStructuredData` 输出 JSON-LD（文章、站点、人物、面包屑等），在页面 `<head>` 内以 script 注入。
- `robots.ts`/`sitemap.ts`：自动化 robots 规则与站点地图，分类与标签页动态纳入。

## Markdown/MDX 渲染

- `marked` + `highlight.js` 定制：
  - 标题自动生成稳定 id，避免目录/锚点抖动。
  - 代码块显示语言、复制按钮、语法高亮失败兜底。
  - 相对路径图片自动重写为 `/content/...` 并懒加载，SSR 友好。
- `markdown.css`：移动优先、明暗模式适配、苹果风格排版。

## 访问量与分析

- 访问量 API：先查后增，`sessionStorage` 同会话去重；未配置 Upstash 则本地内存模拟不中断功能。
- `AnalyticsProvider`：路由变化触发 pageview、Web Vitals 上报；`middleware` 添加性能/安全头与缓存策略。

## 安全与性能

- `next.config.ts` 与 `middleware.ts`：
  - 安全头：`X-Content-Type-Options`、`X-Frame-Options`、`X-XSS-Protection`。
  - 静态资源强缓存；API 路由 `no-store`；博客字体 preload。
- 图片优化：`next/image`，指定 `width/height` 或 `fill`，合理 `sizes`，支持 `WebP/AVIF`。
- 代码分割：仅在需要时动态加载；包导入优化 `experimental.optimizePackageImports`。

## UI/UX

- Tailwind 4 + Shadcn UI + Radix UI；`cn()` 合并类名确保 SSR/CSR 一致性，避免 hydration 问题。
- 移动端优先：自适应断点、触控目标、排版间距；目录组件提供移动端浮动入口与平滑滚动。

## 日志与错误

- 统一日志 `lib/logger.ts`：DEBUG/INFO/WARN/ERROR；生产环境客户端静默，服务端保留。
- API 错误兜底：避免统计/AI 失败影响页面渲染，返回用户友好的错误提示。

## 命名与可维护性

- 文件夹使用小写短横线；组件与函数使用完整语义命名；避免 1-2 字母短名；导出类型集中在 `src/types`。

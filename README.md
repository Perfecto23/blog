# 个人网站

基于 Next.js 15 的个人网站，包含博客系统、AI 摘要、访问量统计、结构化数据与完善的 SEO/性能策略。

## 功能特性与实现方案

### 内容系统（Markdown → HTML，服务端渲染）

- 数据源：`content/` 目录，按多级文件夹组织分类与主题。
- 解析：`src/lib/mdx.ts` 读取文件、Frontmatter、文件修改时间，产出稳定的 `BlogPost` 数据结构（包含标题、描述、日期、分类、标签、slug 等）。
- 渲染：`src/lib/markdown.ts` 在服务端完成 Markdown 渲染。
  - 标题自动生成稳定 `id`，避免锚点抖动。
  - 代码高亮（highlight.js）+ 代码块复制按钮。
  - 相对路径图片自动重写为 `/content/...`，保证 SSR 与懒加载友好。
- 目录（TOC）：`src/components/blog/TableOfContents.tsx` 使用 IntersectionObserver 跟随阅读进度，移动端为抽屉式。

### SEO（Metadata + JSON-LD，全站统一）

- 统一方法：`src/lib/metadata.ts` 导出 `generateSEO`、`generateBlogPostSEO`、`generateStructuredData`。
  - 首页、关于、博客列表、文章详情分别调用，确保每页唯一的 title/description/canonical/OG/Twitter/Robots/Keywords。
  - JSON-LD 覆盖 `website`、`person`、`blog`、`article`、`breadcrumb`。
- 页面接入：
  - 布局：`src/app/layout.tsx` 注入 `website` 级 JSON-LD，CSP Nonce 由 `middleware` 提供。
  - 首页：`src/app/page.tsx` 使用 `generateSEO({ path: '/' })` + 注入 `person` JSON-LD，`revalidate = 60`。
  - 文章详情：`src/app/blog/[...slug]/page.tsx` 使用 `generateBlogPostSEO(post)` 并注入 `article`、`breadcrumb` JSON-LD，`revalidate = 3600`。

### 访问量统计（Upstash Redis 或本地内存模拟）

- API：
  - 查询：`GET /api/views/get`（支持文章单查、批量、站点总计/今日）。
  - 递增：`POST /api/views/increment`（过滤常见爬虫，IP+UA+Slug 维度 60s 节流）。
- 存储与工具：`src/lib/redis-adapter.ts`
  - 生产默认连接 Upstash Redis；本地未配置时自动回落到 `LocalRedis`（内存 Map，便于联调）。
  - 导出 `viewsUtils`：`increment/getArticleViews`、`increment/getSiteViews`、`increment/getTodayViews`、`getRecentViews`。
- 首屏展示（SSR）：`src/components/sections/Hero.tsx` 直接读取 `siteViews` 与 `todayViews`，首页首屏实时展示。
- 文章阅读数（CSR）：`src/components/common/ViewCounter.tsx` 客户端组件，先查后增；使用 `sessionStorage` 去重，失败兜底为 0，不阻断主渲染。

### 性能优化（极致页面速度）

- RSC 优先：页面与大部分组件默认服务端渲染，减少客户端 JS 体积与 Hydration 压力。
- 代码分割：`dynamic()` 按需加载交互性组件（如 `AISummary`、`TableOfContents`）。
- 静态化与缓存：
  - 页面 `revalidate`：首页 60s，文章页 3600s。
  - `src/middleware.ts`：静态资源强缓存（immutable），API `no-store`，CSP/HSTS/安全头；注入 CSP Nonce，保障脚本安全执行。
  - `next.config.ts`：`optimizePackageImports`、`optimizeCss`、压缩与响应头策略；`next/image` 指定 `formats/sizes/remotePatterns`。
- 图片优化：`next/image`，使用 AVIF/WebP，提供 `width/height` 或 `fill` 与合理 `sizes`。
- 分析与监控：`src/lib/analytics.ts` 与 `AnalyticsProvider`，路由变化上报与 Web Vitals。



## 目录结构（摘录）

```
src/
├── app/
│   ├── page.tsx                   # 首页（SSR 首屏展示站点访问量，注入 person JSON-LD）
│   ├── blog/[...slug]/page.tsx    # 文章详情（RSC + 动态 TOC + ViewCounter）
│   ├── api/views/get/route.ts     # 访问量查询 API
│   ├── api/views/increment/route.ts# 访问量递增 API（防刷 + 节流）
│   ├── layout.tsx                 # Root layout（Website JSON-LD + GA + 安全头配合）
│   └── globals.css                # 全局与 Markdown 派生样式
├── components/
│   ├── sections/Hero.tsx          # 首页首屏，SSR 读取站点访问量
│   ├── common/ViewCounter.tsx     # 文章阅读数（客户端组件）
│   └── blog/TableOfContents.tsx   # 目录组件（IntersectionObserver）
├── lib/
│   ├── mdx.ts                     # 内容读取/解析
│   ├── markdown.ts                # 服务端渲染 Markdown
│   ├── metadata.ts                # SEO 与 JSON-LD 统一生成
│   ├── redis-adapter.ts           # Upstash/LocalRedis 适配 + 统计工具
│   └── analytics.ts               # 分析与性能上报
└── styles/markdown.css            # Markdown 样式（移动端优化）
```



## 开发与本地环境

### 环境要求

- Node.js ≥ 22
- pnpm ≥ 10

### 安装与启动

```bash
pnpm install
pnpm dev          # 开发模式
pnpm build        # 生产构建
pnpm start        # 启动服务器
```

安装后会自动生成 `.env.example` 与 `.env.local`（若不存在）：

- `.env.example`：模板，包含所有必填键
- `.env.local`：本地变量文件，若已有则自动补全缺失键，不覆盖既有值

### 常用命令

```bash
pnpm lint         # 代码检查
pnpm type-check   # 类型检查
pnpm format       # 代码格式化
pnpm clean        # 清理构建文件
```

### 本地开发说明

- 未配置 Upstash Redis 时自动使用内存型 LocalRedis（仅本地，不持久化）。
- 访问量 API 在本地可用，便于联调；文章首次渲染不会因统计失败而报错。

### 环境变量（必填，分两类）

所有下列变量均必填；请根据作用范围分别配置到 GitHub Actions 与 Vercel。切勿将任何实际密钥提交到仓库。

GitHub Actions（仓库 Settings > Secrets and variables > Actions）：

```bash
FEISHU_APP_ID="<your_app_id>" # 飞书应用的app_id（飞书应用的app_id）
FEISHU_APP_SECRET="<your_app_secret>" # 飞书应用的app_secret（飞书应用的app_secret）
FEISHU_SPACE_ID="<your_space_id>" # 飞书空间的space_id（知识库的id）
FEISHU_WIKI_URL="<your_wiki_url>" # 飞书wiki的url（知识库中某个文档的url）
```

Vercel（Project Settings > Environment Variables）：

```bash
ARK_API_KEY="<your_ark_api_key>"                # AI 摘要需要调用火山引擎的API
NEXT_PUBLIC_SITE_URL="https://your-domain.com"  # 用于分享链接、OG 等，必须为完整站点域名
NEXT_PUBLIC_GA_ID="<your_ga_id>"                # Google Analytics的ID
UPSTASH_REDIS_REST_URL="<your_redis_url>"      # Upstash Redis的URL
UPSTASH_REDIS_REST_TOKEN="<your_redis_token>"  # Upstash Redis的Token
```

注意：

- `NEXT_PUBLIC_SITE_URL` 应与最终对外域名完全一致（使用 Cloudflare 代理时，填写 Cloudflare 上暴露给用户的域名）。



## 部署

### Vercel（推荐）

1. 连接 GitHub 仓库
2. 在 Project Settings > Environment Variables 配置：
   - `NEXT_PUBLIC_SITE_URL`
   - `ARK_API_KEY`
   - `NEXT_PUBLIC_GA_ID`
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3. 触发部署

### Upstash Redis 设置

1. 在 Upstash Console 创建 Redis 数据库
2. 复制 REST URL 与 Token 到环境变量

### 生产注意事项

- 必须提供 Upstash 配置，否则生产环境会拒绝启动（参见 `redis-adapter.ts`）。
- 必须提供 `NEXT_PUBLIC_SITE_URL` 且与站点真实域名一致。
- 若开启 GA，请保证 CSP 允许 `googletagmanager`/`google-analytics`（已在 `middleware.ts` 中处理）。



## Cloudflare 代理与边缘加速

本项目在 Vercel 部署后，可通过 Cloudflare 做代理与边缘加速，推荐架构：用户 → Cloudflare → Vercel（Next.js）。

### 1) DNS 与证书

- 在 Cloudflare 的 DNS 面板为你的自定义域添加 CNAME 记录，指向 Vercel 分配的域名（如 `<project>.vercel.app`），启用橙云代理。
- SSL/TLS 模式请选择 Full (strict)。
- 开启 Always Use HTTPS、HTTP/2、HTTP/3 (QUIC)、0-RTT（可选）。
- 已在源站通过 `middleware.ts` 设置 HSTS，如在 Cloudflare 也开启 HSTS，请确保策略一致，避免重复配置导致意外行为。

### 2) 缓存策略（关键）

- HTML/SSR 页面：不要在 Cloudflare 对 HTML 做“缓存一切”，保持“遵循源站缓存头”。Next.js 通过 `revalidate` 控制 ISR，避免与 CDN 缓存冲突。
- 静态资源：对 `/_next/static/*`、`/static/*`、常见图片格式设置长效缓存（immutable）。本仓库已在 `middleware.ts` 与 `next.config.ts` 设置 Cache-Control，你可在 Cloudflare 新建 Cache Rules：
  - If: Path matches `/_next/static/*` → Cache Level: Cache Everything → Edge TTL: 1 year；Browser TTL: Respect Existing Headers。
  - If: File extension in `jpg,jpeg,png,svg,webp,avif,ico` → 同上。
- 压缩与加速：开启 Brotli、Early Hints、Tiered Cache（如可用）。不要启用会改写 HTML 的“自动优化/注入脚本”（例如 Rocket Loader），以免影响 React Hydration。

### 3) 真实客户端 IP（防刷与统计准确性）

访问量 API 使用 `x-forwarded-for`/`x-real-ip` 获取 IP。若经 Cloudflare 代理，Cloudflare 会提供 `CF-Connecting-IP` 头；当前实现已优先读取标准头，若需更精准可在自有边缘函数或中间件中写回该头到 `x-real-ip`。UA 维度已进行爬虫过滤，与 Cloudflare 的 Bot 管理可互补。

### 4) 其它建议

- 不要在 Cloudflare 缓存 API 路由（`/api/*`）；本仓库已在中间件对 API 设置 `no-store`。
- 若使用 Cloudflare Images/Polish 与 Next.js `next/image` 重叠，建议择一，避免重复优化。
- 页面变更通常无需在 Cloudflare 手动清缓存，因为 HTML 不走边缘缓存；静态资源采用指纹文件名，天然可缓存。


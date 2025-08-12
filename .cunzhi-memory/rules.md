# 开发规范和规则

## 代码风格

- TypeScript 全量开启 `strict`；函数与导出显式类型标注；避免 `any`。
- 函数式与声明式为先；避免类；多用纯函数与不可变数据。
- 命名语义化：函数动词短语，变量名为名词短语，如 `isLoading`、`hasError`、`generateSEO`。

## 目录与组件

- 目录名使用小写短横线；按 `app/`、`components/`、`lib/`、`styles/`、`types/` 分层。
- 客户端组件显式 `'use client'`；尽量把逻辑下沉到 RSC 或 `lib/`。

## 数据与渲染

- 内容数据仅来自 `content/`；不要在客户端直接读文件系统。
- Markdown 渲染统一走 `lib/markdown.ts`；图片相对路径必须通过内容代理 `/api/content`。

## SEO 与可访问性

- 页面元数据通过 `generateMetadata`/`generateSEO` 生成；保持 `canonical`、OG、Twitter 完整。
- 合理使用语义化标签 `<main>`、`<article>`、`<nav>`；为交互元素提供可见文本与 `aria-*`。

## 性能与缓存

- 静态资源最长缓存；API 默认 `no-store`；关键字体预加载；图片声明 `sizes/width/height` 或 `fill`。
- 仅在必要时使用客户端状态与副作用；避免不稳定类名组合导致 hydration 差异。

## 日志与错误

- 统一使用 `lib/logger.ts`；生产环境客户端默认不输出。
- API 路由需做输入验证与错误兜底；不要阻塞渲染路径。

## 测试与质量

- ESLint 规则：`react/jsx-key`、`react-hooks/rules-of-hooks` 等必须通过；导入顺序与去重。
- Prettier 保持格式；`pnpm check-all` 在提交前通过（类型、lint、格式）。

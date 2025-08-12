# 用户偏好设置

- **语言**: 中文输出为默认，文案专业简洁。
- **技术栈倾向**: TypeScript、Next.js、Tailwind、Shadcn UI、Radix UI；尽量采用 RSC/SSR/SSG。
- **内容组织**: 移动优先设计；组件划分清晰；避免复杂副作用，偏好纯函数与工具层。
- **SEO**: 每页提供唯一 `title/description/canonical` 与 Open Graph；需要时添加 JSON-LD。
- **性能**: 图片优化、强缓存、仅必要的客户端组件；减少 `useEffect` 与全局状态。
- **可维护性**: 变量/函数命名语义化；早返回与卫语句；统一日志与错误处理；避免注释噪音。

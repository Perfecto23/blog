'use client';

import { useEffect, useRef } from 'react';

interface GiscusCommentsProps {
  /** 当前页面标题，可用于动态映射（可选） */
  pageTitle?: string;
  className?: string;
}

/**
 * Giscus 评论组件（基于官方 script 注入）
 * - 使用 GitHub Discussions 承载评论
 * - 懒加载脚本，避免阻塞首屏
 */
export function GiscusComments({ className = '', pageTitle }: GiscusCommentsProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasInjectedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || hasInjectedRef.current) return;
    hasInjectedRef.current = true;

    const scriptEl = document.createElement('script');
    scriptEl.src = 'https://giscus.app/client.js';
    scriptEl.async = true;
    scriptEl.crossOrigin = 'anonymous';

    // 固定亮色主题，移除不必要的主题判断
    scriptEl.setAttribute('data-repo', 'Perfecto23/blog');
    scriptEl.setAttribute('data-repo-id', 'R_kgDOPcghkQ');
    scriptEl.setAttribute('data-category', 'Announcements');
    scriptEl.setAttribute('data-category-id', 'DIC_kwDOPcghkc4CuFGW');
    scriptEl.setAttribute('data-mapping', 'title');
    scriptEl.setAttribute('data-strict', '0');
    scriptEl.setAttribute('data-reactions-enabled', '1');
    scriptEl.setAttribute('data-emit-metadata', '0');
    scriptEl.setAttribute('data-input-position', 'top');
    scriptEl.setAttribute('data-theme', 'preferred_color_scheme');
    scriptEl.setAttribute('data-lang', 'zh-CN');
    scriptEl.setAttribute('data-loading', 'lazy');

    if (pageTitle) {
      scriptEl.setAttribute('data-term', pageTitle);
    }

    container.appendChild(scriptEl);

    return () => {
      container.innerHTML = '';
    };
  }, [pageTitle]);

  return (
    <section id='comments' className={`mt-12 ${className}`} aria-label='评论区' suppressHydrationWarning>
      <div
        ref={containerRef}
        className='[&_.giscus]:!m-0 [&_.giscus]:!w-full [&_.giscus]:!p-0 [&_.giscus-frame]:!min-h-[460px] [&_.giscus-frame]:!w-full'
      />
    </section>
  );
}

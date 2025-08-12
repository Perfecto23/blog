'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Hash, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { log } from '@/lib/logger';

interface TocItem {
  id: string;
  title: string;
  level: number;
  element: HTMLElement;
  numbering?: string;
}

interface TableOfContentsProps {
  className?: string;
  articleTitle?: string;
}

/**
 * 文章目录组件 - 优化版本
 * 特点：
 * 1. 纯CSS实现高度限制，避免JavaScript闪动
 * 2. 简化的滚动跟随逻辑，减少抖动
 * 3. 柔和动画效果
 */
export function TableOfContents({ className = '', articleTitle }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [tocContainerRef, setTocContainerRef] = useState<HTMLDivElement | null>(null);

  // 滚动状态管理
  const lastScrollTime = useRef(0);
  const isAutoScrolling = useRef(false);
  const updateTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  /**
   * 提取页面标题并生成目录结构
   * 过滤掉不需要的章节，为每个标题生成唯一ID
   */
  const generateToc = useCallback(() => {
    // 优先在文章内容容器内获取标题，避免抓取整页其他区域的标题
    const contentRoot =
      document.getElementById('article-content') || document.querySelector('[data-toc-scope="content"]');

    if (!contentRoot) {
      setTocItems([]);
      log.warn('未找到文章内容容器，目录未生成', undefined, { component: 'TableOfContents' });
      return;
    }

    // 限制目录仅收集两级标题：h2 与 h3（仅在正文容器内）
    const headings = contentRoot.querySelectorAll('h2, h3');
    const items: TocItem[] = [];
    let h2Index = 0;
    let h3Index = 0;
    let firstLevel: number | null = null; // 用于识别页面中第一层级（h2 或 h3）

    headings.forEach((heading, index) => {
      const element = heading as HTMLElement;
      const level = parseInt(element.tagName.charAt(1));
      if (firstLevel === null) {
        firstLevel = level;
      }
      const title = element.textContent?.trim() || '';

      // 仅在正文范围抓取，不再额外按关键字排除
      if (!title) return;

      // 为标题生成或获取ID
      let id = element.id;
      if (!id) {
        // 生成基于标题内容的ID
        id = title
          .toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-|-$/g, '')
          .substring(0, 50);

        // 确保ID唯一
        let uniqueId = id;
        let counter = 1;
        while (document.getElementById(uniqueId)) {
          uniqueId = `${id}-${counter}`;
          counter++;
        }

        element.id = uniqueId;
        id = uniqueId;
      }

      // 计算层级编号：h2 => 1,2,3...  h3 => 1.1, 1.2 ...
      let numbering: string | undefined;
      if (level === 2) {
        h2Index += 1;
        h3Index = 0;
        numbering = `${h2Index}`;
      } else if (level === 3) {
        h3Index += 1;
        numbering = `${h2Index || 1}.${h3Index}`;
      }

      items.push({ id, title, level, element, numbering });
    });

    setTocItems(items);
    log.debug('目录生成完成', { count: items.length }, { component: 'TableOfContents' });
  }, []);

  /**
   * 平滑滚动到指定标题
   * @param id 标题元素的ID
   */
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80; // 头部导航栏高度
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // 标记为自动滚动，防止触发目录跟随
      isAutoScrolling.current = true;
      lastScrollTime.current = Date.now();

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // 滚动完成后重置标记
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 1000);

      log.userAction('点击目录项', { headingId: id, headingText: element.textContent });

      // 移动端关闭菜单
      if (window.innerWidth < 1024) {
        setIsOpen(false);
      }
    } else {
      log.warn('目录锚点元素未找到', { headingId: id }, { component: 'TableOfContents' });
    }
  }, []);

  /**
   * 滚动目录到活跃项可见位置
   * 确保当前阅读的章节在目录中可见
   * @param activeId 当前活跃的标题ID
   */
  const scrollToActiveItem = useCallback(
    (activeId: string) => {
      if (!tocContainerRef || !activeId || isAutoScrolling.current) return;

      const activeButton = tocContainerRef.querySelector(`button[data-heading-id="${activeId}"]`);
      if (!activeButton) return;

      const container = tocContainerRef;
      const containerHeight = container.clientHeight;
      const containerScrollTop = container.scrollTop;

      const buttonOffsetTop = (activeButton as HTMLElement).offsetTop;
      const buttonHeight = (activeButton as HTMLElement).offsetHeight;

      // 计算目标滚动位置：让活跃项显示在容器的中央
      const targetScrollTop = buttonOffsetTop - containerHeight * 0.4;

      // 检查是否需要滚动 - 增加容差范围避免抖动
      const tolerance = 100;
      const isAboveView = buttonOffsetTop < containerScrollTop + tolerance;
      const isBelowView = buttonOffsetTop + buttonHeight > containerScrollTop + containerHeight - tolerance;

      if (isAboveView || isBelowView) {
        container.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth',
        });

        log.debug('目录自动滚动', {
          activeId,
          buttonOffsetTop,
          containerScrollTop,
          targetScrollTop,
          reason: isAboveView ? 'above-view' : 'below-view',
        });
      }
    },
    [tocContainerRef]
  );

  /**
   * 监听页面滚动，更新活跃章节
   * 使用IntersectionObserver实现高性能的章节检测
   */
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      entries => {
        // 如果正在自动滚动，跳过更新
        if (isAutoScrolling.current) return;

        // 找到最接近视口顶部的可见元素
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        if (visibleEntries.length === 0) return;

        // 选择距离视口顶部最近的元素
        let closestEntry = visibleEntries[0];
        let minDistance = Math.abs(visibleEntries[0].boundingClientRect.top);

        for (const entry of visibleEntries) {
          const distance = Math.abs(entry.boundingClientRect.top);
          if (distance < minDistance) {
            minDistance = distance;
            closestEntry = entry;
          }
        }

        const newActiveId = closestEntry.target.id;
        if (newActiveId && newActiveId !== activeId) {
          // 使用防抖避免频繁更新
          if (updateTimeout.current) {
            clearTimeout(updateTimeout.current);
          }

          updateTimeout.current = setTimeout(() => {
            setActiveId(newActiveId);

            // 延迟一段时间后自动滚动目录
            setTimeout(() => {
              const timeSinceLastScroll = Date.now() - lastScrollTime.current;
              if (timeSinceLastScroll > 300) {
                // 用户停止滚动300ms后才自动跟随
                scrollToActiveItem(newActiveId);
              }
            }, 200);
          }, 100);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px', // 调整观察区域
        threshold: 0.1,
      }
    );

    // 监听页面滚动，记录滚动时间
    const handlePageScroll = () => {
      lastScrollTime.current = Date.now();
    };

    window.addEventListener('scroll', handlePageScroll, { passive: true });

    // 观察所有标题元素
    tocItems.forEach(item => {
      if (item.element) {
        observer.observe(item.element);
      }
    });

    return () => {
      window.removeEventListener('scroll', handlePageScroll);
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
      tocItems.forEach(item => {
        if (item.element) {
          observer.unobserve(item.element);
        }
      });
    };
  }, [tocItems, activeId, scrollToActiveItem]);

  /**
   * 页面加载后生成目录
   */
  useEffect(() => {
    log.component('TableOfContents', '组件挂载', { articleTitle });

    // 延迟执行，确保DOM已完全渲染
    const timer = setTimeout(() => {
      generateToc();
    }, 100);

    return () => {
      clearTimeout(timer);
      log.component('TableOfContents', '组件卸载', { articleTitle });
    };
  }, [generateToc, articleTitle]);

  // 如果没有标题或标题太少，不渲染组件
  if (tocItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* 移动端切换按钮 */}
      <div className='fixed right-6 bottom-6 z-50 flex flex-col gap-3 lg:hidden'>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size='icon'
          className='h-12 w-12 rounded-xl bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:shadow-xl'
          aria-label='切换目录'
          aria-expanded={isOpen}
          aria-controls='toc-nav-panel'
        >
          {isOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
        </Button>
        <a
          href='#comments'
          aria-label='跳转到评论区'
          className='grid h-12 w-12 place-items-center rounded-xl border border-gray-200 bg-white/90 text-gray-700 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <path d='M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z' />
          </svg>
        </a>
      </div>

      {/* 目录导航 - 使用纯CSS实现响应式高度限制 */}
      <nav
        role='navigation'
        aria-labelledby='toc-title'
        className={`toc-container ${className} ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } fixed top-20 right-0 z-40 h-auto max-h-[calc(100vh-6rem)] w-80 transform bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:w-72 lg:translate-x-0 lg:bg-transparent lg:backdrop-blur-none xl:w-80`}
        id='toc-nav-panel'
        aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 1024}
      >
        <div className='flex h-full max-h-full flex-col overflow-hidden rounded-l-2xl border-l border-gray-200 transition-all duration-300 lg:rounded-2xl lg:border lg:bg-white/60 lg:shadow-lg lg:backdrop-blur-sm'>
          {/* 文章标题 */}
          {articleTitle && (
            <div className='border-b border-gray-100 p-4'>
              <h2 className='line-clamp-2 text-sm leading-tight font-semibold text-gray-800'>{articleTitle}</h2>
            </div>
          )}

          {/* 目录标题 */}
          <div className='flex items-center gap-2 border-b border-gray-200 p-4 lg:border-gray-100'>
            <Hash className='h-4 w-4 text-blue-600' />
            <h3 id='toc-title' className='font-semibold text-gray-900'>
              文章目录
            </h3>
            <div className='ml-auto text-xs text-gray-500'>
              {(() => {
                // 统计最外层章节数量：以文中出现的第一个层级为“外层”
                if (tocItems.length === 0) return '0 个章节';
                const outerLevel = tocItems[0].level;
                const outerCount = tocItems.filter(i => i.level === outerLevel).length;
                return `${outerCount} 个章节`;
              })()}
            </div>
          </div>

          {/* 目录列表 - 滚动区域，自动调整高度以适应容器 */}
          <div
            className='toc-nav min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth p-4'
            ref={setTocContainerRef}
          >
            <ul className='space-y-1'>
              {tocItems.map((item, index) => (
                <li key={`${item.id}-${index}`}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    data-heading-id={item.id}
                    className={`group w-full text-left transition-all duration-200 ${
                      activeId === item.id ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    style={{ paddingLeft: `${item.level === 2 ? 0 : 16}px` }}
                  >
                    <div
                      className={`relative flex items-center rounded-lg p-2 transition-all duration-200 ${
                        activeId === item.id
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* 左侧高亮条 */}
                      <span
                        aria-hidden='true'
                        className={`absolute top-1/2 left-0 h-5 -translate-y-1/2 rounded-r-full transition-all duration-300 ${
                          activeId === item.id ? 'w-1 bg-gradient-to-b from-blue-500 to-indigo-500' : 'w-0'
                        }`}
                      />
                      {/* 层级编号 */}
                      {item.numbering && (
                        <span
                          aria-hidden='true'
                          className={`mr-2 shrink-0 text-[11px] tabular-nums ${
                            activeId === item.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        >
                          {item.numbering}
                        </span>
                      )}
                      {/* 层级指示器 */}
                      <div
                        className={`mr-2 h-1 w-1 flex-shrink-0 rounded-full transition-all duration-200 ${
                          activeId === item.id ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />

                      {/* 标题文本 */}
                      <span
                        className={`line-clamp-2 leading-relaxed transition-colors duration-200 ${
                          item.level === 2 ? 'text-sm font-medium' : 'text-[13px] text-gray-700'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* 进度指示器 */}
          <div className='border-t border-gray-100 p-4'>
            <div className='flex items-center gap-2 text-xs text-gray-500'>
              <div className='h-1 flex-1 rounded-full bg-gray-200'>
                <div
                  className='h-1 rounded-full bg-blue-600 transition-all duration-300'
                  style={{
                    width: `${
                      tocItems.length > 0
                        ? ((tocItems.findIndex(item => item.id === activeId) + 1) / tocItems.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span>
                {tocItems.findIndex(item => item.id === activeId) + 1} / {tocItems.length}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端遮罩 */}
      {isOpen && (
        <div className='fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden' onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}

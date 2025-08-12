'use client';

import { useCallback, useEffect, useState } from 'react';

export function TocControls() {
  const [isHidden, setIsHidden] = useState(false);

  const toggleToc = useCallback(() => {
    const asideWrap = document.getElementById('toc-aside-wrap');
    if (!asideWrap) return;
    const nowHidden = asideWrap.style.display === 'none';
    asideWrap.style.display = nowHidden ? '' : 'none';
    const nextHidden = !nowHidden;
    setIsHidden(nextHidden);
    try {
      localStorage.setItem('toc-hidden', nextHidden ? '1' : '0');
    } catch {}
  }, []);

  // 初始化与窗口变化管理
  useEffect(() => {
    // 初始化：读取本地偏好
    try {
      const pref = localStorage.getItem('toc-hidden');
      const asideWrap = document.getElementById('toc-aside-wrap');
      if (pref === '1' && asideWrap) {
        asideWrap.style.display = 'none';
        setIsHidden(true);
      }
    } catch {}

    const onResize = () => {
      const asideWrap = document.getElementById('toc-aside-wrap');
      if (!asideWrap) return;
      if (window.innerWidth < 1024) {
        // 移动端不管理桌面侧栏
        setIsHidden(false);
        asideWrap.style.display = '';
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className='fixed right-6 bottom-28 z-40 hidden flex-col gap-3 lg:flex'>
      <button
        aria-label='切换目录面板'
        onClick={toggleToc}
        className='grid h-12 w-12 place-items-center rounded-xl border border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl'
        title={isHidden ? '展开目录' : '折叠目录'}
      >
        {/* 列表图标 */}
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
          <line x1='8' y1='6' x2='21' y2='6' />
          <line x1='8' y1='12' x2='21' y2='12' />
          <line x1='8' y1='18' x2='21' y2='18' />
          <polyline points='3 6 3 6' />
          <polyline points='3 12 3 12' />
          <polyline points='3 18 3 18' />
        </svg>
      </button>

      <a
        href='#comments'
        aria-label='跳转到评论区'
        className='grid h-12 w-12 place-items-center rounded-xl border border-gray-200 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl'
        title='评论'
      >
        {/* 气泡图标 */}
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
  );
}

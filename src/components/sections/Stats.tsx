'use client';

import { useEffect, useState } from 'react';
import { stats } from '@/lib/data';

export function Stats() {
  const [siteViews, setSiteViews] = useState<number | null>(null);

  useEffect(() => {
    // 获取站点访问量
    const fetchSiteViews = async () => {
      try {
        const response = await fetch('/api/views/get?type=site');
        if (response.ok) {
          const data = await response.json();
          setSiteViews(data.siteViews || 0);
        }
      } catch {
        // 静默失败，不影响页面渲染
      }
    };

    fetchSiteViews();
  }, []);

  // 合并静态数据和动态访问量数据
  const allStats = [
    ...stats,
    {
      label: '总访问量',
      value: siteViews !== null ? siteViews.toLocaleString() : '--',
    },
  ];

  return (
    <section className='bg-gradient-to-b from-gray-50/30 to-white py-24'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5'>
          {allStats.map((stat, index) => (
            <div
              key={stat.label}
              className='animate-fade-in text-center'
              style={{ animationDelay: `${(index + 1) * 0.1}s` }}
            >
              <div className='gradient-text mb-2 text-4xl font-bold md:text-5xl'>{stat.value}</div>
              <div className='font-medium text-gray-600'>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

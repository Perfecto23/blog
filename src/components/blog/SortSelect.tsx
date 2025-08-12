'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Filter } from 'lucide-react';

type SortValue = 'views_desc' | 'views_asc' | 'date_desc' | 'date_asc';

interface SortSelectProps {
  /** 当前排序值 */
  currentSort: SortValue | string;
  /** 当前分类（可选） */
  category?: string;
}

/**
 * 排序下拉选择组件
 * - 无需“应用”按钮，选择后自动更新 URL 查询参数并导航
 * - 会保留当前分类参数
 */
export function SortSelect({ currentSort, category }: SortSelectProps) {
  const router = useRouter();

  const handleChange = useCallback<React.ChangeEventHandler<HTMLSelectElement>>(
    event => {
      const nextSort = event.target.value as SortValue;
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      params.set('sort', nextSort);
      router.push(`/blog?${params.toString()}`);
    },
    [router, category]
  );

  return (
    <div
      className='inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-sm'
      aria-label='排序方式'
    >
      <Filter className='h-4 w-4 text-gray-500' aria-hidden='true' />
      <label htmlFor='sort-select' className='text-sm text-gray-600'>
        排序
      </label>
      <select
        id='sort-select'
        name='sort'
        defaultValue={(currentSort as string) || 'views_desc'}
        onChange={handleChange}
        className='bg-transparent text-sm text-gray-700 outline-none'
        aria-label='选择排序方式'
      >
        <option value='views_desc'>阅读量：高 → 低</option>
        <option value='views_asc'>阅读量：低 → 高</option>
        <option value='date_desc'>时间：新 → 旧</option>
        <option value='date_asc'>时间：旧 → 新</option>
      </select>
    </div>
  );
}

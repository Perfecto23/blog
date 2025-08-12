'use client';

import { useCallback, useEffect, useState } from 'react';
import { Bot, RefreshCw, Sparkles } from 'lucide-react';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { Button } from '@/components/ui/button';

interface AISummaryProps {
  title: string;
  content: string;
  slug: string;
}

/**
 * 缓存键前缀，用于本地存储
 */
const CACHE_PREFIX = 'ai-summary-cache-';

/**
 * 缓存数据结构
 */
interface CacheData {
  summary: string;
  timestamp: number;
  contentHash: string;
}

export function AISummary({ title, content, slug }: AISummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasCache, setHasCache] = useState(false);
  const [showButton, setShowButton] = useState(true);

  /**
   * 生成内容哈希值，用于检测内容是否变化
   * @param content 文章内容
   * @returns 哈希字符串
   */
  const generateContentHash = (content: string): string => {
    let hash = 0;
    if (content.length === 0) return hash.toString();
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash).toString();
  };

  /**
   * 获取缓存的摘要数据
   * @returns 缓存数据或null
   */
  const getCachedSummary = useCallback((): CacheData | null => {
    try {
      const cacheKey = `${CACHE_PREFIX}${slug}`;
      const cached = localStorage.getItem(cacheKey);
      if (!cached) return null;

      const cacheData: CacheData = JSON.parse(cached);
      const currentHash = generateContentHash(content);

      // 检查内容是否变化
      if (cacheData.contentHash !== currentHash) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      // 检查缓存是否过期（24小时）
      const isExpired = Date.now() - cacheData.timestamp > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem(cacheKey);
        return null;
      }

      return cacheData;
    } catch {
      return null;
    }
  }, [slug, content]);

  /**
   * 保存摘要到缓存
   * @param summary 摘要内容
   */
  const saveSummaryToCache = (summary: string): void => {
    try {
      const cacheKey = `${CACHE_PREFIX}${slug}`;
      const cacheData: CacheData = {
        summary,
        timestamp: Date.now(),
        contentHash: generateContentHash(content),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    } catch {
      // 缓存失败不影响正常功能
    }
  };

  // 组件加载时检查缓存
  useEffect(() => {
    const checkCache = () => {
      const cached = getCachedSummary();
      if (cached && cached.summary) {
        // 确保缓存的summary是字符串
        const cachedSummary = typeof cached.summary === 'string' ? cached.summary : String(cached.summary || '');
        if (cachedSummary) {
          setSummary(cachedSummary);
          setHasCache(true);
          setShowButton(false);
        }
      }
    };

    checkCache();
  }, [slug, content, getCachedSummary]);

  /**
   * 手动生成AI摘要的函数
   */
  const generateSummary = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setShowButton(false);

      // 调用AI模型API生成真实摘要
      const response = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成摘要失败');
      }

      // 确保summary是字符串类型
      const summaryText = typeof data.summary === 'string' ? data.summary : String(data.summary || '');

      if (!summaryText) {
        throw new Error('AI返回的摘要内容为空');
      }

      // 保存到缓存
      saveSummaryToCache(summaryText);

      // 使用打字机效果展示AI生成的摘要
      await displaySummaryWithTypingEffect(summaryText);
      setHasCache(false); // 新生成的不标记为缓存
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成摘要失败，请稍后重试');
      setIsLoading(false);
      setShowButton(true); // 出错时重新显示按钮
    }
  };

  /**
   * 打字机效果显示AI生成的摘要
   * @param aiSummary AI生成的摘要文本
   */
  const displaySummaryWithTypingEffect = async (aiSummary: string) => {
    setIsLoading(false);

    // 清空当前摘要
    setSummary('');

    // 打字机效果逐字显示AI摘要，加快速度
    for (let i = 0; i <= aiSummary.length; i++) {
      setSummary(aiSummary.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 15)); // 控制打字速度：15ms每个字符（加快一倍）
    }
  };

  // 错误状态UI
  if (error) {
    return (
      <div className='mb-8 rounded-lg border border-red-200 bg-red-50 p-6'>
        <div className='mb-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Bot className='h-5 w-5 text-red-600' />
            <h3 className='font-semibold text-red-900'>AI 智能摘要</h3>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={generateSummary}
            className='border-red-300 text-red-700 hover:bg-red-100'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            重新生成
          </Button>
        </div>
        <p className='text-red-700'>{error}</p>
      </div>
    );
  }

  // 显示总结按钮（初始状态）
  if (showButton) {
    return (
      <div className='mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
              <Bot className='h-4 w-4 text-blue-600' />
            </div>
            <h3 className='font-semibold text-blue-900'>AI 智能摘要</h3>
          </div>
          <Button onClick={generateSummary} size='sm' className='bg-blue-600 text-white hover:bg-blue-700'>
            <Sparkles className='mr-2 h-4 w-4' />
            生成摘要
          </Button>
        </div>
        <p className='text-blue-700'>点击「生成摘要」按钮，让 AI 为您智能分析文章内容，提炼核心要点和阅读收获。</p>
      </div>
    );
  }

  // 主要内容UI（有摘要内容时）
  return (
    <div className='mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100'>
            <Bot className='h-4 w-4 text-blue-600' />
          </div>
          <div className='flex items-center gap-2'>
            <h3 className='font-semibold text-blue-900'>AI 智能摘要</h3>
            {hasCache && <span className='rounded-full bg-green-100 px-2 py-1 text-xs text-green-700'>✓ 已缓存</span>}
            {isLoading && (
              <div className='flex items-center gap-1'>
                <Sparkles className='h-4 w-4 animate-spin text-blue-600' />
                <span className='text-sm text-blue-700'>生成中...</span>
              </div>
            )}
          </div>
        </div>
        {!isLoading && (
          <Button
            variant='outline'
            size='sm'
            onClick={generateSummary}
            className='border-blue-300 text-blue-700 hover:bg-blue-100'
          >
            <RefreshCw className='mr-2 h-4 w-4' />
            重新生成
          </Button>
        )}
      </div>

      <div className='leading-relaxed text-blue-800'>
        {isLoading ? (
          <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm text-blue-600'>
              <div className='flex space-x-1'>
                <div className='h-2 w-2 animate-bounce rounded-full bg-blue-400'></div>
                <div
                  className='h-2 w-2 animate-bounce rounded-full bg-blue-400'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='h-2 w-2 animate-bounce rounded-full bg-blue-400'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
              <span>正在分析文章内容...</span>
            </div>
          </div>
        ) : (
          <MarkdownRenderer content={summary} className='text-blue-800' />
        )}
      </div>

      {!isLoading && summary && (
        <div className='mt-4 border-t border-blue-200 pt-3'>
          <p className='text-xs text-blue-600'>
            ✨ 由 AI 智能生成，仅供参考
            {hasCache && ' • 数据已缓存，24小时内有效'}
          </p>
        </div>
      )}
    </div>
  );
}

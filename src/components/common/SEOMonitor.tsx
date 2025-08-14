'use client';

import { useEffect, useState } from 'react';
import { analyzeSEOPerformance, SEOMonitor, type SEOAnalysisResult } from '@/lib/seo-monitor';

/**
 * SEO实时监控组件
 * 仅在开发环境下显示SEO分析面板
 */
export function SEOMonitorWidget() {
  const [analysis, setAnalysis] = useState<SEOAnalysisResult | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 仅在开发环境下启用
    if (process.env.NODE_ENV !== 'development') return;

    // 初始化SEO监控器
    const monitor = SEOMonitor.getInstance();
    monitor.startMonitoring();

    // 初始分析
    const initialAnalysis = analyzeSEOPerformance();
    setAnalysis(initialAnalysis);

    // 定期更新分析结果
    const interval = setInterval(() => {
      const newAnalysis = analyzeSEOPerformance();
      setAnalysis(newAnalysis);
    }, 10000); // 每10秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 非开发环境不渲染
  if (process.env.NODE_ENV !== 'development' || !analysis) {
    return null;
  }

  return (
    <>
      {/* 浮动触发按钮 */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className='group fixed right-6 bottom-6 z-50 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-xl transition-all duration-300 hover:scale-110 hover:shadow-2xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
        aria-label='切换SEO监控面板'
      >
        <div className='text-xl group-hover:animate-pulse'>{isVisible ? '✨' : '📊'}</div>
      </button>

      {/* SEO分析面板 */}
      {isVisible && (
        <div className='animate-in slide-in-from-bottom-5 fixed right-6 bottom-20 z-50 w-96 rounded-2xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur-lg duration-300'>
          <div className='mb-4 flex items-center justify-between'>
            <div className='flex items-center space-x-2'>
              <div className='h-2 w-2 animate-pulse rounded-full bg-green-500'></div>
              <h3 className='bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-bold text-transparent'>
                SEO 实时监控
              </h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className='rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              aria-label='关闭面板'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          {/* 评分显示 */}
          <div className='mb-6'>
            <div className='mb-3 flex items-center justify-between'>
              <span className='text-sm font-semibold text-gray-700'>SEO 健康度</span>
              <div className='flex items-center space-x-2'>
                <span
                  className={`text-2xl font-bold ${
                    analysis.score >= 90 ? 'text-green-600' : analysis.score >= 70 ? 'text-yellow-600' : 'text-red-600'
                  }`}
                >
                  {analysis.score}
                </span>
                <span className='text-sm text-gray-500'>/100</span>
                <span className='text-xl'>{analysis.score >= 90 ? '🎉' : analysis.score >= 70 ? '👍' : '⚠️'}</span>
              </div>
            </div>
            <div className='relative h-3 overflow-hidden rounded-full bg-gray-100'>
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  analysis.score >= 90
                    ? 'bg-gradient-to-r from-green-400 to-green-600'
                    : analysis.score >= 70
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-red-400 to-red-600'
                }`}
                style={{ width: `${analysis.score}%` }}
              />
            </div>
            <div className='mt-2 text-center text-xs text-gray-500'>
              {analysis.score >= 90 ? '优秀！继续保持' : analysis.score >= 70 ? '良好，还有提升空间' : '需要优化'}
            </div>
          </div>

          {/* 问题列表 */}
          {analysis.issues.length > 0 && (
            <div className='mb-5'>
              <h4 className='mb-3 flex items-center text-sm font-semibold text-gray-700'>
                <span className='mr-2 h-2 w-2 rounded-full bg-red-500'></span>
                需要修复 ({analysis.issues.length})
              </h4>
              <ul className='space-y-2'>
                {analysis.issues.map((issue, index) => (
                  <li
                    key={index}
                    className='flex items-start rounded-lg border-l-2 border-red-400 bg-red-50 p-2 text-xs text-red-700'
                  >
                    <span className='mt-0.5 mr-2 text-red-500'>🔴</span>
                    <span className='flex-1'>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 建议列表 */}
          <div className='mb-5'>
            <h4 className='mb-3 flex items-center text-sm font-semibold text-gray-700'>
              <span className='mr-2 h-2 w-2 rounded-full bg-blue-500'></span>
              优化建议 ({analysis.recommendations.length})
            </h4>
            <ul className='space-y-2'>
              {analysis.recommendations.map((rec, index) => (
                <li
                  key={index}
                  className='flex items-start rounded-lg border-l-2 border-blue-400 bg-blue-50 p-2 text-xs text-blue-700'
                >
                  <span className='mt-0.5 mr-2 text-blue-500'>💡</span>
                  <span className='flex-1'>{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 性能指标 */}
          <div className='mb-5'>
            <h4 className='mb-3 flex items-center text-sm font-semibold text-gray-700'>
              <span className='mr-2 h-2 w-2 rounded-full bg-purple-500'></span>
              性能指标
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              <div className='rounded-lg bg-gray-50 p-3'>
                <div className='mb-1 text-xs text-gray-600'>页面加载</div>
                <div className='text-sm font-bold text-gray-800'>{analysis.metrics.pageLoadTime}ms</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-3'>
                <div className='mb-1 text-xs text-gray-600'>首字节时间</div>
                <div className='text-sm font-bold text-gray-800'>{analysis.metrics.ttfb}ms</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-3'>
                <div className='mb-1 text-xs text-gray-600'>资源数量</div>
                <div className='text-sm font-bold text-gray-800'>{analysis.metrics.resourceCount}</div>
              </div>
              <div className='rounded-lg bg-gray-50 p-3'>
                <div className='mb-1 text-xs text-gray-600'>设备类型</div>
                <div
                  className={`flex items-center text-sm font-bold ${analysis.metrics.isMobile ? 'text-blue-600' : 'text-gray-800'}`}
                >
                  <span className='mr-1'>{analysis.metrics.isMobile ? '📱' : '🖥️'}</span>
                  {analysis.metrics.isMobile ? '移动端' : '桌面端'}
                </div>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className='flex space-x-2'>
            <button
              onClick={() => setAnalysis(analyzeSEOPerformance())}
              className='flex flex-1 items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                />
              </svg>
              <span>刷新分析</span>
            </button>
            <button
              onClick={() => {
                console.log('SEO Analysis:', analysis);
                alert('分析数据已输出到控制台');
              }}
              className='rounded-lg bg-gray-100 px-3 py-2.5 text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none'
              title='导出数据到控制台'
            >
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 生产环境SEO监控（后台运行）
 */
export function ProductionSEOMonitor() {
  useEffect(() => {
    // 仅在生产环境运行
    if (process.env.NODE_ENV !== 'production') return;

    const monitor = SEOMonitor.getInstance();
    monitor.startMonitoring();
  }, []);

  return null; // 不渲染任何UI
}

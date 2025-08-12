'use client';

import { useTracking } from '@/components/common/AnalyticsProvider';
import { trackSEOEvents } from '@/lib/analytics';

/**
 * 用户行为跟踪使用示例
 */
export function TrackingExamples() {
  const { trackClick, trackDownload, trackOutboundLink } = useTracking();

  // 示例：跟踪按钮点击
  const handleButtonClick = () => {
    trackClick('下载简历按钮', 'CTA');
    // 其他业务逻辑...
  };

  // 示例：跟踪文件下载
  const handleDownload = () => {
    trackDownload('resume.pdf');
    // 触发下载...
  };

  // 示例：跟踪外部链接点击
  const handleExternalLink = (url: string) => {
    trackOutboundLink(url);
    window.open(url, '_blank');
  };

  // 示例：跟踪搜索行为
  const handleSearch = (searchTerm: string, resultsCount: number) => {
    trackSEOEvents.search(searchTerm, resultsCount);
  };

  // 示例：跟踪分享行为
  const handleShare = (platform: string, articleTitle: string) => {
    trackSEOEvents.share(platform, articleTitle);
  };

  // 示例：跟踪文章阅读时间
  const trackReadingTime = (articleTitle: string, timeSpent: number) => {
    trackSEOEvents.readingTime(articleTitle, timeSpent);
  };

  return (
    <div className='space-y-4 p-4'>
      <h3 className='text-lg font-bold'>分析跟踪示例</h3>

      <button onClick={handleButtonClick} className='rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600'>
        跟踪按钮点击
      </button>

      <button onClick={handleDownload} className='rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600'>
        跟踪文件下载
      </button>

      <button
        onClick={() => handleExternalLink('https://github.com')}
        className='rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600'
      >
        跟踪外部链接
      </button>
    </div>
  );
}

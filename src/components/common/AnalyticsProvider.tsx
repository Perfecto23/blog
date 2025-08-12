'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, performanceMonitor, reportWebVitals } from '@/lib/analytics';

/**
 * 分析工具提供者组件
 * 自动跟踪页面访问和性能指标
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // 跟踪页面访问
    const url = window.location.origin + pathname;
    pageview(url);

    // 开始性能监控
    performanceMonitor.startMonitoring(pathname);

    // 页面卸载时停止监控
    return () => {
      performanceMonitor.stopMonitoring(pathname);
    };
  }, [pathname]);

  useEffect(() => {
    // 监控 Web Vitals
    if (typeof window !== 'undefined') {
      // 使用 Next.js 的 reportWebVitals
      import('web-vitals').then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        onCLS(reportWebVitals); // Cumulative Layout Shift (累积布局偏移)
        onFCP(reportWebVitals); // First Contentful Paint (首次内容绘制)
        onINP(reportWebVitals); // Interaction to Next Paint (交互到下次绘制)
        onLCP(reportWebVitals); // Largest Contentful Paint (最大内容绘制)
        onTTFB(reportWebVitals); // Time to First Byte (首字节时间)
      });
    }
  }, []);

  return <>{children}</>;
}

/**
 * 用户行为跟踪钩子
 * 提供常用的用户行为跟踪方法
 */
export function useTracking() {
  const trackClick = (elementName: string, category: string = 'User Interaction') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: category,
        event_label: elementName,
      });
    }
  };

  const trackDownload = (fileName: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'file_download', {
        event_category: 'Download',
        event_label: fileName,
      });
    }
  };

  const trackOutboundLink = (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'click', {
        event_category: 'Outbound Link',
        event_label: url,
        transport_type: 'beacon',
      });
    }
  };

  return {
    trackClick,
    trackDownload,
    trackOutboundLink,
  };
}

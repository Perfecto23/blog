/**
 * Web Analytics and Performance Monitoring
 * 网站分析和性能监控工具
 */

// Google Analytics配置
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// 页面访问跟踪
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// 事件跟踪
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

// Core Web Vitals监控
export const reportWebVitals = ({ id, name, value }: { id: string; name: string; value: number }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
};

// SEO相关事件跟踪
export const trackSEOEvents = {
  // 搜索功能使用
  search: (searchTerm: string, resultsCount: number) => {
    event({
      action: 'search',
      category: 'SEO',
      label: searchTerm,
      value: resultsCount,
    });
  },

  // 文章分享
  share: (platform: string, articleTitle: string) => {
    event({
      action: 'share',
      category: 'SEO',
      label: `${platform} - ${articleTitle}`,
    });
  },

  // 外部链接点击
  externalLink: (url: string) => {
    event({
      action: 'external_link_click',
      category: 'SEO',
      label: url,
    });
  },

  // 内部链接点击
  internalLink: (fromPage: string, toPage: string) => {
    event({
      action: 'internal_link_click',
      category: 'SEO',
      label: `${fromPage} -> ${toPage}`,
    });
  },

  // 面包屑导航点击
  breadcrumbClick: (level: number, pageName: string) => {
    event({
      action: 'breadcrumb_click',
      category: 'Navigation',
      label: pageName,
      value: level,
    });
  },

  // 分类筛选
  categoryFilter: (category: string, resultCount: number) => {
    event({
      action: 'category_filter',
      category: 'Content',
      label: category,
      value: resultCount,
    });
  },

  // 标签点击
  tagClick: (tag: string) => {
    event({
      action: 'tag_click',
      category: 'Content',
      label: tag,
    });
  },

  // 阅读时间跟踪
  readingTime: (articleTitle: string, timeSpent: number) => {
    event({
      action: 'reading_time',
      category: 'Engagement',
      label: articleTitle,
      value: Math.round(timeSpent / 1000), // 转换为秒
    });
  },

  // 页面滚动深度
  scrollDepth: (depth: number, page: string) => {
    event({
      action: 'scroll_depth',
      category: 'Engagement',
      label: page,
      value: depth,
    });
  },
};

// 声明全局gtag类型
declare global {
  interface Window {
    gtag: (command: 'config' | 'event', targetId: string, config?: Record<string, unknown>) => void;
  }
}

// 性能指标收集
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private startTime: number = 0;
  private isMonitoring: boolean = false;

  public static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // 开始监控页面性能
  public startMonitoring(pageName: string): void {
    if (typeof window === 'undefined') return;

    this.startTime = performance.now();
    this.isMonitoring = true;

    // 监控 Largest Contentful Paint
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      event({
        action: 'lcp',
        category: 'Performance',
        label: pageName,
        value: Math.round(lastEntry.startTime),
      });
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // 监控 First Input Delay
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach((entry: PerformanceEntry) => {
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;

        event({
          action: 'fid',
          category: 'Performance',
          label: pageName,
          value: Math.round(fid),
        });
      });
    }).observe({ entryTypes: ['first-input'] });

    // 监控 Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver(entryList => {
      for (const entry of entryList.getEntries()) {
        const layoutShiftEntry = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        if (!layoutShiftEntry.hadRecentInput) {
          clsValue += layoutShiftEntry.value;
        }
      }

      event({
        action: 'cls',
        category: 'Performance',
        label: pageName,
        value: Math.round(clsValue * 1000),
      });
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // 停止监控并发送数据
  public stopMonitoring(pageName: string): void {
    if (!this.isMonitoring || typeof window === 'undefined') return;

    const endTime = performance.now();
    const duration = endTime - this.startTime;

    event({
      action: 'page_duration',
      category: 'Performance',
      label: pageName,
      value: Math.round(duration),
    });

    this.isMonitoring = false;
  }

  // 监控资源加载时间
  public monitorResourceTiming(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];

      resources.forEach(resource => {
        if (resource.initiatorType === 'img') {
          event({
            action: 'image_load_time',
            category: 'Performance',
            label: resource.name,
            value: Math.round(resource.responseEnd - resource.requestStart),
          });
        }
      });
    });
  }
}

// 导出性能监控实例
export const performanceMonitor = PerformanceMonitor.getInstance();

// 错误监控
export const errorTracking = {
  // JavaScript错误跟踪
  trackError: (error: Error, errorInfo?: Record<string, unknown>) => {
    event({
      action: 'javascript_error',
      category: 'Error',
      label: `${error.name}: ${error.message}`,
    });

    // 发送详细错误信息到服务器
    if (typeof window !== 'undefined') {
      fetch('/api/error-tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          url: window.location.href,
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          errorInfo,
        }),
      }).catch(() => {
        // 错误上报失败时静默处理，避免在生产环境中输出日志
      });
    }
  },

  // 资源加载错误
  trackResourceError: (resourceUrl: string, type: string) => {
    event({
      action: 'resource_error',
      category: 'Error',
      label: `${type}: ${resourceUrl}`,
    });
  },

  // 网络错误
  trackNetworkError: (url: string, status: number) => {
    event({
      action: 'network_error',
      category: 'Error',
      label: `${status}: ${url}`,
      value: status,
    });
  },
};

// SEO相关性能指标
export const seoMetrics = {
  // 首次内容绘制时间
  measureFCP: () => {
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      return Math.round(fcpEntry.startTime);
    }
    return null;
  },

  // 页面加载完成时间
  measurePageLoadTime: () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    return Math.round(loadTime);
  },

  // DOM内容加载时间
  measureDOMContentLoaded: () => {
    const domTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    return Math.round(domTime);
  },

  // 关键资源数量
  countCriticalResources: () => {
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return {
      totalResources: resources.length,
      cssFiles: resources.filter(r => r.initiatorType === 'css').length,
      jsFiles: resources.filter(r => r.initiatorType === 'script').length,
      images: resources.filter(r => r.initiatorType === 'img').length,
      fonts: resources.filter(r => r.name.includes('.woff') || r.name.includes('.ttf')).length,
    };
  },
};

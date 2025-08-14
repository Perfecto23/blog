/**
 * SEO效果监测工具集
 * 用于追踪SEO优化效果和性能指标
 */

export interface SEOMetrics {
  // Core Web Vitals
  lcp: number;
  fid: number;
  cls: number;

  // SEO指标
  pageLoadTime: number;
  ttfb: number;
  resourceCount: number;
  imageOptimization: boolean;

  // 移动端指标
  isMobile: boolean;
  touchOptimized: boolean;
  viewportWidth: number;
}

export interface SEOAnalysisResult {
  score: number;
  issues: string[];
  recommendations: string[];
  metrics: SEOMetrics;
}

/**
 * 分析当前页面的SEO表现
 */
export function analyzeSEOPerformance(): SEOAnalysisResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // 检查基础SEO元素
  const checkBasicSEO = () => {
    const title = document.querySelector('title')?.textContent;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');

    if (!title || title.length < 30) {
      issues.push('标题过短或缺失');
      score -= 15;
    }

    if (!description || description.length < 120) {
      issues.push('描述过短或缺失');
      score -= 10;
    }

    if (!canonical) {
      issues.push('缺少canonical URL');
      score -= 10;
    }
  };

  // 检查图片优化
  const checkImageOptimization = () => {
    const images = document.querySelectorAll('img');
    let unoptimizedCount = 0;

    images.forEach(img => {
      if (!img.alt) {
        unoptimizedCount++;
      }
      if (!img.loading || img.loading !== 'lazy') {
        if (!img.closest('[data-priority="true"]')) {
          // 非优先图片
          unoptimizedCount++;
        }
      }
    });

    if (unoptimizedCount > 0) {
      issues.push(`${unoptimizedCount}张图片未优化`);
      score -= unoptimizedCount * 2;
    }
  };

  // 检查移动端优化
  const checkMobileOptimization = () => {
    const viewport = document.querySelector('meta[name="viewport"]')?.getAttribute('content');
    const isMobile = window.innerWidth <= 768;

    if (!viewport || !viewport.includes('width=device-width')) {
      issues.push('Viewport配置不当');
      score -= 15;
    }

    // 检查触摸目标大小
    if (isMobile) {
      const buttons = document.querySelectorAll('button, a, input');
      let smallTargets = 0;

      buttons.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.width < 44 || rect.height < 44) {
          smallTargets++;
        }
      });

      if (smallTargets > 0) {
        issues.push(`${smallTargets}个触摸目标过小`);
        score -= smallTargets;
      }
    }
  };

  // 执行检查
  checkBasicSEO();
  checkImageOptimization();
  checkMobileOptimization();

  // 生成建议
  if (score >= 90) {
    recommendations.push('SEO表现优秀，继续保持');
  } else if (score >= 70) {
    recommendations.push('SEO表现良好，可进一步优化');
  } else {
    recommendations.push('SEO需要重点优化');
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    metrics: collectMetrics(),
  };
}

/**
 * 收集性能指标
 */
function collectMetrics(): SEOMetrics {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  return {
    lcp: 0, // 将通过Web Vitals API获取
    fid: 0,
    cls: 0,
    pageLoadTime: navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0,
    ttfb: navigation ? navigation.responseStart - navigation.requestStart : 0,
    resourceCount: performance.getEntriesByType('resource').length,
    imageOptimization: checkAllImagesOptimized(),
    isMobile: window.innerWidth <= 768,
    touchOptimized: checkTouchOptimization(),
    viewportWidth: window.innerWidth,
  };
}

/**
 * 检查所有图片是否已优化
 */
function checkAllImagesOptimized(): boolean {
  const images = document.querySelectorAll('img');
  return Array.from(images).every(img => img.alt && (img.loading === 'lazy' || img.closest('[data-priority="true"]')));
}

/**
 * 检查触摸优化
 */
function checkTouchOptimization(): boolean {
  if (window.innerWidth > 768) return true;

  const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
  return Array.from(interactiveElements).every(element => {
    const rect = element.getBoundingClientRect();
    return rect.width >= 44 && rect.height >= 44;
  });
}

/**
 * SEO监控工具 - 定期收集和上报数据
 */
export class SEOMonitor {
  private static instance: SEOMonitor;
  private metrics: SEOMetrics[] = [];
  private reportInterval: number = 30000; // 30秒

  static getInstance(): SEOMonitor {
    if (!SEOMonitor.instance) {
      SEOMonitor.instance = new SEOMonitor();
    }
    return SEOMonitor.instance;
  }

  /**
   * 开始监控
   */
  startMonitoring() {
    // 立即收集一次数据
    this.collectAndStore();

    // 定期收集数据
    setInterval(() => {
      this.collectAndStore();
    }, this.reportInterval);

    // 页面卸载时上报数据
    window.addEventListener('beforeunload', () => {
      this.reportData();
    });
  }

  /**
   * 收集并存储数据
   */
  private collectAndStore() {
    const metrics = collectMetrics();
    this.metrics.push(metrics);

    // 只保留最近的10条记录
    if (this.metrics.length > 10) {
      this.metrics = this.metrics.slice(-10);
    }
  }

  /**
   * 上报数据到分析平台
   */
  private reportData() {
    if (this.metrics.length === 0) return;

    const averageMetrics = this.calculateAverageMetrics();

    // 发送到Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'seo_metrics', {
        event_category: 'SEO Performance',
        page_load_time: averageMetrics.pageLoadTime,
        ttfb: averageMetrics.ttfb,
        resource_count: averageMetrics.resourceCount,
        is_mobile: averageMetrics.isMobile,
        custom_parameter: averageMetrics,
      });
    }
  }

  /**
   * 计算平均指标
   */
  private calculateAverageMetrics(): SEOMetrics {
    const totals = this.metrics.reduce(
      (acc, metric) => {
        acc.pageLoadTime += metric.pageLoadTime;
        acc.ttfb += metric.ttfb;
        acc.resourceCount += metric.resourceCount;
        return acc;
      },
      { pageLoadTime: 0, ttfb: 0, resourceCount: 0 }
    );

    const count = this.metrics.length;
    return {
      ...this.metrics[this.metrics.length - 1], // 使用最新的其他指标
      pageLoadTime: totals.pageLoadTime / count,
      ttfb: totals.ttfb / count,
      resourceCount: Math.round(totals.resourceCount / count),
    };
  }

  /**
   * 获取实时SEO建议
   */
  getRealtimeRecommendations(): string[] {
    const analysis = analyzeSEOPerformance();
    return analysis.recommendations;
  }
}

/**
 * 创建SEO报告
 */
export function generateSEOReport(): string {
  const analysis = analyzeSEOPerformance();

  return `
## SEO性能报告 (${new Date().toLocaleString()})

### 总体评分: ${analysis.score}/100

### 发现的问题:
${analysis.issues.map(issue => `- ${issue}`).join('\n')}

### 优化建议:
${analysis.recommendations.map(rec => `- ${rec}`).join('\n')}

### 性能指标:
- 页面加载时间: ${analysis.metrics.pageLoadTime}ms
- TTFB: ${analysis.metrics.ttfb}ms
- 资源数量: ${analysis.metrics.resourceCount}
- 移动端优化: ${analysis.metrics.touchOptimized ? '✅' : '❌'}
- 图片优化: ${analysis.metrics.imageOptimization ? '✅' : '❌'}
`;
}

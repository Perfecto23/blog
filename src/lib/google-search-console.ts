/**
 * Google Search Console 集成工具
 * 用于向GSC提交索引请求和监控数据
 */

// GSC API相关配置
export const GSC_CONFIG = {
  // 从环境变量获取配置
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://itmirror.top',
  // Google Search Console API需要OAuth2认证，通常在服务器端处理
  serviceAccountEmail: process.env.GSC_SERVICE_ACCOUNT_EMAIL,
  privateKey: process.env.GSC_PRIVATE_KEY,
  siteProperty: process.env.GSC_SITE_PROPERTY,
};

/**
 * 请求Google重新索引页面
 * 注意：需要在服务器端实现，因为需要OAuth2认证
 */
export async function requestReindexing(urls: string[]) {
  try {
    // 这个函数应该在API路由中实现
    const response = await fetch('/api/gsc/request-indexing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls }),
    });

    if (!response.ok) {
      throw new Error('索引请求失败');
    }

    return await response.json();
  } catch (error) {
    console.error('请求重新索引失败:', error);
    throw error;
  }
}

/**
 * 客户端SEO数据收集器
 * 收集页面数据并发送到后端进行GSC分析
 */
export class GSCDataCollector {
  private static instance: GSCDataCollector;
  private collectedData: GSCPageData[] = [];

  static getInstance(): GSCDataCollector {
    if (!GSCDataCollector.instance) {
      GSCDataCollector.instance = new GSCDataCollector();
    }
    return GSCDataCollector.instance;
  }

  /**
   * 收集当前页面的SEO数据
   */
  collectPageData(): GSCPageData {
    const url = window.location.href;
    const title = document.title;
    const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href') || url;

    // 收集链接数据
    const internalLinks: string[] = [];
    const externalLinks: string[] = [];

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        if (href.startsWith('/') || href.includes(window.location.hostname)) {
          internalLinks.push(href);
        } else if (href.startsWith('http')) {
          externalLinks.push(href);
        }
      }
    });

    // 收集图片数据
    const images = Array.from(document.querySelectorAll('img')).map(img => ({
      src: img.src,
      alt: img.alt || '',
      hasAlt: !!img.alt,
      isOptimized: img.loading === 'lazy' || img.closest('[data-priority="true"]') !== null,
    }));

    // 收集标题层级
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
      tag: h.tagName.toLowerCase(),
      text: h.textContent || '',
      level: parseInt(h.tagName.charAt(1)),
    }));

    return {
      url,
      title,
      description,
      canonical,
      internalLinks,
      externalLinks,
      images,
      headings,
      wordCount: this.countWords(),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  /**
   * 统计页面字数
   */
  private countWords(): number {
    const content = document.body.innerText || '';
    return content.trim().split(/\s+/).length;
  }

  /**
   * 发送数据到后端
   */
  async sendToBackend(data: GSCPageData) {
    try {
      await fetch('/api/seo/collect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('发送SEO数据失败:', error);
    }
  }

  /**
   * 自动收集并发送页面数据
   */
  autoCollect() {
    // 页面加载完成后收集数据
    if (document.readyState === 'complete') {
      const data = this.collectPageData();
      this.sendToBackend(data);
    } else {
      window.addEventListener('load', () => {
        const data = this.collectPageData();
        this.sendToBackend(data);
      });
    }
  }
}

// GSC页面数据类型定义
export interface GSCPageData {
  url: string;
  title: string;
  description: string;
  canonical: string;
  internalLinks: string[];
  externalLinks: string[];
  images: {
    src: string;
    alt: string;
    hasAlt: boolean;
    isOptimized: boolean;
  }[];
  headings: {
    tag: string;
    text: string;
    level: number;
  }[];
  wordCount: number;
  timestamp: string;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
}

/**
 * SEO分析报告生成器
 */
export function generateSEOInsights(data: GSCPageData): SEOInsights {
  const issues: string[] = [];
  const recommendations: string[] = [];
  let score = 100;

  // 标题分析
  if (!data.title || data.title.length < 30) {
    issues.push('标题过短（建议30-60字符）');
    score -= 15;
  } else if (data.title.length > 60) {
    issues.push('标题过长（建议30-60字符）');
    score -= 10;
  }

  // 描述分析
  if (!data.description || data.description.length < 120) {
    issues.push('描述过短（建议120-160字符）');
    score -= 10;
  } else if (data.description.length > 160) {
    issues.push('描述过长（建议120-160字符）');
    score -= 5;
  }

  // 图片分析
  const unoptimizedImages = data.images.filter(img => !img.hasAlt || !img.isOptimized);
  if (unoptimizedImages.length > 0) {
    issues.push(`${unoptimizedImages.length}张图片未优化`);
    score -= unoptimizedImages.length * 2;
  }

  // 标题层级分析
  const h1Count = data.headings.filter(h => h.level === 1).length;
  if (h1Count === 0) {
    issues.push('缺少H1标题');
    score -= 20;
  } else if (h1Count > 1) {
    issues.push('H1标题过多（建议只有1个）');
    score -= 10;
  }

  // 内链分析
  if (data.internalLinks.length < 3) {
    recommendations.push('增加更多内部链接以改善网站结构');
  }

  // 内容长度分析
  if (data.wordCount < 300) {
    issues.push('内容过短（建议至少300字）');
    score -= 15;
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    analysis: {
      titleOptimized: data.title.length >= 30 && data.title.length <= 60,
      descriptionOptimized: data.description.length >= 120 && data.description.length <= 160,
      imagesOptimized: unoptimizedImages.length === 0,
      headingStructureGood: h1Count === 1,
      sufficientContent: data.wordCount >= 300,
      goodInternalLinking: data.internalLinks.length >= 5,
    },
  };
}

export interface SEOInsights {
  score: number;
  issues: string[];
  recommendations: string[];
  analysis: {
    titleOptimized: boolean;
    descriptionOptimized: boolean;
    imagesOptimized: boolean;
    headingStructureGood: boolean;
    sufficientContent: boolean;
    goodInternalLinking: boolean;
  };
}

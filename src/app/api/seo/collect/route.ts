import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import type { GSCPageData } from '@/lib/google-search-console';
import type { GAEventData, SEOAnalysisResult } from '@/types';

/**
 * SEO数据收集API
 * 接收客户端发送的页面SEO数据并存储/分析
 */
export async function POST(request: NextRequest) {
  try {
    const data: GSCPageData = await request.json();

    // 基础数据验证
    if (!data.url || !data.title) {
      return NextResponse.json({ error: 'URL和标题是必需的' }, { status: 400 });
    }

    // 过滤敏感信息
    const sanitizedData = {
      ...data,
      userAgent: data.userAgent?.slice(0, 200), // 限制长度
      timestamp: new Date().toISOString(), // 使用服务器时间
    };

    // 在生产环境中，这里应该将数据存储到数据库
    // 目前只是记录到控制台
    console.log('SEO数据收集:', {
      url: sanitizedData.url,
      title: sanitizedData.title,
      wordCount: sanitizedData.wordCount,
      imagesCount: sanitizedData.images.length,
      internalLinksCount: sanitizedData.internalLinks.length,
      timestamp: sanitizedData.timestamp,
    });

    // 基础SEO分析
    const analysis = performBasicSEOAnalysis(sanitizedData);

    // 发送到Google Analytics（如果配置了）
    if (process.env.NEXT_PUBLIC_GA_ID) {
      try {
        await sendSEOEventToGA({
          gaId: process.env.NEXT_PUBLIC_GA_ID,
          url: sanitizedData.url,
          title: sanitizedData.title,
          analysis,
          userAgent: request.headers.get('user-agent') || '',
          ip: getClientIP(request),
        });
      } catch (error) {
        // GA 发送失败不应影响主要功能
        console.warn('发送 GA 事件失败:', error);
      }
    }

    return NextResponse.json({
      success: true,
      analysis,
      message: 'SEO数据已收集',
    });
  } catch (error) {
    console.error('SEO数据收集失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

/**
 * 基础SEO分析
 */
function performBasicSEOAnalysis(data: GSCPageData) {
  const issues = [];
  const recommendations = [];

  // 标题检查
  if (data.title.length < 30) {
    issues.push('标题过短');
  }

  // 描述检查
  if (data.description.length < 120) {
    issues.push('描述过短');
  }

  // 图片检查
  const imagesWithoutAlt = data.images.filter(img => !img.hasAlt);
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length}张图片缺少alt属性`);
  }

  // H1检查
  const h1Count = data.headings.filter(h => h.level === 1).length;
  if (h1Count !== 1) {
    issues.push(h1Count === 0 ? '缺少H1标题' : 'H1标题过多');
  }

  // 内容长度检查
  if (data.wordCount < 300) {
    issues.push('内容长度不足');
  }

  // 生成建议
  if (data.internalLinks.length < 3) {
    recommendations.push('增加内部链接');
  }

  return {
    issues,
    recommendations,
    score: Math.max(0, 100 - issues.length * 10),
    metrics: {
      titleLength: data.title.length,
      descriptionLength: data.description.length,
      wordCount: data.wordCount,
      imagesCount: data.images.length,
      h1Count,
      internalLinksCount: data.internalLinks.length,
    },
  };
}

/**
 * 获取客户端IP地址
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return '127.0.0.1'; // 在 Edge Runtime 中无法直接获取 IP
}

/**
 * 生成随机客户端ID (用于GA跟踪)
 */
function generateClientId(ip: string, userAgent: string): string {
  const hash = crypto
    .createHash('md5')
    .update(ip + userAgent + Date.now().toString())
    .digest('hex');

  // GA客户端ID格式: XXXXXXXX.XXXXXXXX
  return `${parseInt(hash.substring(0, 8), 16)}.${parseInt(hash.substring(8, 16), 16)}`;
}

/**
 * 发送SEO事件到Google Analytics (Measurement Protocol)
 */
async function sendSEOEventToGA({
  gaId,
  url,
  title,
  analysis,
  userAgent,
  ip,
}: {
  gaId: string;
  url: string;
  title: string;
  analysis: ReturnType<typeof performBasicSEOAnalysis>;
  userAgent: string;
  ip: string;
}) {
  const clientId = generateClientId(ip, userAgent);

  // Google Analytics Measurement Protocol v1
  const params = new URLSearchParams({
    v: '1', // 版本
    tid: gaId, // 跟踪ID
    cid: clientId, // 客户端ID
    t: 'event', // 命中类型
    ec: 'SEO_Analysis', // 事件类别
    ea: 'page_analyzed', // 事件操作
    el: url, // 事件标签
    ev: analysis.score.toString(), // 事件值（SEO评分）

    // 自定义维度（如果在GA中配置了）
    cd1: title, // 页面标题
    cd2: analysis.issues.length.toString(), // 问题数量
    cd3: analysis.recommendations.length.toString(), // 建议数量

    // 自定义指标
    cm1: analysis.metrics.wordCount.toString(), // 字数
    cm2: analysis.metrics.imagesCount.toString(), // 图片数量
    cm3: analysis.metrics.internalLinksCount.toString(), // 内链数量

    // 页面信息
    dp: new URL(url).pathname, // 页面路径
    dt: title, // 页面标题
    dh: new URL(url).hostname, // 主机名

    // 用户代理
    ua: userAgent,

    // IP覆盖
    uip: ip,
  });

  // 发送到GA
  const response = await fetch('https://www.google-analytics.com/collect', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error(`GA API响应错误: ${response.status}`);
  }

  // 同时发送详细的SEO分析数据作为单独的事件
  await sendDetailedSEOEvents({
    gaId,
    clientId,
    url,
    title,
    analysis,
    userAgent,
    ip,
  });
}

/**
 * 发送详细的SEO分析事件
 */
async function sendDetailedSEOEvents({
  gaId,
  clientId,
  url,
  title,
  analysis,
  userAgent,
  ip,
}: {
  gaId: string;
  clientId: string;
  url: string;
  title: string;
  analysis: ReturnType<typeof performBasicSEOAnalysis>;
  userAgent: string;
  ip: string;
}) {
  const baseParams = {
    v: '1',
    tid: gaId,
    cid: clientId,
    ua: userAgent,
    uip: ip,
    dp: new URL(url).pathname,
    dt: title,
    dh: new URL(url).hostname,
  };

  const events = [];

  // 为每个SEO问题发送事件
  for (const issue of analysis.issues) {
    events.push({
      ...baseParams,
      t: 'event',
      ec: 'SEO_Issues',
      ea: 'issue_detected',
      el: issue,
      ev: '1',
    });
  }

  // 为每个建议发送事件
  for (const recommendation of analysis.recommendations) {
    events.push({
      ...baseParams,
      t: 'event',
      ec: 'SEO_Recommendations',
      ea: 'recommendation_generated',
      el: recommendation,
      ev: '1',
    });
  }

  // SEO评分分级事件
  const scoreLevel =
    analysis.score >= 80 ? 'excellent' : analysis.score >= 60 ? 'good' : analysis.score >= 40 ? 'fair' : 'poor';

  events.push({
    ...baseParams,
    t: 'event',
    ec: 'SEO_Score',
    ea: 'score_calculated',
    el: scoreLevel,
    ev: analysis.score.toString(),
  });

  // 批量发送事件
  const promises = events.map(eventData => {
    const params = new URLSearchParams(eventData as Record<string, string>);
    return fetch('https://www.google-analytics.com/collect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  });

  await Promise.allSettled(promises); // 使用 allSettled 避免部分失败影响整体
}

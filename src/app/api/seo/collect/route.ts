import { NextRequest, NextResponse } from 'next/server';
import type { GSCPageData } from '@/lib/google-search-console';

/**
 * SEO数据收集API
 * 接收客户端发送的页面SEO数据并存储/分析
 */
export async function POST(request: NextRequest) {
  try {
    const data: GSCPageData = await request.json();
    
    // 基础数据验证
    if (!data.url || !data.title) {
      return NextResponse.json(
        { error: 'URL和标题是必需的' },
        { status: 400 }
      );
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

    // 发送到Google Analytics（如果配置了）
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // 这里可以发送自定义事件到GA
      // 在客户端通过gtag发送更简单
    }

    // 基础SEO分析
    const analysis = performBasicSEOAnalysis(sanitizedData);
    
    return NextResponse.json({
      success: true,
      analysis,
      message: 'SEO数据已收集',
    });

  } catch (error) {
    console.error('SEO数据收集失败:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
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

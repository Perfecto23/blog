import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

/**
 * Google Search Console 索引请求API
 * 向Google请求重新索引指定的URL
 */
export async function POST(request: NextRequest) {
  try {
    const { urls, paths } = await request.json();

    // 支持两种输入方式：完整URL数组 或 路径数组
    let urlsToIndex: string[] = [];

    if (urls && Array.isArray(urls)) {
      urlsToIndex = urls;
    } else if (paths && Array.isArray(paths)) {
      // 从路径生成完整URL
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itmirror.top';
      urlsToIndex = paths.map(path => `${baseUrl}/blog/${path}`);
    } else {
      return NextResponse.json(
        {
          error: 'urls数组或paths数组是必需的',
          usage: {
            urls: ['https://example.com/page1', 'https://example.com/page2'],
            paths: ['article-slug-1', 'article-slug-2'],
          },
        },
        { status: 400 }
      );
    }

    // 验证环境变量
    const serviceAccountEmail = process.env.GSC_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GSC_PRIVATE_KEY;

    if (!serviceAccountEmail || !privateKey) {
      return NextResponse.json({ error: 'Google Search Console API配置缺失' }, { status: 500 });
    }

    try {
      // 处理私钥格式
      let formattedPrivateKey = privateKey;
      if (formattedPrivateKey.includes('\\n')) {
        formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n');
      }

      // 确保私钥格式正确
      if (!formattedPrivateKey.includes('-----BEGIN PRIVATE KEY-----')) {
        throw new Error('私钥格式不正确，必须包含完整的 PEM 格式');
      }

      // 创建JWT认证客户端
      const auth = new google.auth.JWT({
        email: serviceAccountEmail,
        key: formattedPrivateKey,
        scopes: ['https://www.googleapis.com/auth/indexing'],
      });

      // 验证认证
      await auth.authorize();

      // 创建Indexing API客户端
      const indexing = google.indexing({ version: 'v3', auth });

      const results = [];

      // 逐个提交URL索引请求
      for (const url of urlsToIndex) {
        try {
          const response = await indexing.urlNotifications.publish({
            requestBody: {
              url,
              type: 'URL_UPDATED', // 或 'URL_DELETED'
            },
          });

          results.push({
            url,
            success: true,
            message: '索引请求已提交',
            timestamp: new Date().toISOString(),
            googleResponse: response.data,
          });

          console.log(`索引请求成功: ${url}`, response.data);
        } catch (urlError) {
          console.error(`索引请求失败: ${url}`, (urlError as Error).message);

          results.push({
            url,
            success: false,
            message: `索引请求失败: ${(urlError as Error).message}`,
            timestamp: new Date().toISOString(),
            error: (urlError as Error).message,
          });
        }
      }

      const successCount = results.filter(r => r.success).length;

      return NextResponse.json({
        success: successCount > 0,
        results,
        message: `已处理${urlsToIndex.length}个URL的索引请求，成功${successCount}个`,
        summary: {
          total: urlsToIndex.length,
          success: successCount,
          failed: urlsToIndex.length - successCount,
        },
      });
    } catch (authError) {
      console.error('Google API认证失败:', authError);
      return NextResponse.json(
        {
          error: 'Google API认证失败',
          details: (authError as Error).message,
          suggestion: '请检查服务账号配置和权限设置',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('索引请求失败:', error);
    return NextResponse.json(
      {
        error: '服务器内部错误',
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

/**
 * 获取索引状态
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL参数是必需的' }, { status: 400 });
    }

    // 这里应该查询Google Search Console API获取索引状态
    // 临时返回模拟数据
    return NextResponse.json({
      url,
      indexed: true,
      lastCrawled: new Date().toISOString(),
      status: 'indexed',
      issues: [],
    });
  } catch (error) {
    console.error('获取索引状态失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}

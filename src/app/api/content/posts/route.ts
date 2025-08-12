import { NextResponse } from 'next/server';

import { log } from '@/lib/logger';
import { getAllPosts } from '@/lib/mdx';

export async function GET() {
  try {
    const posts = await getAllPosts();
    
    // 只返回必要的字段，减少数据传输
    const simplifiedPosts = posts.map(post => ({
      slug: post.slug,
      title: post.title,
      category: post.category,
    }));

    log.debug('文章列表查询', { 
      count: simplifiedPosts.length, 
      action: '内容API' 
    });

    return NextResponse.json(simplifiedPosts);
  } catch (error) {
    log.error('文章列表查询失败', error as Error, { action: '内容API' });
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 支持OPTIONS请求用于CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

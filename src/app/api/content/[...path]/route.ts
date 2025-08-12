import fs from 'fs';
import path from 'path';

import { NextRequest, NextResponse } from 'next/server';

// 简单的MIME类型映射
const mimeTypes: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.md': 'text/markdown',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    // URL解码每个路径段
    const decodedSegments = pathSegments.map(segment => decodeURIComponent(segment));
    const filePath = path.join(process.cwd(), 'content', ...decodedSegments);

    // 检查文件是否存在
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
      return new NextResponse('文件未找到', { status: 404 });
    }

    // 安全检查：确保请求的文件在content目录内
    const contentDir = path.join(process.cwd(), 'content');
    const resolvedPath = path.resolve(filePath);
    const resolvedContentDir = path.resolve(contentDir);
    
    if (!resolvedPath.startsWith(resolvedContentDir)) {
      return new NextResponse('访问被拒绝', { status: 403 });
    }

    // 读取文件内容
    const fileBuffer = fs.readFileSync(filePath);
    
    // 获取MIME类型
    const fileExt = path.extname(filePath).toLowerCase();
    const mimeType = mimeTypes[fileExt] || 'application/octet-stream';

    // 返回文件内容
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=3600', // 缓存1小时
      },
    });
  } catch (error) {
    return new NextResponse('服务器内部错误', { status: 500 });
  }
}

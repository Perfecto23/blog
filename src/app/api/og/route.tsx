import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

/**
 * 动态 OG 图接口
 * 支持通过查询参数生成 1200x630 的分享图
 * - title: 文章或页面标题
 * - subtitle: 可选副标题/描述
 * - badge: 可选标签，如分类名
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '柯芃丞 - 前端工程师 | 技术分享与实践';
  const subtitle = searchParams.get('subtitle') || '';
  const badge = searchParams.get('badge') || '';

  const width = 1200;
  const height = 630;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '64px',
          background: 'linear-gradient(135deg, #f5f7ff 0%, #eef6ff 35%, #fefefe 100%)',
        }}
      >
        {badge && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(59,130,246,0.1)',
              color: '#2563eb',
              border: '1px solid rgba(59,130,246,0.25)',
              fontSize: 26,
            }}
          >
            <div style={{ width: 8, height: 8, borderRadius: 999, background: '#3b82f6' }} />
            {badge}
          </div>
        )}

        <div style={{ height: 28 }} />

        <h1
          style={{
            fontSize: 64,
            lineHeight: 1.15,
            margin: 0,
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>

        {subtitle && <p style={{ marginTop: 18, fontSize: 28, color: '#334155', maxWidth: 960 }}>{subtitle}</p>}

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', color: '#475569' }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
              marginRight: 14,
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 700 }}>itmirror.top</span>
          <span style={{ margin: '0 10px' }}>•</span>
          <span style={{ fontSize: 22 }}>柯芃丞</span>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}

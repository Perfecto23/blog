import { NextRequest, NextResponse } from 'next/server';

function generateNonce(): string {
  // 简单 nonce 生成器，满足 CSP nonce 要求（Base64）
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Buffer.from(bytes).toString('base64');
}

export function middleware(request: NextRequest) {
  // 301: www 子域统一到裸域 itmirror.top
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = new URL(request.nextUrl);
    url.hostname = host.replace(/^www\./, '');
    return NextResponse.redirect(url, 301);
  }

  const nonce = generateNonce();
  const reqHeaders = new Headers(request.headers);
  reqHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });
  response.headers.set('x-nonce', nonce);

  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  // Use CSP instead of deprecated X-XSS-Protection
  const isProd = process.env.NODE_ENV === 'production';
  const baseCsp = [
    "default-src 'self'",
    // 允许内联样式以兼容第三方（Tailwind 注入的 style 不需 nonce）
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: https://avatars.githubusercontent.com https://camo.githubusercontent.com",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ];
  const prodScripts = [
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://www.google-analytics.com https://giscus.app`,
    "connect-src 'self' https://www.google-analytics.com https://giscus.app",
    'frame-src https://giscus.app',
  ];
  const devScripts = [
    // 允许开发模式 HMR、ws
    `script-src 'self' 'nonce-${nonce}' 'unsafe-eval' blob: https://giscus.app`,
    "connect-src 'self' ws: wss: https://www.google-analytics.com https://giscus.app",
    'frame-src https://giscus.app',
  ];
  const csp = [...baseCsp, ...(isProd ? prodScripts : devScripts)].join('; ');
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), browsing-topics=()');

  // Preload critical resources for blog pages
  // Remove invalid font preload; fonts are handled by next/font

  // Add cache headers for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/static/') ||
    request.nextUrl.pathname.startsWith('/static/') ||
    /\.(ico|png|jpg|jpeg|gif|svg|webp|avif|woff|woff2|ttf|eot)$/.test(request.nextUrl.pathname)
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Add no-cache for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, max-age=0');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

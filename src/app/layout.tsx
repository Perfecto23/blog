import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { headers } from 'next/headers';
import Script from 'next/script';
import { AnalyticsProvider } from '@/components/common/AnalyticsProvider';
import { PerformanceMonitor } from '@/components/common/PerformanceMonitor';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { GA_TRACKING_ID } from '@/lib/analytics';
import { generateSEO, generateStructuredData } from '@/lib/metadata';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  fallback: ['monospace'],
});

export const metadata: Metadata = generateSEO({});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 从中间件注入的 nonce（通过请求头）
  const nonce = (await headers()).get('x-nonce') || undefined;
  const websiteStructuredData = generateStructuredData('website');

  return (
    <html lang='zh-CN' className='scroll-smooth'>
      <head>
        {/* Preconnect for GA and giscus */}
        <link rel='preconnect' href='https://www.googletagmanager.com' crossOrigin='' />
        <link rel='preconnect' href='https://www.google-analytics.com' crossOrigin='' />
        <link rel='preconnect' href='https://giscus.app' crossOrigin='' />
        {websiteStructuredData && (
          <script
            type='application/ld+json'
            nonce={nonce}
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(websiteStructuredData),
            }}
          />
        )}
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col font-sans antialiased`}>
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy='afterInteractive'
              nonce={nonce}
            />
            <Script id='google-analytics' strategy='afterInteractive' nonce={nonce}>
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_location: window.location.href,
                  page_title: document.title,
                });
              `}
            </Script>
          </>
        )}

        <AnalyticsProvider>
          <PerformanceMonitor />
          <Header />
          <main className='flex-1 pt-16'>{children}</main>
          <Footer />
        </AnalyticsProvider>
      </body>
    </html>
  );
}

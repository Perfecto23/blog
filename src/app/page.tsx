import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Hero } from '@/components/sections/Hero';
import { generateSEO, generateStructuredData } from '@/lib/metadata';

export const revalidate = 60;

// 首页使用空路径确保canonical URL为裸域
export const metadata: Metadata = generateSEO({
  path: '',
  title: '主页',
  description: '专注现代Web开发技术的前端工程师，分享Vue/React、TypeScript、工程化等领域的实战经验与技术洞察。',
});

export default async function Home() {
  const nonce = (await headers()).get('x-nonce') || undefined;
  const personLd = generateStructuredData('person');

  return (
    <>
      {personLd && (
        <script
          type='application/ld+json'
          nonce={nonce}
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
      )}
      <Hero />
      <BlogPreview />
      <AboutPreview />
      <ContactCTA />
    </>
  );
}

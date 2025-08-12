import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { AboutPreview } from '@/components/sections/AboutPreview';
import { BlogPreview } from '@/components/sections/BlogPreview';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Hero } from '@/components/sections/Hero';
import { generateSEO, generateStructuredData } from '@/lib/metadata';

export const revalidate = 60;

export const metadata: Metadata = generateSEO({ path: '/' });

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

import type { ReactNode } from 'react';

interface PageHeaderProps {
  badge?: {
    text: string;
    icon?: 'pulse' | 'static';
    color?: 'blue' | 'green' | 'purple' | 'orange';
  };
  title: string;
  highlightText?: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  variant?: 'hero' | 'page';
}

const colorMap = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-green-500 to-emerald-500',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

export function PageHeader({
  badge,
  title,
  highlightText,
  subtitle,
  description,
  children,
  variant = 'page',
}: PageHeaderProps) {
  const isHero = variant === 'hero';

  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-br from-white via-gray-50/30 to-blue-50/20 ${isHero ? 'flex min-h-[80vh] items-center justify-center pt-16 pb-8' : 'pt-16 pb-8'}`}
    >
      {/* Background Elements */}
      <div className='absolute inset-0 -z-10 overflow-hidden'>
        <div className='absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/4 to-indigo-500/2 blur-3xl'></div>
        <div className='absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/3 to-pink-500/1 blur-3xl'></div>
      </div>

      {/* Background decoration */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]'></div>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.03),transparent_50%)]'></div>

      <div className='relative mx-auto max-w-6xl px-6 text-center'>
        {badge && (
          <div className='mb-8 inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-medium text-gray-600 shadow-sm'>
            <span className={`mr-3 h-2 w-2 rounded-full bg-gradient-to-r ${colorMap[badge.color || 'blue']}`}></span>
            {badge.text}
          </div>
        )}

        <h1
          className={`mb-6 leading-tight font-bold ${isHero ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl md:text-5xl lg:text-6xl'}`}
        >
          {highlightText ? (
            <>
              <span className='block text-gray-900'>{title}</span>
              <span className='gradient-text block'>{highlightText}</span>
            </>
          ) : (
            <span className='text-gray-900'>{title}</span>
          )}
        </h1>

        {subtitle && (
          <p
            className={`mx-auto mb-6 max-w-4xl leading-relaxed font-medium text-gray-700 ${isHero ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}
          >
            {subtitle}
          </p>
        )}

        {description && (
          <p
            className={`mx-auto mb-8 max-w-3xl leading-relaxed text-gray-600 ${isHero ? 'text-lg' : 'text-base md:text-lg'}`}
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </section>
  );
}

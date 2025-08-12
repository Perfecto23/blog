'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  href?: string;
}

export function AnimatedCard({ children, className, delay = 0, href }: AnimatedCardProps) {
  const cardContent = (
    <div
      className={cn(
        'card-hover animate-in fade-in-0 slide-in-from-bottom-6 fill-mode-both',
        'duration-500 ease-out',
        className
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );

  if (href) {
    return (
      <a href={href} className='block'>
        {cardContent}
      </a>
    );
  }

  return cardContent;
}

export function CardHover({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'group cursor-pointer transition-all duration-300',
        'hover:-translate-y-1 hover:transform',
        className
      )}
    >
      {children}
    </div>
  );
}

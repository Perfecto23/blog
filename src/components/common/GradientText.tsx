import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'blue-green' | 'purple-pink' | 'orange-red' | 'teal-blue';
}

const gradients = {
  'blue-green': 'from-blue-600 to-green-500',
  'purple-pink': 'from-purple-600 to-pink-500',
  'orange-red': 'from-orange-500 to-red-500',
  'teal-blue': 'from-teal-500 to-blue-600',
};

export function GradientText({ children, className, variant = 'blue-green' }: GradientTextProps) {
  return (
    <span className={cn('bg-gradient-to-r bg-clip-text font-bold text-transparent', gradients[variant], className)}>
      {children}
    </span>
  );
}

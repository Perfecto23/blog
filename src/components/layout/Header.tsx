'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/data';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/' },
  { name: '博客', href: '/blog' },
  { name: '关于', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className='fixed top-0 z-50 w-full transition-all duration-300 glass-morphism'>
      <nav className='px-4 mx-auto max-w-7xl sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center space-x-3'>
            <Logo size='md' className='transition-transform duration-300 hover:scale-110' />
          </div>

          {/* Desktop Navigation */}
          <div className='hidden items-center space-x-8 md:flex'>
            {navigation.map(item => {
              const isActive = pathname === item.href || (item.href === '/blog' && pathname.startsWith('/blog'));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'relative text-base font-medium transition-colors duration-200',
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                  )}
                >
                  {item.name}
                  {isActive && <span className='absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue-600' />}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <Button variant='ghost' size='sm' onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='p-2'>
              {mobileMenuOpen ? <X className='w-6 h-6' /> : <Menu className='w-6 h-6' />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 mt-2 space-y-1 rounded-lg border border-gray-200 backdrop-blur-sm bg-white/95 sm:px-3'>
              {navigation.map(item => {
                const isActive = pathname === item.href || (item.href === '/blog' && pathname.startsWith('/blog'));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200',
                      isActive ? 'text-blue-600 bg-blue-50' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

// CSS for glass morphism effect - add to globals.css
export const headerStyles = `
.glass-morphism {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.gradient-text {
  background: linear-gradient(135deg, #2563eb, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
`;

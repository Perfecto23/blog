import Link from 'next/link';
import { Github, Linkedin, Mail, MapPin } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { SiteStats } from '@/components/common/ViewCounter';
import { contactInfo, siteConfig } from '@/lib/data';

const socialLinks = [
  {
    name: 'GitHub',
    href: siteConfig.author.social.github || '#',
    icon: Github,
  },
  {
    name: 'LinkedIn',
    href: siteConfig.author.social.linkedin || '#',
    icon: Linkedin,
  },
];

const footerNavigation = [
  { name: '关于我', href: '/about' },
  { name: '博客', href: '/blog' },
];

export function Footer() {
  return (
    <footer className='bg-gray-900 py-16 text-white'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-3'>
          {/* Brand Section */}
          <div>
            <div className='mb-6 flex items-center space-x-3'>
              <Logo size='lg' className='transition-transform duration-300 hover:scale-110' />
              <h3 className='text-xl font-bold'>{siteConfig.author.name}</h3>
            </div>
            <p className='mb-6 leading-relaxed text-gray-400'>{siteConfig.description}</p>
            <div className='flex space-x-4'>
              {socialLinks.map(social => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-colors duration-200 hover:bg-gray-700'
                    aria-label={social.name}
                  >
                    <IconComponent className='h-5 w-5' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className='mb-6 font-semibold'>快速导航</h4>
            <ul className='space-y-3 text-gray-400'>
              {footerNavigation.map(item => (
                <li key={item.name}>
                  <Link href={item.href} className='transition-colors duration-200 hover:text-white'>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className='mb-6 font-semibold'>联系方式</h4>
            <ul className='space-y-3 text-gray-400'>
              <li className='flex items-center space-x-3'>
                <Mail className='h-4 w-4' />
                <span>{contactInfo.email}</span>
              </li>
              <li className='flex items-center space-x-3'>
                <MapPin className='h-4 w-4' />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Site Stats */}
        <div className='border-t border-gray-700 pt-8'>
          <div className='mb-4 flex justify-center'>
            <SiteStats className='text-center' />
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-gray-700 pt-8 text-center text-gray-400'>
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.author.name}. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}

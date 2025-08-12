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
    <footer className='py-16 text-white bg-gray-900'>
      <div className='px-4 mx-auto max-w-6xl sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-8 mb-8 md:grid-cols-3'>
          {/* Brand Section */}
          <div>
            <div className='flex items-center mb-6 space-x-3'>
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
                    className='flex justify-center items-center w-10 h-10 bg-gray-800 rounded-lg transition-colors duration-200 hover:bg-gray-700'
                    aria-label={social.name}
                  >
                    <IconComponent className='w-5 h-5' />
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
                <Mail className='w-4 h-4' />
                <span>{contactInfo.email}</span>
              </li>
              <li className='flex items-center space-x-3'>
                <MapPin className='w-4 h-4' />
                <span>{contactInfo.location}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Site Stats */}
        <div className='pt-8 border-t border-gray-700'>
          <div className='flex justify-center mb-4'>
            <SiteStats className='text-center' />
          </div>
        </div>

        {/* Copyright */}
        <div className='pt-8 text-center text-gray-400 border-t border-gray-700'>
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.author.name}. 保留所有权利。
          </p>
        </div>
      </div>
    </footer>
  );
}

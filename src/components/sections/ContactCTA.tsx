import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { GradientText } from '@/components/common/GradientText';

export function ContactCTA() {
  return (
    <section className='relative overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-purple-50/30 py-24'>
      {/* Background decoration */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.08),transparent_50%)]'></div>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(147,51,234,0.06),transparent_50%)]'></div>

      <div className='relative mx-auto max-w-4xl px-6 text-center'>
        <div className='mb-6 inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm'>
          <span className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-500'></span>
          让我们联系
        </div>

        <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
          准备开始<GradientText>合作</GradientText>了吗？
        </h2>

        <p className='mx-auto mb-12 max-w-2xl text-xl text-gray-600/90'>
          无论是技术交流、项目合作还是工作机会，我都很乐意与您交流。 让我们一起创造些有趣的东西！
        </p>

        {/* Contact Methods */}
        <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Email Contact */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50'>
              <Mail className='h-6 w-6 text-blue-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>邮件联系</h3>
            <p className='mb-4 text-gray-600'>发送邮件讨论项目合作或技术交流</p>
            <Link
              href='mailto:kepengcheng314@163.com'
              className='group/link inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700'
            >
              kepengcheng314@163.com
              <ArrowRight className='ml-1 h-4 w-4' />
            </Link>
          </div>

          {/* Direct Message */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-md'>
            <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50'>
              <MessageCircle className='h-6 w-6 text-green-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>即时沟通</h3>
            <p className='mb-4 text-gray-600'>通过社交媒体快速联系和交流</p>
            <span className='font-medium text-green-600'>微信/QQ联系</span>
          </div>
        </div>

        {/* Social Links */}
        <div className='mb-12'>
          <p className='mb-6 text-gray-600'>或者通过社交媒体关注我</p>
          <div className='flex justify-center gap-6'>
            <Link
              href='https://github.com/Perfecto23'
              className='flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300'
            >
              <Github className='h-6 w-6 text-gray-600' />
            </Link>
            <Link
              href='https://linkedin.com'
              className='flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm hover:border-gray-300'
            >
              <Linkedin className='h-6 w-6 text-gray-600' />
            </Link>
          </div>
        </div>

        {/* CTA Button */}
        <a
          href='mailto:kepengcheng314@163.com'
          className='inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 font-semibold text-white shadow-md hover:from-blue-700 hover:to-purple-700'
        >
          发送邮件
          <ArrowRight className='ml-2 h-5 w-5' />
        </a>
      </div>
    </section>
  );
}

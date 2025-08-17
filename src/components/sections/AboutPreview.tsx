import Link from 'next/link';
import { ArrowRight, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { GradientText } from '@/components/common/GradientText';

export function AboutPreview() {
  return (
    <section className='bg-gradient-to-b from-gray-50/50 to-white py-24'>
      <div className='mx-auto max-w-6xl px-6'>
        <div className='grid items-center gap-12 lg:grid-cols-2'>
          {/* Left Content */}
          <div>
            <div className='mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/80 px-4 py-2 text-sm font-medium text-gray-600 shadow-lg backdrop-blur-sm'>
              <span className='mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-gradient-to-r from-green-500 to-emerald-500'></span>
              关于我
            </div>

            <h2 className='mb-6 text-4xl font-bold md:text-5xl'>
              专注<GradientText>前端技术</GradientText>的工程师
            </h2>

            <p className='mb-8 text-lg leading-relaxed text-gray-600'>
              我是一名热爱技术的前端工程师，专注于现代 Web 开发技术栈。
              在企业级应用开发、性能优化和工程化建设方面有丰富的实践经验。
              热衷于开源贡献和技术分享，致力于通过代码创造更好的用户体验。
            </p>

            {/* Key Info */}
            <div className='mb-8 space-y-4'>
              <div className='flex items-center gap-3 text-gray-600'>
                <MapPin className='h-5 w-5 text-blue-600' />
                <span>深圳，中国</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <Briefcase className='h-5 w-5 text-green-600' />
                <span>前端工程师 · 3+ 年经验</span>
              </div>
              <div className='flex items-center gap-3 text-gray-600'>
                <GraduationCap className='h-5 w-5 text-purple-600' />
                <span>软件工程</span>
              </div>
            </div>

            <Link
              href='/about'
              className='group inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl'
            >
              了解更多
              <ArrowRight className='ml-2 h-5 w-5 transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110' />
            </Link>
          </div>

          {/* Right Content - Visual Element */}
          <div>
            <AnimatedCard>
              <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8 shadow-2xl'>
                {/* Background Pattern */}
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]'></div>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.08),transparent_50%)]'></div>

                <div className='relative'>
                  <h3 className='mb-6 text-2xl font-bold text-gray-900'>核心技能</h3>

                  <div className='space-y-4'>
                    <div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-medium text-gray-700'>前端开发</span>
                        <span className='font-medium text-blue-600'>95%</span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600'
                          style={{ width: '95%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-medium text-gray-700'>Vue.js/React</span>
                        <span className='font-medium text-green-600'>90%</span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-green-500 to-green-600'
                          style={{ width: '90%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-medium text-gray-700'>工程化</span>
                        <span className='font-medium text-purple-600'>85%</span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-600'
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className='mb-2 flex justify-between'>
                        <span className='font-medium text-gray-700'>性能优化</span>
                        <span className='font-medium text-orange-600'>88%</span>
                      </div>
                      <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                        <div
                          className='h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-600'
                          style={{ width: '88%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
}

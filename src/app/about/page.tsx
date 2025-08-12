import type { Metadata } from 'next';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Container } from '@/components/common/Container';
import { GradientText } from '@/components/common/GradientText';
import { PageHeader } from '@/components/common/PageHeader';
import { siteConfig, skills, workExperience } from '@/lib/data';
import { generateSEO, generateStructuredData } from '@/lib/metadata';

export const metadata: Metadata = generateSEO({
  title: '关于我',
  description: '了解我的技术背景、工作经历和专业技能',
  path: '/about',
});

export default function AboutPage() {
  const personStructuredData = generateStructuredData('person');

  const breadcrumbItems = [
    { name: '首页', url: '/' },
    { name: '关于我', url: '/about', current: true },
  ];

  return (
    <>
      {personStructuredData && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personStructuredData),
          }}
        />
      )}

      {/* Hero Section */}
      <PageHeader
        badge={{
          text: '个人简历',
          icon: 'static',
          color: 'green',
        }}
        title='关于我'
        description='3年前端开发经验，专注现代Web技术栈，热衷于技术分享和开源贡献'
      />

      {/* Resume Content */}
      <section className='py-16'>
        <Container>
          {/* 面包屑导航 */}
          <div className='mb-8'>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
            {/* Main Content */}
            <div className='space-y-12 lg:col-span-2'>
              {/* About */}
              <AnimatedCard className='p-8'>
                <h2 className='mb-6 text-3xl font-bold'>
                  <GradientText>个人简介</GradientText>
                </h2>
                <div className='space-y-4 text-lg leading-relaxed text-gray-700'>
                  <p>{siteConfig.author.bio}</p>
                  <p>
                    作为一名前端工程师，我专注于使用现代技术栈构建高性能、用户友好的Web应用。
                    我相信代码不仅要功能完备，更要优雅易维护。通过不断学习和实践，我致力于为用户 创造出色的数字体验。
                  </p>
                </div>
              </AnimatedCard>

              {/* Experience */}
              <AnimatedCard className='p-8' delay={100}>
                <h2 className='mb-8 text-3xl font-bold'>
                  <GradientText>工作经历</GradientText>
                </h2>
                <div className='space-y-8'>
                  {workExperience.map((job, index) => (
                    <div key={index} className='relative border-l-2 border-blue-100 pl-8'>
                      <div
                        className={`absolute top-0 -left-2 h-4 w-4 rounded-full ${
                          job.current ? 'bg-blue-600' : 'bg-blue-400'
                        }`}
                      ></div>
                      <div className='mb-2'>
                        <h3 className='text-xl font-bold'>{job.title}</h3>
                        <p className='text-gray-600'>
                          {job.company} • {job.duration}
                        </p>
                      </div>
                      <p className='leading-relaxed text-gray-700'>{job.description}</p>
                    </div>
                  ))}
                </div>
              </AnimatedCard>

              {/* Skills */}
              <AnimatedCard className='p-8' delay={200}>
                <h2 className='mb-8 text-3xl font-bold'>
                  <GradientText>技能专长</GradientText>
                </h2>
                <div className='grid grid-cols-1 gap-8 md:grid-cols-2'>
                  {['frontend', 'backend', 'tools', 'soft'].map(category => {
                    const categorySkills = skills.filter(skill => skill.category === category);
                    const categoryNames = {
                      frontend: '前端技术',
                      backend: '后端技术',
                      tools: '开发工具',
                      soft: '软技能',
                    };

                    if (categorySkills.length === 0) return null;

                    return (
                      <div key={category}>
                        <h3 className='mb-4 text-lg font-semibold'>
                          {categoryNames[category as keyof typeof categoryNames]}
                        </h3>
                        <div className='space-y-3'>
                          {categorySkills.map(skill => (
                            <div key={skill.name} className='flex items-center justify-between'>
                              <span className='font-medium'>{skill.name}</span>
                              <div className='h-2 w-24 overflow-hidden rounded-full bg-gray-200'>
                                <div
                                  className='h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-1000 ease-out'
                                  style={{ width: `${skill.level}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </AnimatedCard>
            </div>

            {/* Sidebar */}
            <div className='space-y-8'>
              {/* Contact Card */}
              <AnimatedCard className='p-6' delay={300}>
                <h3 className='mb-4 text-lg font-semibold'>联系方式</h3>
                <div className='space-y-3 text-sm'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
                      <svg className='h-4 w-4 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                    </div>
                    <span>{siteConfig.author.email}</span>
                  </div>
                  <div className='flex items-center space-x-3'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-green-100'>
                      <svg className='h-4 w-4 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                        <path
                          fillRule='evenodd'
                          d='M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <span>深圳，中国</span>
                  </div>
                </div>
              </AnimatedCard>

              {/* Fun Facts */}
              <AnimatedCard className='p-6' delay={400}>
                <h3 className='mb-4 text-lg font-semibold'>有趣的事实</h3>
                <div className='space-y-3 text-sm text-gray-600'>
                  <div className='flex items-center space-x-2'>
                    <span>💻</span>
                    <span>写代码的同时也热爱设计</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>🎯</span>
                    <span>性能优化狂热者</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>📚</span>
                    <span>博客写作爱好者</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <span>🌱</span>
                    <span>持续学习新技术</span>
                  </div>
                </div>
              </AnimatedCard>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

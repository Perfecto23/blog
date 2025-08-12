import { BookOpen, Code } from 'lucide-react';
import { AnimatedCard } from '@/components/common/AnimatedCard';
import { getStats } from '@/lib/stats';

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}

export function StatsSection() {
  const statsData = getStats();

  const stats: Stat[] = [
    {
      icon: <Code className='h-8 w-8' />,
      value: statsData.experience,
      label: statsData.experienceLabel,
      color: 'text-blue-600',
    },
    {
      icon: <BookOpen className='h-8 w-8' />,
      value: `${statsData.articles}+`,
      label: statsData.articlesLabel,
      color: 'text-green-600',
    },
  ];

  return (
    <section className='relative bg-gray-50/30 py-16'>
      {/* Background decoration */}
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]'></div>

      <div className='relative mx-auto max-w-6xl px-6'>
        <div className='grid grid-cols-2 justify-items-center gap-6 md:grid-cols-2'>
          {stats.map((stat, index) => (
            <AnimatedCard key={stat.label} delay={index * 100}>
              <div className='group rounded-2xl border border-white/40 bg-white/60 p-6 text-center shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl'>
                <div
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${getGradientClass(stat.color)} mb-4 transition-transform duration-300 group-hover:scale-110`}
                >
                  <div className={stat.color}>{stat.icon}</div>
                </div>
                <div className='mb-2 text-3xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-105'>
                  {stat.value}
                </div>
                <div className='font-medium text-gray-600'>{stat.label}</div>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function getGradientClass(color: string): string {
  switch (color) {
    case 'text-blue-600':
      return 'from-blue-50 to-blue-100';
    case 'text-green-600':
      return 'from-green-50 to-green-100';
    default:
      return 'from-gray-50 to-gray-100';
  }
}

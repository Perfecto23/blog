import type { ContactInfo, SiteConfig, Skill, WorkExperience } from '@/types';

export const siteConfig: SiteConfig = {
  name: '柯芃丞',
  title: '柯芃丞 - 前端开发与工程实践',
  description: '专注现代Web开发技术的前端工程师，分享Vue/React、TypeScript、工程化等领域的实战经验与技术洞察。',
  url: 'https://itmirror.top',
  author: {
    name: '柯芃丞',
    email: 'kepengcheng314@163.com',
    bio: '你好，我是柯芃丞。一名热爱开源、追求代码美学的前端工程师。享受用技术解决问题的过程，乐于分享知识与经验。',
    social: {
      github: 'https://github.com/Perfecto23',
      linkedin: 'https://www.linkedin.com/in/%E8%8A%83%E4%B8%9E-%E6%9F%AF-953759379/',
    },
  },
  seo: {
    keywords: [
      '前端开发',
      'Web开发',
      'JavaScript',
      'TypeScript',
      'Vue.js',
      'React.js',
      'Next.js',
      'Nuxt.js',
      'Vite',
      'Webpack',
      'Node.js',
      'Tailwind CSS',
      'Web性能优化',
      'Web Vitals',
      '用户体验',
      '柯芃丞',
      'IT Mirror',
      '技术博客',
      '前端工程师',
      '个人网站',
    ],
    // 建议为您网站设计一个专属的分享卡片图片，尺寸通常为 1200x630px
    ogImage: 'https://itmirror.top/og-default.svg',
  },

  // 增加的配置
  locale: 'zh-CN', // 'zh-CN' 代表简体中文
  themeColor: '#ffffff', // 网站的主题色，例如白色
};

export const workExperience: WorkExperience[] = [
  {
    title: '高级前端工程师',
    company: '某科技公司',
    duration: '2022 - 至今',
    description: '负责大型Web应用的前端架构设计和开发，主导团队技术选型和代码规范制定，推动前端工程化建设。',
    current: true,
  },
  {
    title: '前端工程师',
    company: '另一家公司',
    duration: '2021 - 2022',
    description: '参与多个核心产品的前端开发，实现复杂交互功能，优化页面性能，提升用户体验。',
  },
];

export const skills: Skill[] = [
  { name: 'Vue.js', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 85, category: 'frontend' },
  { name: 'React', level: 75, category: 'frontend' },
  { name: 'Next.js', level: 80, category: 'frontend' },
  { name: 'JavaScript', level: 90, category: 'frontend' },
  { name: 'CSS/SCSS', level: 85, category: 'frontend' },
  { name: 'Tailwind CSS', level: 90, category: 'frontend' },
  { name: 'Node.js', level: 70, category: 'backend' },
  { name: 'Vite', level: 90, category: 'tools' },
  { name: 'Webpack', level: 80, category: 'tools' },
  { name: 'Git', level: 85, category: 'tools' },
  { name: 'Docker', level: 65, category: 'tools' },
];

export const contactInfo: ContactInfo = {
  email: 'kepengcheng314@163.com',
  location: '深圳，中国',
  phone: '+86 138-0000-0000',
};

export const techStack = [
  { name: 'Vue.js', icon: '🟢', color: 'text-green-600' },
  { name: 'TypeScript', icon: 'TS', color: 'text-blue-600' },
  { name: 'React', icon: '⚛️', color: 'text-cyan-600' },
  { name: 'Next.js', icon: 'N', color: 'text-gray-900' },
  { name: 'Tailwind CSS', icon: 'TW', color: 'text-cyan-500' },
  { name: 'Node.js', icon: '🟢', color: 'text-green-700' },
];

export const stats = [
  { label: '年经验', value: '3+' },
  { label: '项目经验', value: '50+' },
  { label: '技术文章', value: '20+' },
  { label: '代码提交', value: '10k+' },
];

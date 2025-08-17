export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  image?: string;
  readingTime: string;
  content?: string;
  relativePath?: string; // 添加原始文件路径
}

export interface WorkExperience {
  title: string;
  company: string;
  duration: string;
  description: string;
  current?: boolean;
}

export interface Skill {
  name: string;
  level: number;
  category: 'frontend' | 'backend' | 'tools' | 'soft';
}

export interface Project {
  title: string;
  description: string;
  image?: string;
  tech: string[];
  link?: string;
  github?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    bio: string;
    avatar?: string;
    social: {
      github?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
  seo: {
    keywords: string[];
    ogImage: string;
  };
  locale: string;
  themeColor: string;
}

export interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

// SEO 相关类型定义
export interface SEOAnalysisResult {
  issues: string[];
  recommendations: string[];
  score: number;
  metrics: {
    titleLength: number;
    descriptionLength: number;
    wordCount: number;
    imagesCount: number;
    h1Count: number;
    internalLinksCount: number;
  };
}

export interface GAEventData {
  gaId: string;
  url: string;
  title: string;
  analysis: SEOAnalysisResult;
  userAgent: string;
  ip: string;
}

export interface GAEventParams {
  v: string;
  tid: string;
  cid: string;
  t: string;
  ec: string;
  ea: string;
  el: string;
  ev: string;
  cd1?: string;
  cd2?: string;
  cd3?: string;
  cm1?: string;
  cm2?: string;
  cm3?: string;
  dp: string;
  dt: string;
  dh: string;
  ua: string;
  uip: string;
}

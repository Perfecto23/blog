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
  };
}

export interface ContactInfo {
  email: string;
  location: string;
  phone?: string;
}

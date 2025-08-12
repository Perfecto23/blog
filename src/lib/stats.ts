import { getAllPosts } from './mdx';

/**
 * 计算工作经验年数
 * 参加工作时间：2022年3月7日
 */
export function getWorkExperience(): string {
  const startDate = new Date('2022-03-07');
  const currentDate = new Date();

  const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
  const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

  if (diffYears < 1) {
    const months = Math.floor(diffYears * 12);
    return `${months}个月`;
  } else {
    const years = Math.floor(diffYears);
    const months = Math.floor((diffYears - years) * 12);

    if (months >= 6) {
      return `${years + 1}年`;
    } else {
      return `${years}年`;
    }
  }
}

/**
 * 获取技术文章数量
 */
export function getArticleCount(): number {
  const posts = getAllPosts();
  return posts.length;
}

/**
 * 获取格式化的统计数据
 */
export function getStats() {
  return {
    experience: getWorkExperience(),
    articles: getArticleCount(),
    experienceLabel: '工作经验',
    articlesLabel: '技术文章',
  };
}

/**
 * 简单的Markdown渲染组件，专门用于AI摘要内容展示
 * 仅支持基础的Markdown语法：粗体、斜体、列表等
 */

import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * 简单的HTML渲染，不使用复杂的marked自定义渲染器
 * 直接处理基本的Markdown语法
 */
const simpleMarkdownToHtml = (markdown: string): string => {
  let html = markdown;

  // 处理标题
  html = html.replace(/^\*\*([^*]+)\*\*$/gm, '<h2 class="mb-2 text-base font-semibold text-blue-800">$1</h2>');

  // 处理粗体
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-blue-900">$1</strong>');

  // 处理斜体
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic text-blue-700">$1</em>');

  // 处理列表项（简单处理）
  html = html.replace(/^- (.+)$/gm, '<li class="text-blue-800">$1</li>');

  // 包装段落
  const lines = html.split('\n').filter(line => line.trim());
  const processedLines = lines.map(line => {
    if (line.startsWith('<h2') || line.startsWith('<li')) {
      return line;
    }
    if (line.includes('<li')) {
      return `<ul class="mb-3 space-y-1 list-disc list-inside">${line}</ul>`;
    }
    return `<p class="mb-3 leading-relaxed">${line}</p>`;
  });

  return processedLines.join('\n');
};

/**
 * MarkdownRenderer 组件
 * 用于安全地渲染AI生成的Markdown内容
 */
export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // 使用useMemo优化性能，避免重复解析
  const htmlContent = useMemo(() => {
    if (!content) return '';

    try {
      // 使用简单的Markdown解析
      return simpleMarkdownToHtml(content);
    } catch (error) {
      // 解析失败时，返回纯文本内容
      return `<p class="text-blue-800">${content}</p>`;
    }
  }, [content]);

  // 如果没有内容，返回空
  if (!content) {
    return null;
  }

  return <div className={`prose prose-sm max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
}

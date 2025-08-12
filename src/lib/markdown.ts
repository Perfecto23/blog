// 只导入需要的语言
import fs from 'fs';
import path from 'path';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import { marked } from 'marked';

// 注册语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('html', html);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);

// 配置 marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

// 自定义渲染器
const renderer = new marked.Renderer();

// 自定义标题渲染，添加锚点
renderer.heading = function ({ tokens, depth }) {
  const text = this.parser.parseInline(tokens);
  const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');
  return `<h${depth} id="${id}" class="heading-${depth}">${text}</h${depth}>`;
};

// 自定义代码块渲染
renderer.code = function ({ text, lang }) {
  let highlighted = text;
  const displayLang = lang || 'text';

  // 只有当语言被 highlight.js 支持时才进行高亮
  if (lang && hljs.getLanguage(lang)) {
    try {
      highlighted = hljs.highlight(text, { language: lang }).value;
    } catch (error) {
      // 代码高亮失败时使用原始文本
      highlighted = text;
    }
  }

  return `
    <div class="code-block-wrapper">
      <div class="code-block-header">
        <span class="code-language">${displayLang}</span>
        <button class="copy-button" onclick="copyToClipboard(this)">复制</button>
      </div>
      <pre class="code-block"><code class="hljs language-${displayLang}">${highlighted}</code></pre>
    </div>
  `;
};

// 自定义链接渲染
renderer.link = function ({ href, title, tokens }) {
  const text = this.parser.parseInline(tokens);
  const isExternal = href?.startsWith('http') && !href.includes(process.env.NEXT_PUBLIC_SITE_URL || '');
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';

  return `<a href="${href}"${target}${titleAttr} class="markdown-link">${text}</a>`;
};

// 创建图片渲染器工厂函数
function createImageRenderer(articlePath?: string) {
  // 读取本地图像尺寸（支持 PNG 与 JPEG）。失败时返回 null
  function getImageDimensions(absPath: string): { width: number; height: number } | null {
    try {
      const buf = fs.readFileSync(absPath);
      // PNG: 8字节签名 + 4字节长度 + 4字节"IHDR" + 8字节宽高
      if (buf.length > 24 && buf.toString('ascii', 1, 4) === 'PNG') {
        const width = buf.readUInt32BE(16);
        const height = buf.readUInt32BE(20);
        if (width > 0 && height > 0) return { width, height };
      }
      // JPEG: 遍历到 SOF0/1/2
      if (buf[0] === 0xff && buf[1] === 0xd8) {
        let offset = 2;
        while (offset < buf.length) {
          if (buf[offset] !== 0xff) break;
          const marker = buf[offset + 1];
          const len = buf.readUInt16BE(offset + 2);
          // SOF0(C0)/SOF1(C1)/SOF2(C2)
          if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
            const height = buf.readUInt16BE(offset + 5);
            const width = buf.readUInt16BE(offset + 7);
            if (width > 0 && height > 0) return { width, height };
            break;
          }
          offset += 2 + len;
        }
      }
    } catch {}
    return null;
  }

  return function ({ href, title, text }: { href: string; title?: string | null; text: string }) {
    let imageSrc = href;
    let width: number | undefined;
    let height: number | undefined;

    // 如果是相对路径，转换为正确的访问路径
    if (articlePath && (href.startsWith('./') || href.startsWith('img/') || href.startsWith('static/'))) {
      // 构造基于文章路径的图片访问路径
      const articleDir = articlePath.replace(/[^/]*\.mdx?$/, ''); // 移除文件名

      // 处理不同的相对路径格式
      let relativePath = href;
      if (href.startsWith('./')) {
        relativePath = href.substring(2); // 移除 './'
      }

      imageSrc = `/content/${articleDir}${relativePath}`;

      // 尝试读取真实文件尺寸，给出 width/height 以避免 CLS
      const abs = path.join(process.cwd(), 'content', articleDir, relativePath);
      const dims = getImageDimensions(abs);
      if (dims) {
        width = dims.width;
        height = dims.height;
      }
    }

    const titleAttr = title ? ` title="${title}"` : '';
    const sizeAttrs = width && height ? ` width="${width}" height="${height}"` : '';
    return `
      <figure class="markdown-image">
        <img src="${imageSrc}" alt="${text}"${titleAttr}${sizeAttrs} loading="lazy" decoding="async" />
        ${title ? `<figcaption>${title}</figcaption>` : ''}
      </figure>
    `;
  };
}

// 自定义引用渲染
renderer.blockquote = function ({ tokens }) {
  const quote = this.parser.parse(tokens);
  return `<blockquote class="markdown-blockquote">${quote}</blockquote>`;
};

// 默认使用基础渲染器
marked.use({ renderer });

/**
 * 移除 markdown 内容中的第一个 h1 标题
 */
function removeFirstH1(content: string): string {
  // 匹配第一个 h1 标题（支持 # 格式）
  const h1Pattern = /^#\s+.*$/m;

  const match = content.match(h1Pattern);
  if (match) {
    return content.replace(h1Pattern, '').trim();
  }

  return content;
}

export async function renderMarkdown(content: string, articlePath?: string): Promise<string> {
  // 移除第一个 h1 标题以避免重复
  const contentWithoutFirstH1 = removeFirstH1(content);

  // 如果提供了文章路径，使用自定义图片渲染器
  if (articlePath) {
    const customRenderer = new marked.Renderer();

    // 复制所有现有的渲染器设置
    customRenderer.heading = renderer.heading;
    customRenderer.code = renderer.code;
    customRenderer.link = renderer.link;
    customRenderer.blockquote = renderer.blockquote;
    customRenderer.image = createImageRenderer(articlePath);

    return await marked(contentWithoutFirstH1, { renderer: customRenderer });
  }

  return await marked(contentWithoutFirstH1);
}

// 客户端复制功能的脚本
export const copyScript = `
  function copyToClipboard(button) {
    const codeBlock = button.parentElement.nextElementSibling.querySelector('code');
    const text = codeBlock.textContent || '';
    
    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.textContent;
      button.textContent = '已复制';
      button.classList.add('copied');
      
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('copied');
      }, 2000);
    }).catch(err => {
    });
  }
`;

// 为 markdown 内容生成目录
export function generateTOC(content: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = [];
  const lines = content.split('\n');

  lines.forEach(line => {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-');

      headings.push({ id, text, level });
    }
  });

  return headings;
}

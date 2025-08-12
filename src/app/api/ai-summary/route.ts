import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * AI文章总结API路由
 * 接收文章内容，调用豆包大模型生成智能摘要
 */

// 初始化OpenAI客户端，连接到豆包大模型
const openai = new OpenAI({
  apiKey: process.env.ARK_API_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

/**
 * 高质量范例数据，用于Few-Shot学习
 */
const goldStandardExample = {
  input: {
    title: '深入剖析：如何用 Rust 构建高性能的 WebAssembly 服务',
    content: `在现代 Web 开发中，JavaScript 的单线程特性在处理计算密集型任务时往往成为性能瓶颈。本文将深入探讨如何利用 Rust 语言的零成本抽象和内存安全特性，结合 WebAssembly (Wasm) 技术栈，构建出比传统 Node.js 服务快 10 倍的高性能计算服务。

我们从一个实际的业务场景出发：在电商推荐系统中，需要对用户行为数据进行实时的协同过滤计算。传统的 JavaScript 实现在处理大规模数据时响应时间超过 2 秒，严重影响用户体验。

通过 Rust + wasm-pack 工具链，我们将核心算法重写并编译为 Wasm 模块。配置过程包括：安装 Rust 工具链、配置 wasm-pack、编写 Rust 算法代码，以及在 Node.js 中集成调用。

关键的优化技术包括：使用 Rust 的所有权系统避免内存拷贝、利用 SIMD 指令集加速向量计算、通过 wee_alloc 优化内存分配器，以及设计高效的 Rust-JavaScript 数据传递接口。

基准测试结果显示：相同的协同过滤算法，Rust+Wasm 版本的执行时间从 2.1 秒降低到 0.21 秒，内存占用减少 60%。在生产环境中，服务的 QPS 从 50 提升到 500。`,
    targetAudience: '资深后端工程师',
    tags: ['Rust', 'WebAssembly', 'Wasm', '性能优化'],
  },
  output: `**📖 文章摘要**
本文深入探讨了使用 Rust 语言构建高性能 WebAssembly (Wasm) 服务的核心技术与实践。文章直面在 Node.js 中运行计算密集型任务时的性能瓶颈问题，提出并实现了一套基于 Rust 和 wasm-pack 的解决方案。通过将关键业务逻辑从 JavaScript 迁移到 Rust 并编译为 Wasm 模块，在基准测试中实现了近 10 倍的性能提升，展现了 Rust 在服务端的高效能价值。

**💡 阅读收获**
你将学会如何配置 Rust 开发环境，并使用 wasm-pack 工具链将 Rust 代码无缝编译成可供 Node.js 调用的 Wasm 模块。文章提供了一套关键的最佳实践代码，展示了如何在 Rust 和 JavaScript 之间高效地传递复杂数据类型，避免了常见的性能陷阱。通过本文，你可以在未来的项目中，识别出适合用 Rust+Wasm 优化的性能热点，为你的应用带来实质性的性能飞跃。`,
};

/**
 * 创建一个包含 Few-Shot 示例的黄金标准提示词
 * @param title 文章标题
 * @param content 文章原始内容
 * @param targetAudience 文章的目标读者
 * @param tags 文章的技术标签
 * @returns 生成的提示词
 */
function createGoldStandardPrompt(title: string, content: string, targetAudience: string, tags: string[]): string {
  return `
# AI 任务：为技术文章生成专业级摘要

## 1. 角色设定
你是一位资深的技术内容编辑和开发者导师。你的任务是为以下技术文章生成一份高质量、结构化、富有洞察力的智能摘要。你的风格应专业、精准且易于理解，旨在帮助读者快速把握文章精髓并激发阅读兴趣。

## 2. 学习范例 (Example)
这是你任务的一个高质量完成范例。请学习它的结构、风格和深度，并应用到新的任务中。

### 范例输入:
- **文章标题:** ${goldStandardExample.input.title}
- **技术标签:** ${goldStandardExample.input.tags.join(', ')}
- **目标读者:** ${goldStandardExample.input.targetAudience}
- **原始文章内容:**
\`\`\`
${goldStandardExample.input.content}
\`\`\`

### 范例输出:
${goldStandardExample.output}

---

## 3. 新的任务 (Your Task)
现在，请根据上面的学习范例，为以下新文章完成同样的任务。

### 新任务输入:
- **文章标题:** ${title}
- **技术标签:** ${tags.join(', ')}
- **目标读者:** ${targetAudience}
- **原始文章内容:**
\`\`\`
${content}
\`\`\`

### 你的输出:
`;
}

/**
 * 智能推断文章的目标读者群体
 * @param title 文章标题
 * @param content 文章内容
 * @returns 推断的目标读者描述
 */
function inferTargetAudience(title: string, content: string): string {
  const combinedText = `${title} ${content}`.toLowerCase();

  // 初学者关键词
  const beginnerKeywords = [
    '入门',
    '基础',
    '初学',
    '新手',
    '从零',
    '简介',
    '教程',
    'tutorial',
    'basic',
    'introduction',
  ];
  // 进阶关键词
  const advancedKeywords = [
    '深入',
    '高级',
    '进阶',
    '优化',
    '架构',
    '源码',
    '原理',
    'advanced',
    'deep dive',
    'optimization',
  ];
  // 专家关键词
  const expertKeywords = [
    '性能调优',
    '架构设计',
    '底层原理',
    '企业级',
    '大规模',
    '分布式',
    'scalability',
    'architecture',
  ];

  // 技术领域关键词
  const frontendKeywords = ['react', 'vue', 'angular', 'javascript', 'typescript', 'css', 'html', '前端'];
  const backendKeywords = ['node.js', 'java', 'python', 'go', 'rust', 'api', '后端', '服务器'];
  const devopsKeywords = ['docker', 'kubernetes', 'ci/cd', 'devops', '运维', '部署'];
  const mobileKeywords = ['react native', 'flutter', 'ios', 'android', '移动端'];

  let audienceLevel = '开发者';
  let techDomain = '';

  // 判断技术水平
  if (beginnerKeywords.some(keyword => combinedText.includes(keyword))) {
    audienceLevel = '初学者';
  } else if (expertKeywords.some(keyword => combinedText.includes(keyword))) {
    audienceLevel = '资深工程师';
  } else if (advancedKeywords.some(keyword => combinedText.includes(keyword))) {
    audienceLevel = '进阶开发者';
  }

  // 判断技术领域
  if (frontendKeywords.some(keyword => combinedText.includes(keyword))) {
    techDomain = '前端';
  } else if (backendKeywords.some(keyword => combinedText.includes(keyword))) {
    techDomain = '后端';
  } else if (devopsKeywords.some(keyword => combinedText.includes(keyword))) {
    techDomain = 'DevOps';
  } else if (mobileKeywords.some(keyword => combinedText.includes(keyword))) {
    techDomain = '移动端';
  }

  return techDomain ? `${techDomain}${audienceLevel}` : audienceLevel;
}

/**
 * 从文章中提取技术标签
 * @param title 文章标题
 * @param content 文章内容
 * @returns 技术标签数组
 */
function extractTechnicalTags(title: string, content: string): string[] {
  const combinedText = `${title} ${content}`.toLowerCase();
  const tags: string[] = [];

  // 前端技术栈
  const techMap: Record<string, string[]> = {
    React: ['react', 'jsx'],
    Vue: ['vue', 'vuex'],
    Angular: ['angular'],
    TypeScript: ['typescript', 'ts'],
    JavaScript: ['javascript', 'js'],
    'Next.js': ['next.js', 'nextjs'],
    'Tailwind CSS': ['tailwind', 'tailwindcss'],

    // 后端技术栈
    'Node.js': ['node.js', 'nodejs'],
    Python: ['python', 'django', 'flask'],
    Java: ['java', 'spring'],
    Go: ['golang', 'go'],
    Rust: ['rust'],

    // 数据库
    MongoDB: ['mongodb', 'mongo'],
    MySQL: ['mysql'],
    PostgreSQL: ['postgresql', 'postgres'],
    Redis: ['redis'],

    // DevOps & 工具
    Docker: ['docker'],
    Kubernetes: ['kubernetes', 'k8s'],
    Git: ['git'],
    Webpack: ['webpack'],
    Vite: ['vite'],

    // 概念与方法
    性能优化: ['性能', '优化', 'performance', 'optimization'],
    微服务: ['微服务', 'microservice'],
    GraphQL: ['graphql'],
    'REST API': ['rest', 'api'],
    单元测试: ['测试', 'test', 'jest'],
  };

  // 检查每个技术标签
  Object.entries(techMap).forEach(([tag, keywords]) => {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      tags.push(tag);
    }
  });

  // 限制标签数量，返回最多5个
  return tags.slice(0, 5);
}

/**
 * POST请求处理器
 * 处理AI文章总结生成请求
 */
export async function POST(request: NextRequest) {
  try {
    // 解析请求体，获取文章标题和内容
    const { title, content } = await request.json();

    // 输入验证：确保标题和内容都存在
    if (!title || !content) {
      return NextResponse.json({ error: '文章标题和内容不能为空' }, { status: 400 });
    }

    // 内容长度验证：避免过长内容导致API调用失败
    if (content.length > 20000) {
      return NextResponse.json({ error: '文章内容过长，请缩减内容长度' }, { status: 400 });
    }

    // 智能推断目标读者和技术标签
    const targetAudience = inferTargetAudience(title, content);
    const tags = extractTechnicalTags(title, content);

    // 生成用于AI模型的黄金标准提示词（Few-Shot学习）
    const prompt = createGoldStandardPrompt(title, content, targetAudience, tags);

    // 调用豆包大模型API生成文章摘要
    const response = await openai.chat.completions.create({
      model: 'ep-20250810001713-2mkzs', // 豆包大模型ID
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 300, // 限制输出长度，确保摘要简洁
      temperature: 0.7, // 适中的创造性，保持准确性和表达多样性
    });

    // 提取AI生成的摘要内容
    const summary = response.choices[0]?.message?.content;

    // 检查是否成功获取摘要
    if (!summary) {
      return NextResponse.json({ error: 'AI模型未能生成有效摘要，请稍后重试' }, { status: 500 });
    }

    // 返回生成的摘要
    return NextResponse.json({
      summary: summary.trim(),
      success: true,
    });
  } catch (error) {
    // 错误处理：记录详细错误信息并返回用户友好的错误消息

    // 根据错误类型返回不同的错误消息
    if (error instanceof Error) {
      // API调用相关错误
      if (error.message.includes('API')) {
        return NextResponse.json({ error: 'AI服务暂时不可用，请稍后重试' }, { status: 503 });
      }

      // 其他已知错误
      return NextResponse.json({ error: `生成摘要时发生错误：${error.message}` }, { status: 500 });
    }

    // 未知错误
    return NextResponse.json({ error: '服务器内部错误，请稍后重试' }, { status: 500 });
  }
}

/**
 * GET请求处理器
 * 返回API状态信息
 */
export async function GET() {
  return NextResponse.json({
    status: 'AI文章摘要服务正常运行',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
}

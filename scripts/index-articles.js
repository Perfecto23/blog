#!/usr/bin/env node

/**
 * 文章索引管理脚本
 *
 * 用法:
 * node scripts/index-articles.js status     # 查看索引状态
 * node scripts/index-articles.js auto       # 自动索引新文章
 * node scripts/index-articles.js force      # 强制重新索引所有文章
 * node scripts/index-articles.js reset      # 重置索引状态
 */

const https = require('https');
const http = require('http');
const path = require('path');
const fs = require('fs');

// 加载环境变量
function loadEnvLocal() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=');
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
          }
          process.env[key] = value;
        }
      }
    });
  } catch (error) {
    console.warn('⚠️ 未找到 .env.local 文件，使用系统环境变量');
  }
}

loadEnvLocal();

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://itmirror.top';

// 检测是否为本地环境并使用 http 模块
const isLocalhost = BASE_URL.startsWith('http://localhost');

const API_BASE = `${BASE_URL}/api/index`;

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // 根据协议选择 http 或 https 模块
    const client = urlObj.protocol === 'https:' ? https : http;

    const req = client.request(requestOptions, res => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (error) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }

    req.end();
  });
}

async function getIndexStatus() {
  console.log('📊 本地脚本不再维护索引状态\n');
  console.log('💡 索引状态管理已简化：');
  console.log('  - 使用 "auto" 命令检测并索引变更的文章');
  console.log('  - 使用 "force" 命令索引所有文章');
  console.log('  - GitHub Action 会自动处理新文章索引');
  console.log();
  console.log('🔍 如需查看具体的文章列表，请直接检查 content/ 目录');
}

async function autoIndex() {
  console.log('🔄 开始自动索引新文章...\n');

  try {
    // 在本地环境检测git变更
    console.log('🔍 检测本地文件变更...');

    const { execSync } = require('child_process');

    let changedFiles;
    try {
      // 获取新增和修改的markdown文件
      const diffOutput = execSync('git diff --name-status HEAD~1..HEAD -- content/', {
        encoding: 'utf8',
        cwd: process.cwd(),
      }).trim();

      if (!diffOutput) {
        console.log('ℹ️ 没有检测到内容文件变更');
        return;
      }

      // Slug化单个路径段（与MDX库保持一致）
      const slugifySegment = input => {
        return input
          .replace(/^\d+\.\s*/, '') // 去掉数字序号前缀
          .replace(/[^\w\u4e00-\u9fa5]/g, '-') // 替换特殊字符为 -
          .replace(/\-+/g, '-') // 合并多个 -
          .replace(/^-|-$/g, '') // 去掉首尾 -
          .toLowerCase(); // 转小写
      };

      // 生成slug（与MDX库保持一致）
      const generateSlugFromPath = relativePath => {
        const path = require('path');
        const parsed = path.parse(relativePath);
        const fileName = parsed.name;

        // 处理目录路径
        const pathParts = path.dirname(relativePath).split(path.sep).filter(Boolean);
        const categorySegments = pathParts.map(slugifySegment);
        const fileSegment = slugifySegment(fileName);

        return [...categorySegments, fileSegment].filter(Boolean).join('/');
      };

      changedFiles = diffOutput
        .split('\n')
        .filter(line => line.match(/^[AM]\s+.*\.md$/) && !line.includes('.md.rev'))
        .map(line => {
          const filePath = line.replace(/^[AM]\s+/, '').replace(/^content\//, '');
          return generateSlugFromPath(filePath);
        })
        .filter(slug => slug && !slug.includes('img') && !slug.endsWith('空文档占位'));
    } catch (gitError) {
      console.error('❌ Git diff执行失败:', gitError.message);
      console.log('💡 请确保在Git仓库中运行此命令');
      return;
    }

    if (changedFiles.length === 0) {
      console.log('ℹ️ 没有发现需要索引的新文章');
      return;
    }

    console.log(`📝 发现 ${changedFiles.length} 篇文章需要索引:`);
    changedFiles.forEach(path => {
      console.log(`  - ${path}`);
    });
    console.log();

    // 调用索引API
    console.log('📤 提交索引请求...');
    const indexResponse = await makeRequest(`${BASE_URL}/api/gsc/request-indexing`, {
      method: 'POST',
      body: { paths: changedFiles },
    });

    if (indexResponse.status === 200) {
      const result = indexResponse.data;
      console.log(`✅ ${result.message}`);

      if (result.summary) {
        const { summary } = result;
        console.log(`📊 索引结果: 总计 ${summary.total}, 成功 ${summary.success}, 失败 ${summary.failed}`);
      }

      if (result.results) {
        const failed = result.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.log('\n❌ 失败的文章:');
          failed.forEach(r => {
            console.log(`  - ${r.url}: ${r.message}`);
          });
        }
      }
    } else {
      console.error('❌ 索引请求失败:', indexResponse.data);
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

async function forceIndex() {
  console.log('💪 开始强制重新索引所有文章...\n');

  try {
    // 读取本地所有文章
    const fs = require('fs');
    const path = require('path');

    console.log('📁 扫描 content 目录...');

    // Slug化单个路径段（与MDX库保持一致）
    function slugifySegment(input) {
      return input
        .replace(/^\d+\.\s*/, '') // 去掉数字序号前缀
        .replace(/[^\w\u4e00-\u9fa5]/g, '-') // 替换特殊字符为 -
        .replace(/\-+/g, '-') // 合并多个 -
        .replace(/^-|-$/g, '') // 去掉首尾 -
        .toLowerCase(); // 转小写
    }

    // 生成slug（与MDX库保持一致）
    function generateSlugFromPath(relativePath) {
      const parsed = path.parse(relativePath);
      const fileName = parsed.name;

      // 处理目录路径
      const pathParts = path.dirname(relativePath).split(path.sep).filter(Boolean);
      const categorySegments = pathParts.map(slugifySegment);
      const fileSegment = slugifySegment(fileName);

      return [...categorySegments, fileSegment].filter(Boolean).join('/');
    }

    function scanContentDir(dir, basePath = '') {
      const articles = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'img') {
          // 递归扫描子目录
          const subPath = basePath ? `${basePath}/${entry.name}` : entry.name;
          articles.push(...scanContentDir(path.join(dir, entry.name), subPath));
        } else if (entry.isFile() && entry.name.endsWith('.md') && !entry.name.endsWith('.md.rev')) {
          // 找到markdown文件
          const relativePath = basePath ? `${basePath}/${entry.name}` : entry.name;
          const slug = generateSlugFromPath(relativePath);

          if (!slug.endsWith('空文档占位')) {
            articles.push(slug);
          }
        }
      }

      return articles;
    }

    const contentDir = path.join(process.cwd(), 'content');
    const allArticles = scanContentDir(contentDir);

    if (allArticles.length === 0) {
      console.log('❌ 没有找到任何文章');
      return;
    }

    console.log(`📝 发现 ${allArticles.length} 篇文章:`);
    allArticles.slice(0, 10).forEach(article => {
      console.log(`  - ${article}`);
    });
    if (allArticles.length > 10) {
      console.log(`  ... 还有 ${allArticles.length - 10} 篇文章`);
    }
    console.log();

    // 分批处理，避免网络超时和API限制
    const BATCH_SIZE = 5;
    const batches = [];
    for (let i = 0; i < allArticles.length; i += BATCH_SIZE) {
      batches.push(allArticles.slice(i, i + BATCH_SIZE));
    }

    console.log(`📦 将分 ${batches.length} 批次处理，每批 ${BATCH_SIZE} 篇文章`);
    console.log();

    let totalSuccess = 0;
    let totalFailed = 0;
    const allFailures = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const batchNum = i + 1;

      console.log(`📤 处理第 ${batchNum}/${batches.length} 批次 (${batch.length} 篇文章)...`);

      try {
        const indexResponse = await makeRequest(`${BASE_URL}/api/gsc/request-indexing`, {
          method: 'POST',
          body: { paths: batch },
        });

        if (indexResponse.status === 200) {
          const result = indexResponse.data;
          const { summary } = result;

          totalSuccess += summary.success;
          totalFailed += summary.failed;

          console.log(`  ✅ 批次 ${batchNum} 完成: 成功 ${summary.success}/${summary.total}`);

          if (result.results) {
            const failed = result.results.filter(r => !r.success);
            allFailures.push(...failed);
          }
        } else {
          console.error(`  ❌ 批次 ${batchNum} 失败:`, indexResponse.data);
          totalFailed += batch.length;
        }
      } catch (error) {
        console.error(`  ❌ 批次 ${batchNum} 请求失败:`, error.message);
        totalFailed += batch.length;
      }

      // 批次间等待，避免API限制
      if (i < batches.length - 1) {
        console.log(`  ⏱️ 等待 2 秒后处理下一批次...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log();
    console.log('🎉 所有批次处理完成！');
    console.log(`📊 最终结果: 总计 ${allArticles.length}, 成功 ${totalSuccess}, 失败 ${totalFailed}`);

    if (allFailures.length > 0) {
      console.log(`\n❌ 失败的文章 (${allFailures.length}篇):`);
      allFailures.slice(0, 10).forEach(r => {
        console.log(`  - ${r.url}: ${r.message}`);
      });
      if (allFailures.length > 10) {
        console.log(`  ... 还有 ${allFailures.length - 10} 篇失败`);
      }
    }
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
  }
}

async function resetIndex() {
  console.log('🗑️ 索引状态管理已简化\n');
  console.log('💡 新的架构不需要重置状态：');
  console.log('  - 每次都基于git diff检测真正的变更');
  console.log('  - 没有服务端状态需要重置');
  console.log('  - 直接使用 "auto" 或 "force" 命令即可');
}

function showHelp() {
  console.log(`
📚 文章索引管理脚本

用法:
  node scripts/index-articles.js <command>

命令:
  status    显示当前架构说明
  auto      检测git变更并索引新文章  
  force     强制索引所有文章
  reset     显示状态管理说明
  help      显示帮助信息

示例:
  node scripts/index-articles.js auto     # 索引最近变更的文章
  node scripts/index-articles.js force    # 索引所有文章

说明:
  - auto: 基于 "git diff HEAD~1..HEAD" 检测变更
  - force: 扫描 content/ 目录索引所有文章
  - GitHub Action 会自动处理新文章索引
`);
}

async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'status':
      await getIndexStatus();
      break;
    case 'auto':
      await autoIndex();
      break;
    case 'force':
      await forceIndex();
      break;
    case 'reset':
      await resetIndex();
      break;
    case 'help':
    default:
      showHelp();
      break;
  }
}

main().catch(console.error);

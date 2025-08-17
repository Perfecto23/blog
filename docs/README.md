# 博客 SEO 自动索引系统

> 完整的 Google 搜索索引自动化解决方案

## 🎯 概述

本系统实现了博客文章的自动 Google 索引功能，当发布新文章时自动向 Google 提交索引请求，提升 SEO 效果。

### 核心特性

- ✅ **完全自动化**：新文章发布后自动索引，无需人工干预
- ✅ **精确检测**：基于 git diff 只索引真正变更的文章
- ✅ **批量处理**：支持分批索引，避免 API 限制
- ✅ **错误重试**：网络故障时自动重试
- ✅ **完整日志**：详细的操作日志和状态监控

### 系统架构

```
内容更新 → GitHub Action 检测变更 → 生成正确的 slug → 调用生产 API → Google 索引队列
```

## 🚀 快速开始

### 前置要求

1. Google Cloud Project 并启用 Indexing API
2. Google Search Console 访问权限
3. 服务账号密钥配置

### 立即执行：首次完整索引

```bash
# 在项目根目录执行
node scripts/index-articles.js force
```

**预期输出**：
```
💪 开始强制重新索引所有文章...
📝 发现 56 篇文章
📦 将分 12 批次处理，每批 5 篇文章
✅ 批次 1 完成: 成功 5/5
🎉 所有批次处理完成！
📊 最终结果: 总计 56, 成功 54, 失败 2
```

## ⚙️ 完整配置指南

### 1. Google Cloud & Search Console 配置

#### 创建 Google Cloud Project

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用必要的 API：
   ```bash
   gcloud services enable indexing.googleapis.com
   gcloud services enable searchconsole.googleapis.com
   ```

#### 创建服务账号

1. 导航到 **IAM & Admin** → **Service Accounts**
2. 创建服务账号：
   - Name: `blog-seo-service`
   - Role: **Editor** + **Search Console API User**
3. 下载 JSON 密钥文件

#### 配置 Search Console 权限

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 选择网站 → **Settings** → **Users and permissions**
3. 添加服务账号邮箱，权限级别：**完全**

### 2. 环境变量配置

从 JSON 密钥文件提取信息，添加到 `.env.local`：

```env
# Google Search Console API（必需）
GSC_SERVICE_ACCOUNT_EMAIL=blog-seo-service@your-project.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"

# 网站配置
NEXT_PUBLIC_SITE_URL=https://itmirror.top
```

### 3. 测试 API 连接

```bash
# 测试单篇文章索引
curl -X POST "http://localhost:3000/api/gsc/request-indexing" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["技术实践/前端开发/工程化与构建/test-article"]}'
```

## 📖 使用指南

### 本地管理脚本

```bash
# 查看帮助信息
node scripts/index-articles.js help

# 索引所有文章（首次使用）
node scripts/index-articles.js force

# 检测并索引最近变更的文章
node scripts/index-articles.js auto

# 查看当前架构说明
node scripts/index-articles.js status
```

### API 接口

#### 索引请求 API

**端点**: `POST /api/gsc/request-indexing`

**支持两种输入格式**：

```typescript
// 方式1：传入文章 slug（推荐）
{
  "paths": [
    "技术实践/前端开发/工程化与构建/article-slug",
    "生活随笔/读书笔记/book-review"
  ]
}

// 方式2：传入完整 URL
{
  "urls": [
    "https://itmirror.top/blog/some-article",
    "https://itmirror.top/blog/another-article"
  ]
}
```

**响应格式**：
```json
{
  "success": true,
  "results": [
    {
      "url": "https://itmirror.top/blog/article-slug",
      "success": true,
      "message": "索引请求已提交",
      "timestamp": "2024-08-17T08:17:26.460Z"
    }
  ],
  "summary": {
    "total": 1,
    "success": 1,
    "failed": 0
  }
}
```

## 🤖 自动化配置

### GitHub Action 自动索引

系统已集成到 `.github/workflows/feishu2md.yml`：

- **触发时机**：每日 08:00 UTC（北京时间 16:00）
- **检测逻辑**：使用 `git diff HEAD~1..HEAD -- content/` 检测变更
- **处理流程**：自动生成 slug → 调用生产 API → 提交索引请求

### 核心逻辑

```yaml
# 检测变更的 Markdown 文件
changed_files=$(git diff --name-status HEAD~1..HEAD -- content/ | grep -E '^[AM]\s+.*\.md$')

# 转换为正确的 slug 格式
# 去掉数字序号、特殊字符转换、转小写

# 调用生产 API
curl -X POST "https://itmirror.top/api/gsc/request-indexing" \
  -H "Content-Type: application/json" \
  -d "{\"paths\": $paths_json}"
```

## 🔍 URL 生成规则

### 路径转换逻辑

文章文件路径转换为 URL 的规则：

1. **去掉数字序号前缀**：`1. 技术实践` → `技术实践`
2. **特殊字符转换**：空格和特殊字符转为 `-`
3. **转小写**：`MSSP基座` → `mssp基座`
4. **URL 编码**：中文字符自动编码

### 转换示例

```
文件路径: 1. 技术实践/1. 前端开发/1. 工程化与构建/MSSP基座 Webpack 优化过程和前后对比.md
↓
Slug: 技术实践/前端开发/工程化与构建/mssp基座-webpack-优化过程和前后对比
↓
最终URL: https://itmirror.top/blog/技术实践/前端开发/工程化与构建/mssp基座-webpack-优化过程和前后对比
```

## 📊 监控与日志

### GitHub Action 日志

在 GitHub Actions 页面查看：
- 内容同步状态
- 索引请求提交结果
- 错误信息和重试状态

### 本地脚本输出

```bash
📦 将分 12 批次处理，每批 5 篇文章

📤 处理第 1/12 批次 (5 篇文章)...
  ✅ 批次 1 完成: 成功 5/5
  ⏱️ 等待 2 秒后处理下一批次...

🎉 所有批次处理完成！
📊 最终结果: 总计 56, 成功 54, 失败 2
```

### Google Search Console

在 [Search Console](https://search.google.com/search-console) 查看：
- 索引覆盖率报告
- 索引请求状态
- 抓取错误和问题

## 🛠️ 故障排除

### 常见问题

**1. 网络连接超时**
```bash
❌ 请求失败: Client network socket disconnected
```
**解决方案**：检查网络连接，稍后重试

**2. Google API 认证失败**
```bash
❌ Google API认证失败: No key or keyFile set
```
**解决方案**：检查环境变量中的服务账号配置

**3. 权限被拒绝**
```bash
❌ Permission denied. Failed to verify the URL ownership
```
**解决方案**：在 Search Console 中添加服务账号权限

**4. API 配额超限**
```bash
❌ Quota exceeded for quota metric 'Requests per day'
```
**解决方案**：等待配额重置（每日 200 个请求限制）

### 调试命令

```bash
# 测试本地环境
node scripts/index-articles.js status

# 测试生产 API
curl -s "https://itmirror.top/api/gsc/request-indexing"

# 查看 GitHub Action 日志
# 访问：https://github.com/your-username/blog/actions

# 本地测试 slug 生成
node -e "console.log('测试 slug 生成逻辑')"
```

## 📈 性能优化

### 当前配置

- **批次大小**：5 篇文章/批次
- **批次间隔**：2 秒
- **API 超时**：120 秒
- **重试机制**：3 次重试，间隔 10 秒

### 最佳实践

1. **避免频繁索引**：只索引真正变更的文章
2. **批量处理**：减少 API 调用次数
3. **错误重试**：网络故障时自动重试
4. **监控配额**：关注 Google API 使用情况
5. **定期检查**：每月查看 Search Console 报告

## ⚠️ 注意事项

### API 限制

- **每日配额**：Google Indexing API 每天 200 个请求
- **速率限制**：建议批次间隔 2 秒以上
- **URL 要求**：必须是已验证的网站所有者

### 安全考虑

- **密钥保护**：永远不要将私钥提交到代码仓库
- **权限最小化**：服务账号只给必要的权限
- **环境隔离**：生产和开发使用不同的配置

### 维护建议

- **定期检查**：每月查看索引覆盖率报告
- **监控错误**：关注失败的索引请求
- **更新密钥**：定期轮换服务账号密钥
- **备份配置**：保存重要的配置信息

## 🔗 相关链接

- [Google Indexing API 文档](https://developers.google.com/search/apis/indexing-api/v3/quickstart)
- [Google Search Console](https://search.google.com/search-console)
- [Google Cloud Console](https://console.cloud.google.com/)
- [GitHub Actions 文档](https://docs.github.com/actions)

## 📝 更新日志

- **v2.0** (2024-08-17): 重构架构，修复 slug 生成，简化状态管理
- **v1.0** (2024-08-14): 初始版本，基本的索引功能

---

> **重要提示**：首次部署需要执行完整索引，之后系统将自动维护。建议在网络环境良好的情况下执行初始化操作。

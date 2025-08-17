# Google API 配置详细指南

> 本文档是 [主文档](./README.md) 的补充，提供详细的 Google API 配置步骤

## 🎯 第一步：创建 Google Cloud Project

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 记录项目ID，后续需要使用

## 🔑 第二步：启用必要的API

在Google Cloud Console中启用以下API：

```bash
# 在Cloud Shell中执行
gcloud services enable indexing.googleapis.com
gcloud services enable searchconsole.googleapis.com
gcloud services enable webmasters.googleapis.com
```

或通过界面启用：

- Google Indexing API
- Search Console API
- Web Search Indexing API

## 👤 第三步：创建服务账号

1. 导航到 **IAM & Admin** → **Service Accounts**
2. 点击 **Create Service Account**
3. 填写服务账号信息：
   - Name: `blog-seo-service`
   - Description: `用于博客SEO自动化的服务账号`

4. 分配角色：
   - **Editor** （编辑者）
   - **Search Console API User**

5. 创建并下载JSON密钥文件

## 📝 第四步：提取环境变量

从下载的JSON文件中提取以下信息：

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "client_email": "blog-seo-service@your-project.iam.gserviceaccount.com",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
}
```

将以下内容添加到 `.env.local`：

```env
GSC_SERVICE_ACCOUNT_EMAIL=blog-seo-service@your-project.iam.gserviceaccount.com
GSC_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----"
GSC_SITE_PROPERTY=https://itmirror.top
```

## 🏠 第五步：在Search Console中添加服务账号

1. 访问 [Google Search Console](https://search.google.com/search-console)
2. 选择您的网站属性
3. 点击 **Settings** → **Users and permissions**
4. 点击 **Add user**
5. 输入服务账号邮箱地址
6. 选择权限级别：**Owner** 或 **Full**

## 🧪 第六步：测试API连接

创建测试脚本验证配置：

```typescript
// scripts/test-gsc-api.ts
import { google } from 'googleapis';

async function testGSCConnection() {
  try {
    const auth = new google.auth.JWT(
      process.env.GSC_SERVICE_ACCOUNT_EMAIL,
      undefined,
      process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/indexing']
    );

    const indexing = google.indexing({ version: 'v3', auth });

    // 测试获取配额信息
    const quota = await indexing.urlNotifications.getMetadata();
    console.log('✅ GSC API连接成功!', quota.data);
  } catch (error) {
    console.error('❌ GSC API连接失败:', error);
  }
}

testGSCConnection();
```

## 📊 第七步：SEO监控面板使用

### 开发环境

```bash
npm run dev
# 访问任意页面，右下角会出现📊按钮
# 点击查看实时SEO分析面板
```

### 生产环境

```bash
npm run build && npm start
# SEO数据会自动收集并发送到Google Analytics
# 可以在GA中查看自定义事件 "seo_metrics"
```

## 🎯 第八步：自动化索引请求

配置完成后，可以通过API请求重新索引：

```bash
# 请求重新索引单个页面
curl -X POST https://itmirror.top/api/gsc/request-indexing \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://itmirror.top/blog/new-article"]}'

# 批量请求重新索引
curl -X POST https://itmirror.top/api/gsc/request-indexing \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://itmirror.top/", "https://itmirror.top/about", "https://itmirror.top/blog"]}'
```

## ⚠️ 注意事项

1. **API配额限制**：Google Indexing API每天有200个请求的限制
2. **权限验证**：确保服务账号在Search Console中有正确权限
3. **私钥安全**：永远不要将私钥提交到代码仓库
4. **环境隔离**：生产和开发环境使用不同的服务账号

## 🔧 故障排除

### 常见错误及解决方案

**403 Forbidden**

- 检查服务账号是否在Search Console中有权限
- 确认API已启用

**400 Bad Request**

- 检查URL格式是否正确
- 确认网站已在Search Console中验证

**401 Unauthorized**

- 检查服务账号邮箱和私钥是否正确
- 确认私钥格式中的换行符处理

需要帮助？查看 [Google Indexing API 文档](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

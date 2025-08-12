# 日志系统使用示例

## 基础用法

```typescript
import { log } from '@/lib/logger';

// 调试信息
log.debug('组件渲染开始', { component: 'MyComponent', props: { id: 123 } });

// 信息记录
log.info('用户登录成功', { userId: 'user123', timestamp: Date.now() });

// 警告信息
log.warn('API响应较慢', { url: '/api/posts', duration: 3000 });

// 错误记录
log.error('文件读取失败', new Error('ENOENT'), { filePath: './content/post.md' });
```

## 专用日志方法

### 性能监控

```typescript
const startTime = Date.now();
// ... 执行耗时操作
log.performance('数据加载', startTime, { dataType: '博客文章' });
```

### API调用

```typescript
log.api('GET', '/api/posts', 200, 150, { userId: 'user123' });
```

### 用户行为

```typescript
log.userAction('点击按钮', { buttonId: 'submit', page: '/contact' });
```

### 组件生命周期

```typescript
log.component('BlogPost', '挂载完成', { postId: 'slug-123' });
```

### 路由跳转

```typescript
log.route('/blog', '/blog/post-1', { userId: 'user123' });
```

### 数据加载

```typescript
log.dataLoad('博客文章', true, 25, { category: '技术' });
```

## 日志级别

- **DEBUG**: 详细的调试信息，仅在开发环境显示
- **INFO**: 一般信息，开发环境显示
- **WARN**: 警告信息，所有环境显示
- **ERROR**: 错误信息，所有环境显示

## 环境配置

- **开发环境**: 显示所有级别的日志
- **生产环境**:
  - 服务端：显示 WARN 和 ERROR 级别
  - 客户端：不显示任何日志（通过构建配置移除）

## 上下文信息

所有日志方法都支持传入上下文对象：

```typescript
const context = {
  userId: 'user123',
  sessionId: 'session456',
  page: '/blog',
  component: 'BlogList',
  action: '加载文章列表',
};

log.info('文章列表加载成功', context);
```

## 日志格式

```
[2023-12-07 14:30:15] [客户端] [INFO] [userId=user123 page=/blog] 文章列表加载成功
```

格式说明：

- `[时间戳]`: ISO格式的时间
- `[环境]`: 客户端/服务端
- `[级别]`: DEBUG/INFO/WARN/ERROR
- `[上下文]`: key=value格式的上下文信息
- `消息内容`: 具体的日志信息

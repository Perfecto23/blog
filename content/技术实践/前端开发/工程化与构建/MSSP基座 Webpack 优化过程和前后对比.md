---
title: "MSSP基座 Webpack 优化过程和前后对比"
date: 2025-08-08T00:36:48+08:00
updated: 2025-08-08T00:40:31+08:00
---

# MSSP 基座 Webpack 优化过程和前后对比

最近一个多月流水线构建老是失败，用了一些网上的解决方案都没法解决这个问题，排查了一段时间，发现大概率是在代码压缩环节出现了问题。所以最终决定把 vue-cli 内置的代码压缩工具给换掉，顺便优化一下 webpack 相关的配置。以下是优化流程。

## 用 esbuild 代替 terser 压缩代码、配置 browselist 兼容低版本浏览器

vue-cli 在构建过程中，默认会使用 terser 压缩代码，科普一下 terser、esbuild、swc 的区别。

> `teser`: 基于 `Nodejs`，由 `uglify` fork 出来的新一代压缩工具
>
> - 优点: 功能齐全，支持 `tree-shaking`，压缩比率最高
> - 缺点: 速度相对较慢
>   `esbuild`: 基于 `Go`,支持 js 代码压缩
> - 优点: 速度快
> - 缺点: 压缩比率相对 `terser` 低，压缩时如果 target 设置成 es5，js 代码内不能出现 es6+ 代码，不然会报错
>   `swc`: 基于 `Rust`，支持 js 代码压缩
> - 优点: 速度快
> - 缺点: 压缩比率相对 `terser` 低

经过调研，目前三者关于压缩率与压缩时间，如下所示：

> - 压缩率 `terser` > `esbuild` > `swc`
> - 压缩时间 `esbuild` > `swc` > `terser`

最终选择了 esbuild 来代替 terser，由于使用 esbuild 的时候 target 不能设置成 es5，所以 target 设置成 es6。

```javascript
config.optimization = {
  minimizer: [
    new TerserPlugin({
      minify: TerserPlugin.esbuildMinify,
      terserOptions: {
        target: 'es2015',
      },
    }),
  ],
}
```

target 设置成 es6 兼容性容易出问题，所以还需要额外配置下 browselist，来兼容低版本浏览器。生产环境按照公司目前的兼容性规范来设置浏览器版本，开发环境则使用最新的浏览器版本，不做兼容性处理，从而提升 dev 的速度。

```json
// packages/mss/package.json
{
  ...
  "browserslist": {
        "production": [
            "ie >= 11",
            "chrome >= 49",
            "firefox >= 52",
            "edge >= 18",
            "safari >= 11"
        ],
        "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version",
            ">0.3%",
            "not ie 11",
            "not dead",
            "not op_mini all"
        ]
    }
}
```

这里有一个细节，再执行这一步修改之前，我们执行 build 命令控制台会显示：

`Building for production...`

修改配置后重新执行构建会发现控制台显示，提示正在构建支持老旧浏览器(不支持 esm)而添加的降级功能和兼容性代码：

`Building legacy bundle for production...`

然后构建完 legacy bundle 又会开始显示，提示正在构建浏览器支持原生 esm 的代码：

`Building module bundle for production...`

说明我们原先没有对兼容性做额外的特殊处理，都是使用的默认配置。。。

配置修改前后耗时对比如下：

可以看到对 dev 的速度有非常显著的提升，主要原因是我们 dev 直接构建出 es6 代码而不做兼容性处理，加上 esbuild 本身就快，所以比较明显。

但是 build 的时候我们其实从 1 次构建变成了 2 次构建，第一次构建低版本浏览器的代码，第二次构建高版本浏览器的代码。

即便如此还是将初次 build（无缓存）的速度提升了 15%~21%，但是不可避免的拖慢了二次 build 的速度（有缓存），但是对于流水线来说不需要考虑二次 build 慢了那么一点的情况。。。。

由于配置了 browselist 的缘故，打了一些 polyfill，所以 5Mb 的体积差异可以接受。

## 输出结果移除路径信息？不

[https://webpack.docschina.org/guides/build-performance/#output-without-path-info](https://webpack.docschina.org/guides/build-performance/#output-without-path-info)

根据 webpack 文档的优化建议：

> Webpack 会在输出的 bundle 中生成路径信息。然而，在打包数千个模块的项目中，这会导致造成垃圾回收性能压力。

实测，配置了 `output.pathinfo = false` 后，经过前后对比发现没什么卵用。。。。。几乎 0 提升，甚至 build 阶段还更慢了。。。并没有文档所描述的效果，就不改了。

## 生产环境移除 eslint

默认配置生产环境和开发环境都会开启 eslint。尝试将 build 阶段的 eslint 移除，是否能达到构建加速的目的。

开发环境开启 eslint，构建时关闭，在静态检查的流水线上执行 eslint 任务。

修改代码如下：

```javascript
// packages/mss/vue.config.js
module.exports = defineConfig({
  // 构建时关闭lint
  lintOnSave: !isProd,
}

// config/loader.js
// 生产环境关闭ESLint校验，加速构建, 把eslint迁出成单独的CI任务
if (isProd) {
  config.plugins.delete('eslint');
} else {
  // 修改自带的eslint-webpack-plugin插件配置
  config.plugin('eslint').tap(options => {
    return [
      {
        ...options[0],
        fix: true, // 自动修复
        threads: true, // 多线程加速
        lintDirtyModulesOnly: true, // 只检查被修改过的模块
      },
    ];
  });
}
```

由于 dev 阶段没差异，所以只需要测试一下 build 的差异。

嗯。。。好像不是很明显，先这样吧。

## 开启 vue-loader 缓存

根据官方文档尝试给 vue-loader 和 ts-loader 开启缓存，很简单：安装一下 `cache-loader` 就好了。

安装前使用 `vue inspect --rule vue` 查看 vue 文件的 rule，如下：

```javascript
/* config.module.rule('vue') */
{
  test: /\.vue$/,
  use: [
    /* config.module.rule('vue').use('vue-loader') */
    {
      loader: 'C:\\project\\soc_workflow_webui\\oversea\\node_modules\\.pnpm\\vue-loader@15.10.1_syqj5rg654geyj7bmlgufunpj4\\node_modules\\vue-loader\\lib\\index.js',  
      options: {
        compilerOptions: {
          whitespace: 'preserve'
        }
      }
    }
  ]
}
```

安装后可以发现 rule 变了，如下：

```javascript
{
  test: /\.vue$/,
  use: [
    /* config.module.rule('vue').use('cache-loader') _/_
_    {_
_      loader: 'C:\\project\\soc_workflow_webui\\webpack-optimize-ci\\node_modules\\.pnpm\\cache-loader@4.1.0_webpack@5.75.0\\node_modules\\cache-loader\\dist\\cjs.js',_
_      options: {_
_        cacheDirectory: 'C:\\project\\soc_workflow_webui\\webpack-optimize-ci\\packages\\mss\\node_modules\\.cache\\vue-loader',_
_        cacheIdentifier: 'ddbf4f72'_
_      }_
_    },_
_    /_ config.module.rule('vue').use('vue-loader') */
    {
      loader: 'C:\\project\\soc_workflow_webui\\webpack-optimize-ci\\node_modules\\.pnpm\\vue-loader@15.10.1_z6gewpqgqeafzh3dvbwg7n6wpa\\node_modules\\vue-loader\\lib\\index.js',
      options: {
        compilerOptions: {
          whitespace: 'preserve'
        },
        cacheDirectory: 'C:\\project\\soc_workflow_webui\\webpack-optimize-ci\\packages\\mss\\node_modules\\.cache\\vue-loader',
        cacheIdentifier: 'ddbf4f72'
      }
    }
  ]
}
```

可以看到不仅多了个 cache-loader 还指定了缓存文件夹的位置。

熟悉 webpack 的大佬们知道，webpack 中 rule 规则的 loader 执行顺序是从下往上执行的，所以 vue-loader 执行的结果会经过 cache-loader 的处理被 cache-loader 缓存起来。

以下是前后对比：

可以看到 cache-loader 的开启，使二次 dev 的速度快了非常多。

从数据可以看出来，初次 dev 慢了 11 秒，怎么说也多了个 loader，在无缓存的情况下慢一点点是可以接受的，换来的是有缓存情况下 46 秒的提升；build 阶段的前后差异在 5%~6%，相当于回到了关闭 eslint 校验之前的水平，感觉可以接受。

后续再研究一下其他耗时的 loader 有没有什么优化方案。。。。本期优化先到这里。

具体代码见 PR：[http://mq.code.sangfor.org/SS/SOC/soc_workflow_webui/merge_requests/17441#](http://mq.code.sangfor.org/SS/SOC/soc_workflow_webui/merge_requests/17441#)

本次设计 webpack 配置的改动，可能出 bug，需要在环境上验证一段时间后合入上线。

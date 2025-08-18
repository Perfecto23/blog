---
title: "从 Vue CLI 到 Rsbuild 的迁移指南"
date: 2025-08-08T17:24:08+08:00
updated: 2025-08-08T17:32:01+08:00
---

# 从 Vue CLI 到 Rsbuild 的迁移指南

# 背景

随着 MSSP 的项目体积越来越庞大，基于 Webpack 5 的打包工具 Vue CLI 5 在本地 dev 和 build 都非常慢，冷启动 dev 的时间需要 5 分钟 +，流水线 build 构建需要 8 分钟 +。Vue CLI 5 现在已经进入了长期维护的模式，将来也不会再更新；而 Rspack 这个新兴的、基于 Rust 的 Webpack 重构版本在前段时间迎来了稳定的 1.x 版本，已经被字节团队大多数项目采用，本着拥抱变化、提升效率的目的，决定把 MSSP——这个庞大的微前端项目的打包工具 Vue CLI 5

# Why Rsbuild？

Rsbuild 是由 [Rspack](https://rspack.rs/zh/) 驱动的高性能构建工具，它默认包含了一套精心设计的构建配置，提供开箱即用的开发体验，并能够充分发挥出 Rspack 的性能优势。

Rsbuild 提供 [丰富的构建功能](https://rsbuild.rs/zh/guide/start/features)，包括编译 TypeScript、JSX、Sass、Less、CSS Modules、Wasm，以及其他资源，也支持模块联邦、图片压缩、类型检查、PostCSS、Lightning CSS 等功能。

你可以将 Rsbuild 理解为一个现代化的 Create React App 或 Vue CLI，它与这些工具的主要区别在于：

- 底层的打包工具由 webpack 替换为 Rspack，提供 5 ~ 10 倍的构建性能。
- 与前端 UI 框架解耦，并通过 [插件](https://rsbuild.rs/zh/plugins/list/) 来支持所有 UI 框架，包括 React、Vue、Svelte、Solid 等。
- 提供更好的扩展性，你可以通过 [配置](https://rsbuild.rs/zh/config/)、 [插件 API](https://rsbuild.rs/zh/plugins/dev/) 和 [JavaScript API](https://rsbuild.rs/zh/api/start/) 来灵活地扩展 Rsbuild。

# 迁移方案对比

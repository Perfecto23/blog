---
title: "Rust 语法学习 - 开篇 "
date: 2025-08-18T11:32:21+08:00
updated: 2025-08-18T11:35:29+08:00
---

# Rust 语法学习 - 开篇

记录学习 Rust 语言的笔记。笔记内容从基础语法到高级特性，适合有其他编程语言经验（特别是前端开发者）的读者参考。

## 笔记结构

[1. Rust 基础语法](https://hcne18me5gmi.feishu.cn/wiki/Ik1awmSwXiH2TvkiahOc7pVWnrG) - 变量、数据类型、函数、控制流等

[2. Rust 所有权系统](https://hcne18me5gmi.feishu.cn/wiki/WgFGwOiMwirsp8kYV94cVnMznnb) - Rust 的核心特性：所有权、借用、生命周期

[3. Rust 结构体与枚举](https://hcne18me5gmi.feishu.cn/wiki/NjhkwEOX0iREwHkqokTcWC1Anuf) - 自定义类型和模式匹配

[4. Rust 模块系统](https://hcne18me5gmi.feishu.cn/wiki/APcZwMBZXi1TCGkFfQ0cPEVMnD8)** **- 代码组织、访问控制和包管理

[5. Rust 集合类型](https://hcne18me5gmi.feishu.cn/wiki/PAd0wwCYRiKUZckd4JrcrARunnh) - Vector、String、HashMap 等集合

[6. Rust 错误处理](https://hcne18me5gmi.feishu.cn/wiki/NpHJw2UoeiCKLMkGDxMcCqYfnfh)** **- panic! 和 Result 类型

[7. Rust 泛型、Trait 和生命周期](https://hcne18me5gmi.feishu.cn/wiki/EMV3wnhQCiNf6tkRj9VcstYsnec) - 代码复用和抽象

[8. Rust 函数式编程特性](https://hcne18me5gmi.feishu.cn/wiki/HLJ7w4C81iJ25UkMx95cqLQpn8g)** **- 闭包和迭代器

## 学习路径建议

作为前端开发者学习 Rust，建议按照以下路径进行：

1. 先了解基础语法，熟悉 Rust 的基本概念和语法结构
2. 重点学习所有权系统，这是 Rust 区别于其他语言的核心特性
3. 学习结构体、枚举和模块系统，掌握 Rust 的代码组织方式
4. 深入理解集合类型和错误处理，这些在实际编程中经常使用
5. 掌握泛型、Trait 和生命周期的概念，用于代码复用和抽象
6. 最后学习函数式编程特性，将你在 JavaScript/TypeScript 中的函数式编程知识迁移到 Rust

## 与 JavaScript/TypeScript 的比较

具体看：[9. Rust 与 JavaScript/TypeScript 对比](https://hcne18me5gmi.feishu.cn/wiki/PGxBw0KvuieknIkKd0pcrq3vnnd)

总结：

- Rust 是静态类型语言，编译时进行类型检查
- Rust 没有垃圾回收，而是使用所有权系统管理内存
- Rust 的错误处理机制更加严格和明确
- Rust 的模块系统与 JS/TS 的 import/export 机制不同
- Rust 的迭代器和闭包与 JS 的高阶函数有相似之处，但更加严格

## 进一步学习资源

- [Rust 官方文档](https://doc.rust-lang.org/)
- [Rust 程序设计语言（中文版）](https://kaisery.github.io/trpl-zh-cn/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)
- [Rustlings](https://github.com/rust-lang/rustlings/) - 小练习帮助你熟悉 Rust 代码
- [Rust 标准库文档](https://doc.rust-lang.org/std/)

## 练习项目建议

完成这些笔记的学习后，可以尝试以下小项目巩固所学知识：

1. 命令行工具（如文件搜索工具、简单的待办事项管理器）
2. Web API 服务器（使用 Actix Web 或 Rocket 框架）
3. 使用 WebAssembly 为前端项目优化性能密集型功能
4. 简单的系统工具（如文件监控器、进程管理器）

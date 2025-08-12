---
title: Cursor使用教程
date: 2025-08-08T21:32:35+08:00
updated: 2025-08-08T21:33:11+08:00
---

# Cursor 使用教程

## 一、初始化教程

1. 安装 cursor，同步 vscode 的插件和配置，打开隐私模式（必须）
2. 配置内网代理
3. 禁用 http2
4. 登录账号，内网点 login 后将打开的链接复制到外网登录，然后登录成功内网就登上了。
5. 配置 cursorignore 文件，右上角点开 cursor 设置

   1. 在 Feature 栏
      1. 找到 Codebase Indexing，点击绿色按钮把项目进行向量化。
      2. 建议 tab 相关的设置如下：
      3. 建议 chat 相关的设置如下：
      4. 建议 Editor 和 Terminal 的设置如下：
   2. 在 General 栏找到 Rules for AI，配置以下提示词：

   > ```sql
   > ```
   >

You are an expert in TypeScript, Node.js, Vite, Vue.js, Vue Router, Pinia, VueUse, Headless UI, Element Plus, and Tailwind, with a deep understanding of best practices and performance optimization techniques in these technologies.

Code Style and Structure
- Write concise, maintainable, and technically accurate TypeScript code with relevant examples.
- Use functional and declarative programming patterns; avoid classes.
- Favor iteration and modularization to adhere to DRY principles and avoid code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Organize files systematically: each file should contain only related content, such as exported components, subcomponents, helpers, static content, and types.
- Always respond in 中文

```
Naming Conventions
- Use lowercase with dashes for directories (e.g., components/auth-wizard).
- Favor named exports for functions.

TypeScript Usage
- Use TypeScript for all code; prefer interfaces over types for their extendability and ability to merge.
- Avoid enums; use maps instead for better type safety and flexibility.
- Use functional components with TypeScript interfaces.

Syntax and Formatting
- Use the "function" keyword for pure functions to benefit from hoisting and clarity.
- Always use the Vue Composition API script setup style.

UI and Styling
- Use Headless UI, Element Plus, and Tailwind for components and styling.
- Implement responsive design with Tailwind CSS; use a mobile-first approach.

Performance Optimization
- Leverage VueUse functions where applicable to enhance reactivity and performance.
- Wrap asynchronous components in Suspense with a fallback UI.
- Use dynamic loading for non-critical components.
- Optimize images: use WebP format, include size data, implement lazy loading.
- Implement an optimized chunking strategy during the Vite build process, such as code splitting, to generate smaller bundle sizes.

Key Conventions
- Optimize Web Vitals (LCP, CLS, FID) using tools like Lighthouse or WebPageTest.
```

```
	1. 在Model栏关闭多余的模型，建议保留claude-3.5-sonnet、gpt-4o、gpt-4o-mini、o1-mini、o1-preview

6. 愉快的进行开发

## 二、操作教程

### Tab功能（Tab）

根据当前的代码上下文，自动生成代码补全的建议，用户直接通过Tab键就可以完成代码的修改与补全。

1. 补全：编写代码的时候cursor会随着光标的移动生成补全建议，

2. 用户

3. 可能只输入了函数定义和第一行，Cursor的Tab功能就能智能地补全剩余的代码，以placeholder的形式出现，按tab应用，支持多行补全。
	1. 切换候选：可以通过按`Ctrl + →`来接受下一个建议。这让用户能更精细地控制代码补全的过程。

4. 智能重写：Cursor的Tab功能不只是简单的代码补全。它还能聪明地改写用户已经写好的代码。这就是Cursor最引以为豪的"代码编辑"功能。无论是小改动还是大重构，这个功能都能派上大用场。在进行代码重写（或修改）时，Cursor的代码修改建议会通过提示框的形式展现出来，而不是代码补全的灰色代码提示。

5. 光标预测：Cursor还能预测用户下一步可能要编辑的位置。这个强大的功能被称为"光标预测"。修改了一个函数的名称，Cursor 预测到下面红圈位置的函数名也应该随着改变。

6. 跳转补全：Cursor的Tab功能不仅限于主编辑窗口，在"Go to Definition"或"Go to Type Definition"的预览窗口中也可以使用。这个特性在添加新的函数参数时特别有用。当用户需要修改一个函数定义，然后快速修复所有使用该函数的地方时，这个功能就非常方便。用户可以在预览窗口中使用Tab功能来修改函数定义，添加一个新的参数。

7. 

Cursor的Tab强大之处在于：

1. 补全很准确，基于claude-3.5-sonnet

2. 不仅限于插入代码，还能智能重写代码，选中代码也会出修改的补全建议

3. 光标预测，修改代码时它能在当前文件预测用户下一步要把光标移到哪里去修改代码，一直按tab就可以

### 提示框功能(Ctrl + K)

提示栏(Cmd K)是 Cursor 中最快速与 AI 交互的方式。它就像一个随时待命的编程助手，让用户能快速获得 AI 的帮助。

#### ① 代码编辑

1. 在代码编辑框中，按下Ctrl K就会弹出提示栏

2. 在提示栏中输入prompt，生成代码建议
	1. Cursor会自动尝试找到有用的信息来改善代码生成，除了用户手动包含的@符号外。还会有这些额外的上下文：
		1. 与当前编辑的代码相关的文件
		2. 最近查看的文件
	2. Cursor会根据当前编辑/生成的相关性对上下文项进行排序，并保留最相关的项目作为大型语言模型的上下文。

3. 内联生成
	1. 如果没有选中任何代码，Cursor将根据用户在提示栏中输入的内容生成新代码。
	2. 如果选中某段代码，Cursor将根据用户在提示栏中输入的内容修改选中的代码。

#### ② 终端编辑

在Cursor的内置终端中，可以按下`Ctrl+K`来打开终端底部的提示栏。

1. 在提示栏里，用简单的话说说你想在终端里做什么。

2. Cursor 会根据你的描述，自动帮你写出一个终端命令。

3. 如果你觉得这个命令可以用：
	- 按一下 `Esc`键，命令就会出现在终端里，但还不会执行。
	- 如果你想立即执行这个命令，就按 `Ctrl+Enter`。

4. Cmd K默认会考虑以下上下文：
	- 终端里面最近的历史记录
	- 提示栏中的任何其他内容

#### ③ 技巧

1. 后续提示：AI第一次生成的代码可能有点问题，可以直接在提示栏里说"这个函数需要添加错误处理"。然后`按下Enter`，AI就会根据新指示修改代码。不需要重新开始整个过程，而是可以在原有的基础上继续改进。

2. 快速回答：有时候，我们可能需要快速了解某段代码的功能或获取一些简单的信息，但又不想立即生成或修改代码。在提示栏输入你的问题后按`Alt+Enter`，Cursor会立即回答你关于选中内容和相关上下文的任何问题（而不会生成或修改代码）。 

3. 这个功能特别有用，因为：
	1. 它能快速解答你的疑问，帮你更好地理解代码。
	2. 你不需要切换到聊天窗口，可以直接在编辑器中获得答案。
	3. 这个对话的内容会被记住，所以你可以在后续的操作中利用这些信息。

### 聊天功能（Ctrl + L）

聊天功能主要负责通用的问题解决。

聊天功能提供了多轮对话的方式，当你遇到比较抽象或不明确的问题时，一次回答可能解决不了所有疑问。

通过多次对话，AI可以逐步弄清楚问题的细节，给出更准确和全面的答案。这种对话方式不仅能帮你更好地理解问题，还能引导你找到最好的解决方案。

所以聊天功能非常适合以下的场景：

1. 解答编程概念问题，学习新技术或框架

2. 获取代码建议和最佳实践

3. 调试和错误排查

对比与其他的AI插件（如Fitten、Frieren、CodeGeex之流），Cursor的Chat功能厉害之处在哪里？

1. 基于@的`上下文快速引用能力`

2. 代码修改的 `Apply` 能力

不仅 ChatGPT 没有这些功能，就连其他的代码编辑器也没有提供类似的能力。

#### ① Apply

应用代码块后，可以查看修改的 diff 内容，可以直接点击聊天窗口中代码块右上角的"接受"或"拒绝"按钮来快速处理。

虽然 Apply 能力让聊天功能（Ctrl+L）具有了`代码修改`的能力，但是如果有`明确`的代码修改需求，其实更推荐使用专门为代码修改设计的功能：

1. 提示栏（Ctrl+K）: 擅长`局部`代码的修改能力

2. Composer: 擅长`全局`跨文件的修改能力

#### ② 基于@的上下文引用

在Cursor的AI输入框中，比如在提示栏（Cmd K）、Chat 或 Composer 中，您都可以通过输入@符号来引用上下文。

值得说明的是在 Chat 和 Composer 中，@ 的上下文引用能力基本是一致的。

而在提示栏（Cmd K）中，因为其功能主要是做局部代码的修改，其 @ 的上下文引用能力受到了一定的限制。

在AI辅助编程中，上下文的使用至关重要，这可以从AI解决问题的角度来理解：

AI自身的局限性：

- 虽然AI知道很多东西，但它也不是无所不知的。有时候，它可能对某些特定的技术领域不太了解。

问题的特殊性：

- 每个项目都有其独特的结构、逻辑和需求。没有上下文，AI 很难理解如何针对你当前项目的场景去解决这个问题。

内部信息的引用使得 Cursor 能够更好地`理解和处理项目内部`的复杂性，从而获取最精准的回答。



### 多文件编码（Ctrl + i）

Cursor 首创的多文件代码编辑体验，使用 Ctrl+ I 打开。

支持如下配置项：

- Always keep composer in bound：始终将编辑器保持在范围内，限制拖拽出屏幕可视区域。

- Composer projects：功能目前处于 ALPHA 预览版本，支持在多个编辑器之间创建和共享上下文。

- Cmd+P for file picker：使用 Cmd+P 打开文件选择器。支持按名称搜索文件(追加：转到航，追加@转到符号)

- Show suggested files：显示建议的文件。

它可以直接帮你重构文件，还帮你新建好文件。

### 合理使用上下文

合理使用上下文信息就像给AI一个"小抄"。这个"小抄"要做到两点：

1. 挑重点：只选择真正相关的信息，不要把无关的东西也塞进去。

2. 适可而止：给的信息要够用，但也不要太多。太少了AI可能理解不了你的问题，太多了反而会让AI不知所措，产生幻觉的可能性会变大。

简单来说，就是要给AI恰到好处的信息，既不少也不多，这样AI才能最好地帮助你解决问题。

Cursor 提供了多种内部信息引用方式，相对来看，其信息的承载范围从小到大依次是：

Code < Files ≈ Git < Folders < Codebase

这种逐步扩大的上下文范围设计，使得开发者可以根据问题的复杂度和影响范围，灵活选择最合适的上下文信息，从而获得更精准、更有价值的AI辅助。

##### ① Code/Files/Folders

直接根据字面的意思就能看出这三个分别代表了什么样的引用信息，根据需要选择合适的上下文范围：

1. Code（代码片段）：允许你引用当前文件中的特定代码片段

2. Files（文件）：让你引用整个文件的内容(包括图像文件)

3. Folders（文件夹）：使你能够引用整个文件夹中的所有文件

值得注意的是，当你使用 Files（文件）或 Folders（文件夹）级别的引用时，如果一个文件内容太多，Chat 不会一下子全部读取，而是会把文件分成小块。

然后，它会根据你的问题，挑选出最相关的部分。这样做可以让 Cursor 更快地回答你的问题，并且给出更准确的回答。

如果想把整个文件或文件夹的内容都给到 AI，可以开启长上下文功能。

但是在提示栏（Cmd+K）中，是不提供大范围的上下文引用能力的，比如 Folders 和 Codebase，Cursor 还是希望提示栏（Cmd+K）专注于局部代码的处理。

##### ② Git

Git 中携带的信息就像是代码的时间线，让你能清楚地看到代码是如何演变到现在这个样子的。

Cursor 提供了以下几种 Git 相关的上下文信息。

有了这些上下文信息，可以非常方便的对代码进行审查、优化、bug 修复：

- PR（Diff of Main Branch）：当前分支与主分支的 diff

- 待提交的修改（Commit:Diff with Working State）：在你的 git 工作区中还没 add 的代码信息。
	- 可以使用这个快速生成 git commit message

- 已提交的Commit：代码库中管理的所有 Commits

除了在聊天框中直接使用 `@Git` 引用信息外，还可以在 AI 面板(Panel)上使用 `Review 功能`。

目前 Review 功能还在 Beta 阶段，需要在 Cursor 设置中打开。

##### ③ Codebase

`@Codebase` 是 Cursor 的一个强大功能，它允许 AI 扫描整个代码库来提供更全面的上下文和建议。

这个功能特别适合处理大型项目或需要跨文件分析的情况。

其实`@Codebase`的原理就是使用的RAG技术，它会把你当前项目的所有文件进行向量化处理，然后储存在本地。

在 Cursor 设置中你可以看到当前项目的代码库索引状态。

Chat 中的 `@Codebase`，提供了两种搜索模式：

embedding 模式和 reranker 模式。

embedding 模式就是直接在本地的向量化库中进行搜索，把搜索最相关的前几个 chunk 信息带入请求的 message 中，然后返回 给用户结果。

reranker 模式则是多了重排序和思考的步骤，更复杂一些。

经过测试 reranker 模式效果在梳理总结项目更为全面的信息时`效果更好`。

##### ⑤ Doc

在 Chat 中使用`@Doc`，可以引入文档来拓宽 AI 的知识面。

比如当前项目使用了某个特定的技术栈，你可以指定某个版本或者最新版本的技术文档，来满足你当前的技术栈要求。

Cursor 提供了一些常用的内置文档，在设置中，你也可以手动引入你需要的外部文档。

你提供文档的 URL，Cursor 会自动帮你抓取所有的关联的文档。

##### ⑥ Web

`@Web` 功能允许 Chat 在回答问题时搜索和引用网络上的信息。

最直接的使用方式就是直接在 Chat(Ctrl+L) 中使用 `@Web`，这样会自动搜索相关的网络信息。

另外可以@网址，引入单个页面信息。

##### ⑦ 上下文模版 - Notepad

Notepad 是 Cursor 提供的一个强大的上下文模板功能。它就像是你的个人笔记本，可以在其中保存各种信息，然后在需要时轻松引用。

使用 Notepad，你可以：

- 自定义上下文：在 Notepad 中输入任何你认为重要的信息，比如项目背景、编码规范或常用代码片段。

- 灵活引用：无论是在 Chat 还是 Composer 中，你都可以方便地引用 Notepad 的内容。

Notepad 的优势在于它提供了一种统一且个性化的方式来管理和使用上下文信息。这不仅能提高你与 AI 交互的效率，还能确保 AI 始终了解你的项目背景和需求，从而提供更准确、更相关的帮助。

在 Notepad 中，你可以输入文字信息，以及引用文件来构建上下文模版。

但是我理想的情况是 Notepad 应该支持更多的引用类型，在 Notepad 中可以组合我们上面介绍的各种引用类型。

```

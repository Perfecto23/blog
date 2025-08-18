---
title: "VS Code/Cursor 配置 + 扩展"
date: 2025-04-10T11:15:18+08:00
updated: 2025-08-07T21:08:07+08:00
---

# VS Code/Cursor 配置 + 扩展

# 配置文件

```json
{
  // 自动导入时使用双引号
  "autoimport.doubleQuotes": true,
  // 启用文件路径导航
  "breadcrumbs.enabled": true,
  // 在终端中运行代码
  "code-runner.runInTerminal": true,
  // 将文件目录作为当前工作目录
  "code-runner.fileDirectoryAsCwd": true,
  // 对兼容的厂商前缀发出警告
  "css.lint.compatibleVendorPrefixes": "warning",
  // 对盒模型问题发出警告
  "css.lint.boxModel": "warning",
  // 对重复属性发出警告
  "css.lint.duplicateProperties": "warning",
  // 对 float 属性发出警告
  "css.lint.float": "warning",
  // 在选择器分隔符周围添加空格
  "css.format.spaceAroundSelectorSeparator": true,
  // 在概览标尺中显示断点
  "debug.showBreakpointsInOverviewRuler": true,
  // 差异编辑器的最大计算时间，0 表示不限制
  "diffEditor.maxComputationTime": 0,
  // 允许在任何地方设置断点
  "debug.allowBreakpointsEverywhere": true,
  // 在差异编辑器中不忽略空白字符
  "diffEditor.ignoreTrimWhitespace": false,
  // 在差异编辑器中启用 CodeLens
  "diffEditor.codeLens": true,
  // 平滑光标闪烁
  "editor.cursorBlinking": "smooth",
  // 平滑光标动画
  "editor.cursorSmoothCaretAnimation": "on",
  // 智能接受建议
  "editor.acceptSuggestionOnEnter": "smart",
  // 启用扩展推荐
  "extensions.ignoreRecommendations": true,
  // 仅自动更新已启用的扩展
  "extensions.autoUpdate": "onlyEnabledExtensions",
  // 禁用自动检测缩进
  "editor.detectIndentation": false,
  // 禁用编辑器中的拖放功能
  "editor.dragAndDrop": false,
  // 字体粗细
  "editor.fontWeight": "normal",
  // 保存时自动删除结尾的分号和逗号
  "editor.codeActionsOnSave": {
    "source.organizeImports": "never",
    "source.fixAll": "always",
    "source.fixAll.eslint": "never"
  },
  // 禁用保存时格式化
  "editor.formatOnSave": false,
  // 启用内联建议
  "editor.inlineSuggest.enabled": true,
  // 当悬停时显示内联建议工具栏
  "editor.inlineSuggest.showToolbar": "onHover",
  // 启用链接编辑
  "editor.linkedEditing": true,
  // 滚动缩放字体
  "editor.mouseWheelZoom": true,
  // 显示控制字符
  "editor.renderControlCharacters": true,
  // 显示所有空白字符
  "editor.renderWhitespace": "all",
  // 编辑器标尺
  "editor.rulers": [
    40,
    80,
    120
  ],
  // 平滑滚动
  "editor.smoothScrolling": true,
  // 启用粘性滚动
  "editor.stickyScroll.enabled": true,
  // 建议选择最近使用的前缀
  "editor.suggestSelection": "recentlyUsedByPrefix",
  // 本地建议优先
  "editor.suggest.localityBonus": true,
  // 允许代码片段建议
  "editor.suggest.snippetsPreventQuickSuggestions": false,
  // Tab 大小
  "editor.tabSize": 2,
  // 启用 Tab 补全
  "editor.tabCompletion": "on",
  // 禁用 Unicode 高亮显示
  "editor.unicodeHighlight.ambiguousCharacters": false,
  // 配置编辑器中单词的分隔符
  "editor.wordSeparators": "`~#!@$%^&*()-=+[{]}\\|;:'\",<>/?.",
  // 自动换行
  "editor.wordWrap": "on",
  // 启用括号配对着色
  "editor.bracketPairColorization.enabled": true,
  // 启用括号配对引导
  "editor.guides.bracketPairs": "active",
  // 字符串中自动补全 HTML 标签
  "emmet.triggerExpansionOnTab": true,
  // 显示缩写建议
  "emmet.showAbbreviationSuggestions": true,
  // 始终显示扩展缩写
  "emmet.showExpandedAbbreviation": "always",
  // 自动识别工作区中的 eslint 配置
  "eslint.workingDirectories": [
    {
      "mode": "auto"
    }
  ],
  // 验证的文件类型
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "vue",
    "typescript",
    "typescriptreact"
  ],
  // 禁用资源管理器中的紧凑文件夹视图
  "explorer.compactFolders": false,
  // 禁用删除确认
  "explorer.confirmDelete": false,
  // 
  "explorer.confirmDragAndDrop": false,
  // 禁用资源管理器中粘贴文件的确认提示
  "explorer.confirmPasteNative": false,
  // 复制相对路径分隔符
  "explorer.copyRelativePathSeparator": "/",
  // 启用文件嵌套
  "explorer.fileNesting.enabled": true,
  // 禁用文件嵌套展开
  "explorer.fileNesting.expand": false,
  // 文件嵌套模式
  "explorer.fileNesting.patterns": {
    "//": "Last update at 2025/4/9 14:34:14",
    ".clang-tidy": ".clang-format, .clangd, compile_commands.json",
    ".env": "*.env, .env.*, .envrc, env.d.ts",
    ".gitignore": ".gitattributes, .gitmodules, .gitmessage, .lfsconfig, .mailmap, .git-blame*",
    ".project": ".classpath",
    "+layout.svelte": "+layout.ts,+layout.ts,+layout.js,+layout.server.ts,+layout.server.js,+layout.gql",
    "+page.svelte": "+page.server.ts,+page.server.js,+page.ts,+page.js,+page.gql",
    "ansible.cfg": "ansible.cfg, .ansible-lint, requirements.yml",
    "app.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "application.properties": "*.properties",
    "artisan": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, server.php, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, webpack.mix.js, windi.config.*",
    "astro.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "build-wrapper.log": "build-wrapper*.log, build-wrapper-dump*.json, build-wrapper-win*.exe, build-wrapper-linux*, build-wrapper-macosx*",
    "BUILD.bazel": "*.bzl, *.bazel, *.bazelrc, bazel.rc, .bazelignore, .bazelproject, .bazelversion, MODULE.bazel.lock, WORKSPACE",
    "Cargo.toml": ".clippy.toml, .rustfmt.toml, Cargo.Bazel.lock, Cargo.lock, clippy.toml, cross.toml, insta.yaml, rust-toolchain.toml, rustfmt.toml",
    "CMakeLists.txt": "*.cmake, *.cmake.in, .cmake-format.yaml, CMakePresets.json, CMakeCache.txt",
    "composer.json": ".php*.cache, composer.lock, phpunit.xml*, psalm*.xml",
    "default.nix": "shell.nix",
    "deno.json*": "*.env, .env.*, .envrc, api-extractor.json, deno.lock, env.d.ts, import-map.json, import_map.json, jsconfig.*, tsconfig.*, tsdoc.*",
    "Dockerfile": "*.dockerfile, .devcontainer.*, .dockerignore, captain-definition, compose.*, docker-compose.*, dockerfile*",
    "flake.nix": "flake.lock",
    "gatsby-config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, gatsby-browser.*, gatsby-node.*, gatsby-ssr.*, gatsby-transformer.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "gemfile": ".ruby-version, gemfile.lock",
    "go.mod": ".air*, go.sum",
    "go.work": "go.work.sum",
    "hatch.toml": ".editorconfig, .flake8, .isort.cfg, .python-version, hatch.toml, requirements*.in, requirements*.pip, requirements*.txt, tox.ini",
    "I*.cs": "$(capture).cs",
    "Makefile": "*.mk",
    "mix.exs": ".credo.exs, .dialyzer_ignore.exs, .formatter.exs, .iex.exs, .tool-versions, mix.lock",
    "next.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, next-env.d.ts, next-i18next.config.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "nuxt.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .nuxtignore, .nuxtrc, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "package.json": "*.code-workspace, .browserslist*, .circleci*, .commitlint*, .cspell*, .cursor*, .cz-config.js, .czrc, .dlint.json, .dprint.json*, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitmojirc.json, .gitpod*, .huskyrc*, .jslint*, .knip.*, .lintstagedrc*, .ls-lint.yml, .markdownlint*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .pylintrc, .release-please*.json, .releaserc*, .ruff.toml, .sentry*, .shellcheckrc, .simple-git-hooks*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .versionrc*, .vscode*, .watchman*, .windsurfrules, .xo-config*, .yamllint*, .yarnrc*, Procfile, apollo.config.*, appveyor*, azure-pipelines*, biome.json*, bower.json, build.config.*, bun.lock, bun.lockb, bunfig.toml, colada.options.ts, commitlint*, crowdin*, cspell*, dangerfile*, dlint.json, dprint.json*, ec.config.*, electron-builder.*, eslint*, firebase.json, grunt*, gulp*, jenkins*, knip.*, lerna*, lint-staged*, nest-cli.*, netlify*, nixpacks*, nodemon*, npm-shrinkwrap.json, nx.*, package-lock.json, package.nls*.json, phpcs.xml, pm2.*, pnpm*, prettier*, pullapprove*, pyrightconfig.json, release-please*.json, release-tasks.sh, release.config.*, renovate*, rolldown.config.*, rollup.config.*, rspack*, ruff.toml, sentry.*.config.ts, simple-git-hooks*, sonar-project.properties, stylelint*, tsdown.config.*, tslint*, tsup.config.*, turbo*, typedoc*, unlighthouse*, vercel*, vetur.config.*, webpack*, workspace.json, wrangler.*, xo.config.*, yarn*",
    "Pipfile": ".editorconfig, .flake8, .isort.cfg, .python-version, Pipfile, Pipfile.lock, requirements*.in, requirements*.pip, requirements*.txt, tox.ini",
    "pom.xml": "mvnw*",
    "pubspec.yaml": ".metadata, .packages, all_lint_rules.yaml, analysis_options.yaml, build.yaml, pubspec.lock, pubspec_overrides.yaml",
    "pyproject.toml": ".commitlint*, .cspell*, .dlint.json, .dprint.json*, .editorconfig, .eslint*, .flake8, .flowconfig, .isort.cfg, .jslint*, .lintstagedrc*, .ls-lint.yml, .markdownlint*, .pdm-python, .pdm.toml, .prettier*, .pylintrc, .python-version, .ruff.toml, .shellcheckrc, .stylelint*, .textlint*, .xo-config*, .yamllint*, MANIFEST.in, Pipfile, Pipfile.lock, biome.json*, commitlint*, cspell*, dangerfile*, dlint.json, dprint.json*, eslint*, hatch.toml, lint-staged*, pdm.lock, phpcs.xml, poetry.lock, poetry.toml, prettier*, pyproject.toml, pyrightconfig.json, requirements*.in, requirements*.pip, requirements*.txt, ruff.toml, setup.cfg, setup.py, stylelint*, tox.ini, tslint*, uv.lock, uv.toml, xo.config.*",
    "quasar.conf.js": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, quasar.extensions.json, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "readme*": "AUTHORS, Authors, BACKERS*, Backers*, CHANGELOG*, CITATION*, CODEOWNERS, CODE_OF_CONDUCT*, CONTRIBUTING*, CONTRIBUTORS, COPYING*, CREDITS, Changelog*, Citation*, Code_Of_Conduct*, Codeowners, Contributing*, Contributors, Copying*, Credits, GOVERNANCE.MD, Governance.md, HISTORY.MD, History.md, LICENSE*, License*, MAINTAINERS, Maintainers, README-*, README_*, RELEASE_NOTES*, ROADMAP.MD, Readme-*, Readme_*, Release_Notes*, Roadmap.md, SECURITY.MD, SPONSORS*, Security.md, Sponsors*, authors, backers*, changelog*, citation*, code_of_conduct*, codeowners, contributing*, contributors, copying*, credits, governance.md, history.md, license*, maintainers, readme-*, readme_*, release_notes*, roadmap.md, security.md, sponsors*",
    "Readme*": "AUTHORS, Authors, BACKERS*, Backers*, CHANGELOG*, CITATION*, CODEOWNERS, CODE_OF_CONDUCT*, CONTRIBUTING*, CONTRIBUTORS, COPYING*, CREDITS, Changelog*, Citation*, Code_Of_Conduct*, Codeowners, Contributing*, Contributors, Copying*, Credits, GOVERNANCE.MD, Governance.md, HISTORY.MD, History.md, LICENSE*, License*, MAINTAINERS, Maintainers, README-*, README_*, RELEASE_NOTES*, ROADMAP.MD, Readme-*, Readme_*, Release_Notes*, Roadmap.md, SECURITY.MD, SPONSORS*, Security.md, Sponsors*, authors, backers*, changelog*, citation*, code_of_conduct*, codeowners, contributing*, contributors, copying*, credits, governance.md, history.md, license*, maintainers, readme-*, readme_*, release_notes*, roadmap.md, security.md, sponsors*",
    "README*": "AUTHORS, Authors, BACKERS*, Backers*, CHANGELOG*, CITATION*, CODEOWNERS, CODE_OF_CONDUCT*, CONTRIBUTING*, CONTRIBUTORS, COPYING*, CREDITS, Changelog*, Citation*, Code_Of_Conduct*, Codeowners, Contributing*, Contributors, Copying*, Credits, GOVERNANCE.MD, Governance.md, HISTORY.MD, History.md, LICENSE*, License*, MAINTAINERS, Maintainers, README-*, README_*, RELEASE_NOTES*, ROADMAP.MD, Readme-*, Readme_*, Release_Notes*, Roadmap.md, SECURITY.MD, SPONSORS*, Security.md, Sponsors*, authors, backers*, changelog*, citation*, code_of_conduct*, codeowners, contributing*, contributors, copying*, credits, governance.md, history.md, license*, maintainers, readme-*, readme_*, release_notes*, roadmap.md, security.md, sponsors*",
    "remix.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, remix.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "requirements.txt": ".editorconfig, .flake8, .isort.cfg, .python-version, requirements*.in, requirements*.pip, requirements*.txt, tox.ini",
    "rush.json": "*.code-workspace, .browserslist*, .circleci*, .commitlint*, .cspell*, .cursor*, .cz-config.js, .czrc, .dlint.json, .dprint.json*, .editorconfig, .eslint*, .firebase*, .flowconfig, .github*, .gitlab*, .gitmojirc.json, .gitpod*, .huskyrc*, .jslint*, .knip.*, .lintstagedrc*, .ls-lint.yml, .markdownlint*, .node-version, .nodemon*, .npm*, .nvmrc, .pm2*, .pnp.*, .pnpm*, .prettier*, .pylintrc, .release-please*.json, .releaserc*, .ruff.toml, .sentry*, .shellcheckrc, .simple-git-hooks*, .stackblitz*, .styleci*, .stylelint*, .tazerc*, .textlint*, .tool-versions, .travis*, .versionrc*, .vscode*, .watchman*, .windsurfrules, .xo-config*, .yamllint*, .yarnrc*, Procfile, apollo.config.*, appveyor*, azure-pipelines*, biome.json*, bower.json, build.config.*, bun.lock, bun.lockb, bunfig.toml, colada.options.ts, commitlint*, crowdin*, cspell*, dangerfile*, dlint.json, dprint.json*, ec.config.*, electron-builder.*, eslint*, firebase.json, grunt*, gulp*, jenkins*, knip.*, lerna*, lint-staged*, nest-cli.*, netlify*, nixpacks*, nodemon*, npm-shrinkwrap.json, nx.*, package-lock.json, package.nls*.json, phpcs.xml, pm2.*, pnpm*, prettier*, pullapprove*, pyrightconfig.json, release-please*.json, release-tasks.sh, release.config.*, renovate*, rolldown.config.*, rollup.config.*, rspack*, ruff.toml, sentry.*.config.ts, simple-git-hooks*, sonar-project.properties, stylelint*, tsdown.config.*, tslint*, tsup.config.*, turbo*, typedoc*, unlighthouse*, vercel*, vetur.config.*, webpack*, workspace.json, wrangler.*, xo.config.*, yarn*",
    "sanity.config.*": "sanity.cli.*, sanity.types.ts, schema.json",
    "setup.cfg": ".editorconfig, .flake8, .isort.cfg, .python-version, MANIFEST.in, requirements*.in, requirements*.pip, requirements*.txt, setup.cfg, tox.ini",
    "setup.py": ".editorconfig, .flake8, .isort.cfg, .python-version, MANIFEST.in, requirements*.in, requirements*.pip, requirements*.txt, setup.cfg, setup.py, tox.ini",
    "shims.d.ts": "*.d.ts",
    "svelte.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, houdini.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, mdsvex.config.js, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vite.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "vite.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "vue.config.*": "*.env, .babelrc*, .codecov, .cssnanorc*, .env.*, .envrc, .htmlnanorc*, .lighthouserc.*, .mocha*, .postcssrc*, .terserrc*, api-extractor.json, ava.config.*, babel.config.*, capacitor.config.*, content.config.*, contentlayer.config.*, cssnano.config.*, cypress.*, env.d.ts, formkit.config.*, formulate.config.*, histoire.config.*, htmlnanorc.*, i18n.config.*, ionic.config.*, jasmine.*, jest.config.*, jsconfig.*, karma*, lighthouserc.*, panda.config.*, playwright.config.*, postcss.config.*, puppeteer.config.*, react-router.config.*, rspack.config.*, sst.config.*, svgo.config.*, tailwind.config.*, tsconfig.*, tsdoc.*, uno.config.*, unocss.config.*, vitest.config.*, vuetify.config.*, webpack.config.*, windi.config.*",
    "*.asax": "$(capture).*.cs, $(capture).*.vb",
    "*.ascx": "$(capture).*.cs, $(capture).*.vb",
    "*.ashx": "$(capture).*.cs, $(capture).*.vb",
    "*.aspx": "$(capture).*.cs, $(capture).*.vb",
    "*.axaml": "$(capture).axaml.cs",
    "*.bloc.dart": "$(capture).event.dart, $(capture).state.dart",
    "*.c": "$(capture).h",
    "*.cc": "$(capture).hpp, $(capture).h, $(capture).hxx, $(capture).hh",
    "*.cjs": "$(capture).cjs.map, $(capture).*.cjs, $(capture)_*.cjs",
    "*.component.ts": "$(capture).component.html, $(capture).component.spec.ts, $(capture).component.css, $(capture).component.scss, $(capture).component.sass, $(capture).component.less",
    "*.cpp": "$(capture).hpp, $(capture).h, $(capture).hxx, $(capture).hh",
    "*.cs": "$(capture).*.cs",
    "*.cshtml": "$(capture).cshtml.cs, $(capture).cshtml.css",
    "*.csproj": "*.config, *proj.user, appsettings.*, bundleconfig.json",
    "*.css": "$(capture).css.map, $(capture).*.css",
    "*.cxx": "$(capture).hpp, $(capture).h, $(capture).hxx, $(capture).hh",
    "*.dart": "$(capture).freezed.dart, $(capture).g.dart",
    "*.db": "*.db-shm, *.db-wal",
    "*.ex": "$(capture).html.eex, $(capture).html.heex, $(capture).html.leex",
    "*.fs": "$(capture).fs.js, $(capture).fs.js.map, $(capture).fs.jsx, $(capture).fs.ts, $(capture).fs.tsx, $(capture).fs.rs, $(capture).fs.php, $(capture).fs.dart",
    "*.go": "$(capture)_test.go",
    "*.java": "$(capture).class",
    "*.js": "$(capture).js.map, $(capture).*.js, $(capture)_*.js, $(capture).d.ts, $(capture).d.ts.map, $(capture).js.flow",
    "*.jsx": "$(capture).js, $(capture).*.jsx, $(capture)_*.js, $(capture)_*.jsx, $(capture).css, $(capture).module.css, $(capture).less, $(capture).module.less, $(capture).module.less.d.ts, $(capture).scss, $(capture).module.scss, $(capture).module.scss.d.ts",
    "*.master": "$(capture).*.cs, $(capture).*.vb",
    "*.md": "$(capture).*",
    "*.mjs": "$(capture).mjs.map, $(capture).*.mjs, $(capture)_*.mjs",
    "*.module.ts": "$(capture).resolver.ts, $(capture).controller.ts, $(capture).service.ts",
    "*.mts": "$(capture).mts.map, $(capture).*.mts, $(capture)_*.mts",
    "*.proto": "$(capture).pb.go, $(capture).pb.micro.go",
    "*.pubxml": "$(capture).pubxml.user",
    "*.py": "$(capture).pyi",
    "*.razor": "$(capture).razor.cs, $(capture).razor.css, $(capture).razor.scss",
    "*.resx": "$(capture).*.resx, $(capture).designer.cs, $(capture).designer.vb",
    "*.tex": "$(capture).acn, $(capture).acr, $(capture).alg, $(capture).aux, $(capture).bbl, $(capture).bbl-SAVE-ERROR, $(capture).bcf, $(capture).blg, $(capture).fdb_latexmk, $(capture).fls, $(capture).glg, $(capture).glo, $(capture).gls, $(capture).idx, $(capture).ind, $(capture).ist, $(capture).lof, $(capture).log, $(capture).lot, $(capture).nav, $(capture).out, $(capture).run.xml, $(capture).snm, $(capture).synctex.gz, $(capture).toc, $(capture).xdv",
    "*.ts": "$(capture).js, $(capture).d.ts.map, $(capture).*.ts, $(capture)_*.js, $(capture)_*.ts",
    "*.tsx": "$(capture).ts, $(capture).*.tsx, $(capture)_*.ts, $(capture)_*.tsx, $(capture).css, $(capture).module.css, $(capture).less, $(capture).module.less, $(capture).module.less.d.ts, $(capture).scss, $(capture).module.scss, $(capture).module.scss.d.ts, $(capture).css.ts",
    "*.vbproj": "*.config, *proj.user, appsettings.*, bundleconfig.json",
    "*.vue": "$(capture).*.ts, $(capture).*.js, $(capture).story.vue",
    "*.w": "$(capture).*.w, I$(capture).w",
    "*.wat": "$(capture).wasm",
    "*.xaml": "$(capture).xaml.cs"
  },
  "explorer.autoRevealExclude": {
    // 禁用自动展开 node_modules 文件夹
    "**/node_modules": false
  },
  // 失去焦点时自动保存
  "files.autoSave": "onFocusChange",
  // 文件关联
  "files.associations": {
    "*.tpl": "html",
    "*.ejs": "html"
  },
  // 文件行尾符号
  "files.eol": "\n",
  "fileheader.customMade": {
    // 自动提取当前 git 配置中的用户名
    "Author": "git config user.name",
    // 文件创建时间（不变）
    "Date": "Do not edit",
    // 文件最后编辑者
    "LastEditors": "git config user.name",
    // 文件最后编辑时间
    "LastEditTime": "Do not edit",
    // 文件在项目中的相对路径
    "FilePath": "Do not edit",
    // 文件的描述
    "Description": ""
  },
  "fileheader.cursorMode": {
    // 函数注释生成后，光标移动到描述字段
    "description": "",
    // 函数参数自动提取
    "param": "",
    // 返回值描述
    "return": ""
  },
  "fileheader.configObj": {
    // 关闭自动添加头部注释
    "autoAdd": false,
    // 开启新文件自动添加注释
    "createHeader": true,
    // 注释时间为创建文件时间
    "createFileTime": true,
    // 函数注释空格缩进
    "functionBlankSpaceAll": {}
  },
  // 允许强制推送
  "git.allowForcePush": true,
  // 允许没有验证的 Git 提交
  "git.allowNoVerifyCommit": true,
  // 始终显示已暂存的更改资源组
  "git.alwaysShowStagedChangesResourceGroup": true,
  // 设置默认的 Git 分支名称为 master
  "git.defaultBranchName": "master",
  // 禁止在父文件夹中打开 Git 仓库
  "git.openRepositoryInParentFolders": "never",
  // 显示推送成功通知
  "git.showPushSuccessNotification": true,
  // 配置 GitLens 的 AI 模型
  "gitlens.ai.experimental.model": "anthropic:claude-3-5-sonnet-20240620",
  // 禁用 GitLens 启动板指示器
  "gitlens.launchpad.indicator.enabled": false,
  // 禁用 GitLens 版本警告
  "gitlens.advanced.messages": {
    "suppressGitVersionWarning": true
  },
  // GitLens 配置
  "gitlens.views.tags.branches.layout": "list",
  "gitlens.views.remotes.pullRequests.enabled": false,
  "gitlens.views.worktrees.showBranchComparison": "branch",
  "gitlens.views.contributors.showAllBranches": true,
  // 关闭 DTS 文件的别名跳转
  "gotoAlias.closeDts": true,
  // HTML 属性换行设置
  "html.format.wrapAttributes": "force",
  // 配置 HTTP 代理
  "http.proxy": "http://npm.uedc.sangfor.com.cn:7890",
  // 设置 i18n-ally 的显示语言为中文
  "i18n-ally.displayLanguage": "zh_CN",
  // 优先使用编辑器进行 i18n-ally 操作
  "i18n-ally.editor.preferEditor": true,
  "i18n-ally.enabledFrameworks": [
    // 启用 i18next 框架
    "custom",
    "i18next"
  ],
  "i18n-ally.enabledParsers": [
    // 启用 YAML 解析器
    "yaml"
  ],
  // 设置提取的键生成样式为 snake_case
  "i18n-ally.extract.keygenStyle": "snake_case",
  // 保持已完成的翻译
  "i18n-ally.keepFulfilled": true,
  // 设置 import-cost 插件的字体样式为斜体
  "importCost.fontStyle": "italic",
  // JavaScript JSX 属性完成样式自动
  "javascript.preferences.jsxAttributeCompletionStyle": "auto",
  // 启用粘贴时更新导入的实验功能
  "javascript.experimental.updateImportsOnPaste": true,
  // 启用参数类型的内联提示
  "javascript.inlayHints.parameterTypes.enabled": true,
  // 启用属性声明类型的内联提示
  "javascript.inlayHints.propertyDeclarationTypes.enabled": true,
  // 启用函数返回类型的内联提示
  "javascript.inlayHints.functionLikeReturnTypes.enabled": true,
  // 启用枚举成员值的内联提示
  "javascript.inlayHints.enumMemberValues.enabled": true,
  // 启用参数名称的内联提示
  "javascript.inlayHints.parameterNames.enabled": "all",
  // 禁用变量类型的内联提示
  "javascript.inlayHints.variableTypes.enabled": false,
  // 在所有函数上显示引用代码镜头
  "javascript.referencesCodeLens.showOnAllFunctions": true,
  // 文件移动时不更新导入
  "javascript.updateImportsOnFileMove.enabled": "never",
  // 禁用 JSON 模式下载
  "json.schemaDownload.enable": false,
  // 启用实验性装饰器
  "js/ts.implicitProjectConfig.experimentalDecorators": true,
  // 对 Less 兼容的厂商前缀发出警告
  "less.lint.compatibleVendorPrefixes": "warning",
  // 对 Less 重复属性发出警告
  "less.lint.duplicateProperties": "warning",
  // 对 Less float 属性发出警告
  "less.lint.float": "warning",
  // 在 Less 选择器分隔符周围添加空格
  "less.format.spaceAroundSelectorSeparator": true,
  // 禁用 Live Server 的信息消息
  "liveServer.settings.donotShowInfoMsg": true,
  // 自动导航到下一个冲突
  "merge-conflict.autoNavigateNextConflict.enabled": true,
  // 使用 pnpm 作为包管理器
  "npm.packageManager": "pnpm",
  // 启用从文件夹运行 npm 脚本
  "npm.enableRunFromFolder": true,
  // 禁用获取在线包信息
  "npm.fetchOnlinePackageInfo": false,
  // Prettier 配置
  "prettier.printWidth": 150,
  "prettier.singleAttributePerLine": true,
  "prettier.requireConfig": true,
  "prettier.singleQuote": true,
  // 启用 Red Hat 扩展的遥测数据收集
  "redhat.telemetry.enabled": true,
  // 复用上一次搜索的配置
  "search.searchEditor.reusePriorSearchConfiguration": true,
  // 搜索结果中显示行号
  "search.showLineNumbers": true,
  // 启用智能大小写搜索
  "search.smartCase": true,
  // 禁用符号链接跟随
  "search.followSymlinks": false,
  // 禁用工作区信任提示
  "security.workspace.trust.enabled": false,
  // 打开不信任的文件
  "security.workspace.trust.untrustedFiles": "open",
  // 同步时忽略的设置
  "settingsSync.ignoredSettings": [],
  // 对 SCSS 兼容的厂商前缀发出警告
  "scss.lint.compatibleVendorPrefixes": "warning",
  // 对 SCSS 重复属性发出警告
  "scss.lint.duplicateProperties": "warning",
  // 对 SCSS float 属性发出警告
  "scss.lint.float": "warning",
  // 在 SCSS 选择器分隔符周围添加空格
  "scss.format.spaceAroundSelectorSeparator": true,
  // 禁用 SVG 预览自动打开
  "svgPreview.autoOpen": false,
  // 终端光标闪烁
  "terminal.integrated.cursorBlinking": true,
  // 选择时自动复制
  "terminal.integrated.copyOnSelection": true,
  // 禁用终端中粘贴多行内容的警告
  "terminal.integrated.enableMultiLinePasteWarning": "never",
  // 设置终端默认配置为 zsh
  "terminal.integrated.defaultProfile.linux": "zsh",
  // 设置终端默认配置为 Git Bash
  "terminal.integrated.defaultProfile.windows": "Git Bash",
  // 在 turbo-console-log 插入的日志语句末尾添加分号
  "turboConsoleLog.addSemicolonInTheEnd": true,
  // TypeScript JSX 属性完成样式自动
  "typescript.preferences.jsxAttributeCompletionStyle": "auto",
  // 文件移动时更新导入
  "typescript.updateImportsOnFileMove.enabled": "always",
  // 禁用自动更新
  "update.mode": "none",
  // 禁用 Vetur 模板验证
  "vetur.validation.template": false,
  // 禁用 Vue 代码操作
  "vue.codeActions.enabled": false,
  // 禁用命令中心
  "window.commandCenter": false,
  // 自定义对话框样式
  "window.dialogStyle": "custom",
  // 设置新窗口的配置文件为默认
  "window.newWindowProfile": "默认",
  "workbench.colorCustomizations": {
    // 括号颜色1
    "editorBracketHighlight.foreground1": "#ffd700",
    // 括号配对引导颜色1
    "editorBracketPairGuide.activeBackground1": "#ffd7007f",
    // 括号颜色2
    "editorBracketHighlight.foreground2": "#da70d6",
    // 括号配对引导颜色2
    "editorBracketPairGuide.activeBackground2": "#da70d67f",
    // 括号颜色3
    "editorBracketHighlight.foreground3": "#87cefa",
    // 括号配对引导颜色3
    "editorBracketPairGuide.activeBackground3": "#87cefa7f",
    // 括号颜色4
    "editorBracketHighlight.foreground4": "#ffd700",
    // 括号配对引导颜色4
    "editorBracketPairGuide.activeBackground4": "#ffd7007f",
    // 括号颜色5
    "editorBracketHighlight.foreground5": "#da70d6",
    // 括号配对引导颜色5
    "editorBracketPairGuide.activeBackground5": "#da70d67f",
    // 括号颜色6
    "editorBracketHighlight.foreground6": "#87cefa",
    // 括号配对引导颜色6
    "editorBracketPairGuide.activeBackground6": "#87cefa7f",
    // 意外括号颜色
    "editorBracketHighlight.unexpectedBracket.foreground": "#ff0000"
  },
  // 设置工作台的颜色主题为 GitHub Dark
  "workbench.colorTheme": "GitHub Dark",
  // 隐藏空编辑器的提示
  "workbench.editor.empty.hint": "hidden",
  // 禁用预览模式
  "workbench.editor.enablePreview": false,
  // 文件图标主题
  "workbench.iconTheme": "material-icon-theme",
  // 设置产品图标主题为 Material Product Icons
  "workbench.productIconTheme": "material-product-icons",
  // 平滑滚动
  "workbench.list.smoothScrolling": true,
  // 启动时不打开任何编辑器
  "workbench.startupEditor": "none",
  // CSS 文件的默认格式化程序
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // HTML 文件的默认格式化程序
  "[html]": {
    "editor.defaultFormatter": "vscode.html-language-features"
  },
  // JavaScript 文件的默认格式化程序
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // JSON 文件的默认格式化程序
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  // JSONC 文件的默认格式化程序
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  // LESS 文件的默认格式化程序
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // Markdown 文件的默认格式化程序
  "[markdown]": {
    "editor.defaultFormatter": "yzhang.markdown-all-in-one"
  },
  // TypeScript 文件的默认格式化程序
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // Vue 文件的默认格式化程序
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // YAML 文件的默认格式化程序
  "[yaml]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // 禁用Git同步确认提示
  "git.confirmSync": false,
  // 始终显示代码折叠控制器
  "editor.showFoldingControls": "always",
  // 启用代码折叠功能
  "editor.folding": true,
  // 禁用不可见Unicode字符高亮显示
  "editor.unicodeHighlight.invisibleCharacters": false,
  // 设置多个定义跳转行为为直接跳转
  "editor.gotoLocation.multipleDefinitions": "goto",
  // GitLens源代码管理视图分组设置
  "gitlens.views.scm.grouped.views": {
    "commits": false,
    "branches": false,
    "remotes": false,
    "stashes": false,
    "tags": false,
    "worktrees": false,
    "contributors": false,
    "repositories": false,
    "searchAndCompare": false,
    "launchpad": false
  },
  // SSH相关设置
  // 服务器下载设置为始终下载
  "remote.SSH.localServerDownload": "always",
  // 远程平台设置
  "remote.SSH.remotePlatform": {
    "200.200.1.80": "linux",
    "10.65.162.241": "linux",
    "10.74.145.102": "linux"
  },
  // 禁用影子工作区
  "cursor.general.enableShadowWorkspace": false,
  // 启用C++部分接受
  "cursor.cpp.enablePartialAccepts": true,
  // C++禁用语言列表
  "cursor.cpp.disabledLanguages": [],
  // 在终端中使用预览框
  "cursor.terminal.usePreviewBox": true,
  // 启用AI预览
  "cursor.aipreview.enabled": true,
  // 使用字符级差异比较
  "cursor.diffs.useCharacterLevelDiffs": true,
  // 使用主题化的差异背景
  "cursor.cmdk.useThemedDiffBackground": true,
  // 启用自动选择
  "cursor.cmdk.autoSelect": true,
  // 显示终端悬停提示
  "cursor.chat.terminalShowHoverHint": true,
  // 折叠面板输入框药丸
  "cursor.composer.collapsePaneInputBoxPills": true,
  // 启用命令面板文件选择器2
  "cursor.composer.cmdPFilePicker2": true,
  // 使用块而不是药丸渲染
  "cursor.composer.renderPillsInsteadOfBlocks": false,
  // 自动滚动到底部
  "cursor.composer.shouldAutoScrollToBottom": true,
  // 显示建议文件
  "cursor.composer.showSuggestedFiles": true,
  // 通知设置不跟随聊天设置
  "cursor.preferNotificationsSameAsChat": false,
  // 禁用GitHub登录尝试
  "cursor-retrieval.canAttemptGithubLogin": false,
  // 忽略Git旧版警告
  "git.ignoreLegacyWarning": true,
  // 设置活动栏方向为垂直
  "workbench.activityBar.orientation": "horizontal",
  "cursor.general.gitGraphIndexing": "enabled",
  "gitlens.views.scm.grouped.default": "stashes",
  "gitlens.views.stashes.files.layout": "list",
  "cursor.general.disableHttp2": true,
  "cursor.general.enableHttp2ProxyWorkaround": true,
  "http.proxyStrictSSL": false,
  "cursorStats.enableAlerts": false,
  "update.releaseTrack": "prerelease",
  "cursorStats.refreshInterval": 360,
  "cursorStats.showTotalRequests": true,
  "cursor.composer.shouldAllowCustomModes": true,
  "cursor.composer.shouldChimeAfterChatFinishes": true,
}
```

# 扩展清单

```sql
amodio.tsl-problem-matcher@0.6.2
antfu.file-nesting@1.1.2
antfu.goto-alias@0.2.1
bierner.color-info@0.7.2
bradlc.vscode-tailwindcss@0.14.13
chakrounanas.turbo-console-log@2.14.0
christian-kohler.npm-intellisense@1.4.5
christian-kohler.path-intellisense@2.10.0
cursor-usage.cursor-usage@0.2.3
davidanson.vscode-markdownlint@0.59.0
dbaeumer.vscode-eslint@3.0.10
drknoxy.eslint-disable-snippets@1.4.1
dustypomerleau.rust-syntax@0.6.1
eamodio.gitlens@17.0.1
editorconfig.editorconfig@0.17.2
esbenp.prettier-vscode@11.0.0
formulahendry.auto-close-tag@0.5.15
formulahendry.auto-complete-tag@0.1.0
formulahendry.auto-rename-tag@0.1.10
formulahendry.code-runner@0.12.2
github.github-vscode-theme@6.3.5
gruntfuggly.todo-tree@0.0.226
heybourn.headwind@1.7.0
huasheng.cursor-rules-huasheng@0.0.8
jbockle.jbockle-format-files@3.4.0
kisstkondoros.vscode-gutter-preview@0.32.2
liamhammett.inline-parameters@0.2.1
lokalise.i18n-ally@2.13.1
maggie.eslint-rules-zh-plugin@0.2.2
meganrogge.template-string-converter@0.6.1
mikestead.dotenv@1.0.1
mio.frieren@0.37.1
ms-ceintl.vscode-language-pack-zh-hans@1.96.2024121109
ms-python.debugpy@2024.6.0
ms-python.python@2024.12.3
ms-python.vscode-pylance@2024.8.1
ms-vscode-remote.remote-ssh@0.113.1
ms-vscode-remote.remote-ssh-edit@0.87.0
ms-vscode-remote.remote-wsl@0.81.8
ms-vscode.remote-explorer@0.4.3
mutantdino.resourcemonitor@1.0.7
nicholashsiang.vscode-vue2-snippets@2.5.0
obkoro1.korofileheader@4.9.3
oderwat.indent-rainbow@8.3.1
panicbit.cargo@0.3.0
pkief.material-icon-theme@5.21.2
pkief.material-product-icons@1.7.1
redhat.vscode-yaml@1.17.0
ritwickdey.liveserver@5.7.9
rust-lang.rust-analyzer@0.3.2370
shinotatwu-ds.file-tree-generator@1.1.1
simonsiefke.svg-preview@2.8.3
steoates.autoimport@1.5.4
undefined_publisher.i18n-helper@0.0.2
usernamehw.errorlens@3.25.0
vue.volar@2.2.8
wix.vscode-import-cost@3.3.0
wmaurer.change-case@1.0.0
xabikos.javascriptsnippets@1.8.0
yoavbls.pretty-ts-errors@0.6.1
yzhang.markdown-all-in-one@3.6.3
```

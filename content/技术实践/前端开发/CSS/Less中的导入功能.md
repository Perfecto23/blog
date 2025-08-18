---
title: Less中的导入功能
date: 2025-08-08T00:34:20+08:00
updated: 2025-08-08T00:35:48+08:00
---

# Less 中的导入功能

### 前置知识

#### 导入指令

`@import` 指令用于在代码中导入其他的 LESS 文件。 它可以让不同模块的 LESS 代码分布在不同的文件上，并允许轻松地维护代码的结构。 您可以将 @import 语句放在代码中的任何位置。

```scss
@import "../../common/edit-table/index.less";
```

#### 导入选项

LESS 提供 @import ，允许样式表同时导入 LESS 和 CSS 样式表。

下面列出了可以在 @import 语句中使用的导入配置

1. reference：它使用一个 less 文件作为参考，不会编译它
2. inline：它使您能够将 css 复制到输出而不进行编译
3. less：它会将导入的文件视为常规 less，尽管可能是别的文件扩展名
4. css：它会将导入的文件视为常规 css，尽管可能是别的文件扩展名，如.php
5. once：它将只导入一次文件
6. multiple：它会多次导入文件
7. optional：即使找不到要导入的文件，仍会继续编译

**允许在 @import 语句中使用多个关键字，但必须使用逗号分隔关键字。**

```scss
@import (less, optional) "custom.css";
```

### 实际场景

在 `~/src/framework/css/common.less` 中有一个包含着超出省略样式的 class

```scss
.common-ellipsis{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
```

在使用 ss-index-bar 和 ss-index-anchor 组件的时候，定位器宽度只有 120px，而有一些英文词条超出了 120px，需要对 `.nav__item` 做超出省略的样式处理。

```html
<div class="index-bar">
    <div class="index-bar_slot"></div>
    <div class="index-bar__nav">
      <div class="nav">
          <div class="nav__item">第一层sdfs</div>
            <div class="nav__item active">第二层wsasdasdasdaasdasd</div>
        </div>
    </div>
</div>
```

可是 `nav__item` 是组件内部的元素，无法在 template 中直接给其添加 `common-ellipsis` 的类名来达到超出省略的效果。

所以我们可以考虑先从 `~/src/framework/css/common.less` 中导入 `.common-ellipsis`，然后使用 **less 函数**的语法来向 `.nav__item` 添加超出省略的样式，代码如下：

```scss
@import '~/src/framework/css/common.less';
.event-drawer__scroll-container {
    /deep/ .nav__item {
        width: 120px;
        height: 28px;
        padding: 0 18px;
        line-height: 28px;
        .common-ellipsis()
    }
}
```

但是，这样做我们可以从 chrome 的开发者工具中查看到，我们在当前的 `event-drawer.vue` 文件中完全导入了这个 `common.less`，而 `common.less` 又是一个合集，当中导入了更多其他的 less 文件，如

```scss
@import './reset.less';
@import './grid.less';
@import './modal.less';
@import './form.less';
@import './tooltip.less';
@import './color.less';
@import './font.less';
@import './button.less';
@import './media.less';
@import './scroll.less';
@import './bootstrap-reset/index.less';
@import './eleme-reset/index.less';
@import './transition.less';
@import "./iconfont.less";
@import "./timeline.less";
@import "./collapse.less";
@import "./drawer.less";
@import "./qtip.less";
@import "./alert.less";
@import "./tag.less";
@import "./button_group.less";

* {
  box-sizing: border-box;
}
```

编译后的 css 文件如下图所示

#### 优化方案

所以我们如果单纯的使用 @import 来导入这个类是非常不值得的一种做法，会导致 common.less 被完整的编译后导入到了 evenr-drawer.css 中，不仅会增大这个 css 文件的体积，还会导致可能出现非主观的样式覆盖等问题。

这时候可以使用配置项来优化这个问题，即前置知识中提到的

```scss
@import (reference) '~/src/framework/css/common.less';
.event-drawer__scroll-container {
    /deep/ .nav__item {
        width: 120px;
        height: 28px;
        padding: 0 18px;
        line-height: 28px;
        .common-ellipsis()
    }
}
```

加了 reference 配置项的 @import 语句会将被 import 的文件作为一个依赖，在当前文件找不到 `.common-ellipsis` 这个类时，会去被 import 的文件中寻找，找到以后将对应类的样式编译进去。

#### 编译后的效果

```scss
.event-drawer__scroll-container[data-v-44b84427] .nav__item {
    width: 120px;
    height: 28px;
    padding: 0 18px;
    line-height: 28px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```

以上均为个人理解，如有不对敬请指正哈。

### 总结

当在业务中遇到了需要在很多地方 CV 的样式，我们可以提取一个见名知意的公共类存放在一个 less 文件中，如防止单词截断、超出省略号、具体业务场景下的一些样式规范等等。通过 import 来导入该样式，如果是直接在 template 中使用的话我们直接添加类名即可。如果需要通过/deep/进行样式穿透的话，通过 import reference 和 less 函数也能很好的达到效果。

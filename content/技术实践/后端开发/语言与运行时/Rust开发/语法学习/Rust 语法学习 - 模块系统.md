---
title: "Rust 语法学习 - 模块系统"
date: 2025-03-29T01:08:59+08:00
updated: 2025-08-18T11:36:08+08:00
---

# Rust 语法学习 - 模块系统

Rust 的模块系统包含几个相关概念，共同管理代码的组织、作用域和私有性：

- **包 (Packages)**: Cargo 的功能，允许构建、测试和共享 crate
- **Crates**: 一个树形模块结构，形成库或可执行程序
- **模块 (Modules)与 use**: 控制路径的组织、作用域和私有性
- **路径 (Paths)**: 为函数、结构体等项命名的方式

## 5.1 包和 Crate

### Crate

Crate 是 Rust 编译的最小代码单位，有两种形式：

- **二进制 crate**: 编译成可执行程序，必须有 `main` 函数
- **库 crate**: 不编译为可执行程序，提供给其他 crate 使用的功能

crate 根是源代码文件，Rust 编译器从这里开始构建 crate 的根模块。

### 包

包(package)是提供一系列功能的一个或多个 crate 的集合。包由 `Cargo.toml` 文件定义，描述如何构建这些 crate。

包的规则：

- 包最多包含一个库 crate
- 可以包含任意数量的二进制 crate
- 至少包含一个 crate（库或二进制）

```rust
my_package/
├── Cargo.toml
├── src/
│   ├── main.rs       // 二进制crate根，名称与包名相同
│   ├── lib.rs        // 库crate根，名称与包名相同
│   └── bin/          // 额外的二进制crate
│       ├── bin1.rs   // 二进制crate: my_package_bin1
│       └── bin2.rs   // 二进制crate: my_package_bin2
```

## 5.2 定义模块控制作用域和私有性

### 模块基础

模块是在 crate 内组织代码的方式，提供可读性和重用性，并控制项（函数、类型、常量等）的私有性。

默认情况下，模块中的项对父模块私有，但父模块中的项不能使用子模块中的私有项。

```rust
// src/lib.rs
mod front_of_house {
    mod hosting {
        fn add_to_waitlist() {}
        fn seat_at_table() {}
    }

    mod serving {
        fn take_order() {}
        fn serve_order() {}
        fn take_payment() {}
    }
}
```

模块树结构：

```rust
crate
 └── front_of_house
     ├── hosting
     │   ├── add_to_waitlist
     │   └── seat_at_table
     └── serving
         ├── take_order
         ├── serve_order
         └── take_payment
```

### 公开性与访问控制

使用 `pub` 关键字使项公开：

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

pub fn eat_at_restaurant() {
    // 绝对路径
    crate::front_of_house::hosting::add_to_waitlist();

    // 相对路径
    front_of_house::hosting::add_to_waitlist();
}
```

### super 关键字

`super` 关键字用于在相对路径中引用父模块的项：

```rust
fn serve_order() {}

mod back_of_house {
    fn fix_incorrect_order() {
        cook_order();
        super::serve_order(); // 调用父模块的函数
    }

    fn cook_order() {}
}
```

### 结构体和枚举的公开性

- 结构体公开后，其字段仍然默认私有
- 枚举公开后，其所有变体自动公开

```rust
mod back_of_house {
    pub struct Breakfast {
        pub toast: String,      // 公开字段
        seasonal_fruit: String, // 私有字段
    }

    impl Breakfast {
        pub fn summer(toast: &str) -> Breakfast {
            Breakfast {
                toast: String::from(toast),
                seasonal_fruit: String::from("peaches"),
            }
        }
    }

    pub enum Appetizer {
        Soup,     // 公开变体
        Salad,    // 公开变体
    }
}

pub fn eat_at_restaurant() {
    let mut meal = back_of_house::Breakfast::summer("Rye");
    meal.toast = String::from("Wheat");
    // meal.seasonal_fruit = String::from("blueberries"); // 错误! 私有字段

    let order1 = back_of_house::Appetizer::Soup;
    let order2 = back_of_house::Appetizer::Salad;
}
```

## 5.3 use 关键字

`use` 关键字将路径引入作用域，减少长路径重复：

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

use crate::front_of_house::hosting;
// 也可以使用相对路径: use front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

### 使用 use 的惯用语法

- **函数**: 一般引入到函数的父模块
- **结构体/枚举/其他**: 一般引入完整路径

```rust
// 函数推荐写法
use crate::front_of_house::hosting;
hosting::add_to_waitlist();

// 结构体/枚举推荐写法
use std::collections::HashMap;
let mut map = HashMap::new();
```

### 重命名引入的类型

使用 `as` 重命名引入项，解决名称冲突：

```rust
use std::fmt::Result;
use std::io::Result as IoResult;

fn function1() -> Result {
    // ...
}

fn function2() -> IoResult<()> {
    // ...
}
```

### 重新导出名称

结合 `pub` 和 `use` 重新导出项，外部代码可以用新路径访问：

```rust
mod front_of_house {
    pub mod hosting {
        pub fn add_to_waitlist() {}
    }
}

// 重新导出
pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

外部代码可以使用 `our_crate::hosting::add_to_waitlist()`。

### 使用外部包

在 `Cargo.toml` 中添加依赖：

```
[dependencies]
rand = "0.8.5"
```

然后使用 `use` 导入：

```rust
use rand::Rng;

fn main() {
    let secret_number = rand::thread_rng().gen_range(1..=100);
}
```

### 嵌套路径

简化多个来自同一路径的项的导入：

```rust
// 原始写法
use std::cmp::Ordering;
use std::io;

// 嵌套路径写法
use std::{cmp::Ordering, io};

// 自身与子路径
use std::io::{self, Write};
```

### 通配符

导入路径下的所有公有项：

```rust
use std::collections::*;
```

## 5.4 将模块拆分为不同文件

随着模块变大，可以将其移动到单独的文件：

```
// src/lib.rs
mod front_of_house;  // 声明模块，内容在front_of_house.rs

pub use crate::front_of_house::hosting;

pub fn eat_at_restaurant() {
    hosting::add_to_waitlist();
}
```

```rust
// src/front_of_house.rs
pub mod hosting;  // 声明模块，内容在hosting.rs
```

```rust
// src/front_of_house/hosting.rs
pub fn add_to_waitlist() {}
```

另一种方式是使用目录：

```rust
src/
├── lib.rs
├── front_of_house.rs
└── front_of_house/
    └── hosting.rs
```

## 5.5 工作区 (Workspaces)

工作区是由多个相关的包组成的集合，共享同一个 `Cargo.lock` 文件和输出目录。

```
# Cargo.toml
[workspace]
members = [
    "adder",
    "add_one",
]
```

```rust
my_workspace/
├── Cargo.toml
├── Cargo.lock
├── adder/
│   ├── Cargo.toml
│   └── src/
│       └── main.rs
├── add_one/
│   ├── Cargo.toml
│   └── src/
│       └── lib.rs
└── target/
```

### 工作区中的依赖关系

在工作区内的包可以相互依赖：

```
# adder/Cargo.toml
[dependencies]
add_one = { path = "../add_one" }
```

```rust
// adder/src/main.rs
use add_one;

fn main() {
    let num = 10;
    println!("{} + 1 = {}", num, add_one::add_one(num));
}
```

### 测试工作区

在工作区根目录运行测试会测试所有包：

```rust
cargo test -p add_one  # 测试特定包
cargo test             # 测试所有包
```

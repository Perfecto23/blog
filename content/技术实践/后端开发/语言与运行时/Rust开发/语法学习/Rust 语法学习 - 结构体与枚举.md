---
title: "Rust 语法学习 - 结构体与枚举"
date: 2025-03-29T01:09:04+08:00
updated: 2025-08-18T11:36:12+08:00
---

# Rust 语法学习 - 结构体与枚举

## 3.1 结构体基础

结构体(struct)是一种自定义数据类型，允许你命名并组合多个相关的值。

### 定义与实例化

```rust
// 定义结构体
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

// 创建实例
let user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

// 更改字段值 (需要整个实例可变)
let mut user1 = User {
    email: String::from("someone@example.com"),
    username: String::from("someusername123"),
    active: true,
    sign_in_count: 1,
};

user1.email = String::from("anotheremail@example.com");
```

### 字段初始化简写

当变量名与字段名相同时，可以使用字段初始化简写语法：

```rust
fn build_user(email: String, username: String) -> User {
    User {
        email,    // 等同于 email: email
        username, // 等同于 username: username
        active: true,
        sign_in_count: 1,
    }
}
```

### 结构体更新语法

可以从其他实例创建实例，并更新部分字段：

```rust
let user2 = User {
    email: String::from("another@example.com"),
    username: String::from("anotherusername567"),
    ..user1  // 其余字段从 user1 获取
};
```

注意：这使用了移动语义，如果 `user1` 中有不实现 `Copy` trait 的字段被使用，`user1` 将部分失效。

### 元组结构体

元组结构体有名称但字段没有名称：

```rust
struct Color(i32, i32, i32);
struct Point(i32, i32, i32);

let black = Color(0, 0, 0);
let origin = Point(0, 0, 0);
```

尽管 `Color` 和 `Point` 有相同的字段类型，它们是不同的类型。

### 类单元结构体

没有任何字段的结构体，用于实现 trait 但不需要存储数据：

```rust
struct AlwaysEqual;

let subject = AlwaysEqual;
```

## 3.2 结构体示例程序

```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!(
        "长方形的面积为: {} 平方像素。",
        area(&rect1)
    );
}

fn area(rectangle: &Rectangle) -> u32 {
    rectangle.width * rectangle.height
}
```

### 使用派生 trait 调试

要使用 `println!` 打印自定义类型，需要实现 `Debug` trait：

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("rect1 是 {:?}", rect1);
    println!("rect1 是 {:#?}", rect1); // 美化打印
    // 使用 dbg! 宏
    dbg!(&rect1);
}
```

## 3.3 方法语法

方法与函数类似，但定义在结构体上下文中，并且首个参数始终是 `self`。

### 定义方法

```rust
#[derive(Debug)]
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
    fn width(&self) -> bool {
        self.width > 0
    }
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
    // 可以修改self (需要可变引用)
    fn grow(&mut self, size: u32) {
        self.width += size;
        self.height += size;
    }
    // 消耗self (获取所有权)
    fn destroy(self) -> u32 {
        self.width * self.height
    }
}
```

调用方法：

```rust
fn main() {
    let mut rect1 = Rectangle {
        width: 30,
        height: 50,
    };

    println!("面积: {}", rect1.area());
    if rect1.width() {
        println!("矩形有非零宽度: {}", rect1.width);
    }
    rect1.grow(5);
    println!("增大后的rect: {:?}", rect1);
    // destroy消耗了rect1，此后不能再使用
    let area = rect1.destroy();
    // println!("{:?}", rect1); // 编译错误，rect1已经被消耗
}
```

### 关联函数

在 `impl` 块中定义的不接收 `self` 参数的函数称为"关联函数"，类似于其他语言中的静态方法：

```rust
impl Rectangle {
    // 关联函数
    fn square(size: u32) -> Rectangle {
        Rectangle {
            width: size,
            height: size,
        }
    }
}

// 调用关联函数
let sq = Rectangle::square(3);
```

### 多个 impl 块

可以有多个 `impl` 块：

```rust
impl Rectangle {
    fn area(&self) -> u32 {
        self.width * self.height
    }
}

impl Rectangle {
    fn can_hold(&self, other: &Rectangle) -> bool {
        self.width > other.width && self.height > other.height
    }
}
```

1. 枚举与模式匹配

枚举(enum)允许你定义一个类型，该类型的值只能是几个变体之一。

## 4.1 枚举定义

```rust
enum IpAddrKind {
    V4,
    V6,
}

// 使用枚举变体
let four = IpAddrKind::V4;
let six = IpAddrKind::V6;

// 将枚举作为函数参数
fn route(ip_kind: IpAddrKind) { }
route(IpAddrKind::V4);
```

枚举变体可以包含数据：

```rust
enum IpAddr {
    V4(u8, u8, u8, u8),
    V6(String),
}

let home = IpAddr::V4(127, 0, 0, 1);
let loopback = IpAddr::V6(String::from("::1"));
```

每个变体可以有不同的类型和数量的关联数据：

```rust
enum Message {
    Quit,                       // 没有关联数据
    Move { x: i32, y: i32 },    // 匿名结构体
    Write(String),              // 包含一个字符串
    ChangeColor(i32, i32, i32), // 包含三个i32值
}
```

枚举和结构体一样，可以在 `impl` 块中定义方法：

```rust
impl Message {
    fn call(&self) {
        // 方法体
    }
}

let m = Message::Write(String::from("hello"));
m.call();
```

## 4.2 Option 枚举

`Option` 是标准库定义的枚举，表示一个值可能存在或不存在：

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option<T>` 被自动引入作用域，不需要显式导入。可以直接使用它的变体：

```rust
let some_number = Some(5);
let some_string = Some("a string");

let absent_number: Option<i32> = None; // 显式标注类型
```

Rust 强制你处理 `Option<T>` 可能为 `None` 的情况，防止空值错误：

```rust
let x: i8 = 5;
let y: Option<i8> = Some(5);

// 以下代码无法编译 - 不能直接将Option<i8>与i8相加
// let sum = x + y;

// 需要显式处理None的情况
let sum = x + y.unwrap_or(0);
```

## 4.3 match 控制流

`match` 表达式允许将一个值与一系列模式进行比较，然后执行匹配的模式对应的代码：

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => {
            println!("Lucky penny!");
            1
        },
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}
```

### 绑定值的模式

匹配模式可以绑定匹配值的部分：

```rust
#[derive(Debug)]
enum UsState {
    Alabama,
    Alaska,
    // ...
}

enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(UsState), // Quarter包含一个州
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("来自{:?}州的25美分!", state);
            25
        },
    }
}
```

### 匹配 Option<T>

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        None => None,
        Some(i) => Some(i + 1),
    }
}

let five = Some(5);
let six = plus_one(five);
let none = plus_one(None);
```

### 匹配必须穷尽所有可能性

```rust
fn plus_one(x: Option<i32>) -> Option<i32> {
    match x {
        Some(i) => Some(i + 1),
        // 错误! 没有处理None的情况
    }
}
```

### 通配模式和_占位符

```
let some_u8_value = 0u8;
match some_u8_value {
    1 => println!("one"),
    3 => println!("three"),
    5 => println!("five"),
    7 => println!("seven"),
    _ => (), // 匹配所有其他值，不执行任何代码
}
```

## 4.4 if let 简洁控制流

`if let` 简化了只关心一种匹配情况的场景：

```rust
let some_u8_value = Some(0u8);

// 使用match
match some_u8_value {
    Some(3) => println!("three"),
    _ => (),
}

// 使用if let (更简洁)
if let Some(3) = some_u8_value {
    println!("three");
}

// if let可以包含else
if let Some(3) = some_u8_value {
    println!("three");
} else {
    println!("not three");
}
```

## 4.5 枚举的高级用法

### 使用 impl 为枚举定义方法

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

impl Message {
    fn call(&self) {
        match self {
            Message::Quit => println!("退出"),
            Message::Move { x, y } => println!("移动到 x:{}, y:{}", x, y),
            Message::Write(text) => println!("文本消息: {}", text),
            Message::ChangeColor(r, g, b) => {
                println!("改变颜色为 R:{}, G:{}, B:{}", r, g, b)
            },
        }
    }
}
```

### 在枚举中嵌套枚举

```rust
enum Color {
    Rgb(i32, i32, i32),
    Hsv(i32, i32, i32),
}

enum Shape {
    Circle(f64),
    Rectangle(f64, f64),
}

enum Figure {
    Regular(Shape),
    Colored(Shape, Color),
}

let figure = Figure::Colored(
    Shape::Rectangle(3.0, 4.0),
    Color::Rgb(0, 0, 255)
```

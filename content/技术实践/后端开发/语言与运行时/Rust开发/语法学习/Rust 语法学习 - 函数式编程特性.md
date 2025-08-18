---
title: "Rust 语法学习 - 函数式编程特性"
date: 2025-03-29T12:43:38+08:00
updated: 2025-08-18T11:36:54+08:00
---

# Rust 语法学习 - 函数式编程特性

Rust 结合了多种编程范式，包括函数式编程。这里介绍 Rust 中的函数式编程特性：闭包和迭代器。

## 9.1 闭包

闭包是可以捕获环境的匿名函数。

### 闭包语法

```
// 基本语法
let add_one = |x| x + 1;

// 带类型注解的闭包
let add_one = |x: i32| -> i32 { x + 1 };

// 多行闭包
let calculate = |x| {
    let mut result = x;
    result += 10;
    result * 2
};
```

### 捕获环境

闭包可以使用包含它们的环境中的变量：

```rust
let x = 4;

// 闭包捕获x
let equal_to_x = |z| z == x;

assert!(equal_to_x(4));
```

### 捕获方式

闭包可以通过三种方式捕获值，对应三种 Fn trait：

```
// FnOnce: 获取所有权，只能调用一次
let consume = || drop(x);

// FnMut: 可变借用
let mut counter = 0;
let mut increment = || {
    counter += 1;
    println!("Counter: {}", counter);
};

// Fn: 不可变借用
let print_greeting = || println!("Hello, {}", x);
```

闭包根据其主体中对捕获变量的使用方式，自动实现适当的 trait：

- `Fn`: 不可变借用
- `FnMut`: 可变借用
- `FnOnce`: 获取所有权

### move 关键字

使用 `move` 关键字强制闭包获取其环境中变量的所有权：

```
let x = vec![1, 2, 3];

// 强制获取所有权，常用于线程
let consume = move || {
    println!("消费: {:?}", x);
    // x的所有权已经被移动到闭包中
};

// println!("{:?}", x); // 错误: x已经被移动
```

### 闭包和函数

闭包类似于函数，但有更灵活的语法和捕获环境的能力：

```
// 函数 - 不能捕获环境
fn add_one_fn(x: i32) -> i32 {
    x + 1
}

// 闭包 - 可以捕获环境
let y = 1;
let add_y = |x| x + y;
```

### 返回闭包

由于闭包类型是匿名的，所以在函数返回闭包时需要使用 `impl Trait` 语法：

```
fn create_counter() -> impl Fn() -> i32 {
    let mut count = 0;
    move || {
        count += 1;
        count
    }
}
```

### 性能考虑

Rust 的闭包实现几乎没有运行时开销，同时保持类型安全和内存安全。

## 9.2 迭代器

迭代器允许你对一系列元素执行相同操作，是惰性的（不会在创建时计算）。

### 基本用法

```
let v = vec![1, 2, 3];

// 创建迭代器
let iter = v.iter();

// 使用for循环
for val in iter {
    println!("值: {}", val);
}
```

### Iterator trait

所有迭代器都实现了 `Iterator` trait：

```
pub trait Iterator {
    type Item;
    fn next(&mut self) -> Option<Self::Item>;
    // 其他默认方法...
}
```

手动使用 next 方法：

```rust
let mut iter = v.iter();

assert_eq!(iter.next(), Some(&1));
assert_eq!(iter.next(), Some(&2));
assert_eq!(iter.next(), Some(&3));
assert_eq!(iter.next(), None);
```

### 迭代器方法

#### 创建迭代器

```
let v = vec![1, 2, 3];

let iter1 = v.iter();      // 生成不可变引用的迭代器
let iter2 = v.iter_mut();  // 生成可变引用的迭代器
let iter3 = v.into_iter(); // 获取所有权的迭代器

// 范围迭代器
let range = 1..5;       // 产生1, 2, 3, 4
let inclusive = 1..=5;  // 产生1, 2, 3, 4, 5
```

#### 消费适配器

调用 `next` 方法的方法，它们消耗迭代器：

```
let v = vec![1, 2, 3];

// sum: 对元素求和
let total: i32 = v.iter().sum();

// count: 计数
let count = v.iter().count();

// any: 检查是否有任何元素满足条件
let has_even = v.iter().any(|&x| x % 2 == 0);

// all: 检查是否所有元素都满足条件
let all_positive = v.iter().all(|&x| x > 0);

// fold: 折叠
let sum = v.iter().fold(0, |acc, &x| acc + x);

// max/min: 找最大/最小值
let max = v.iter().max();
let min = v.iter().min();

// nth: 获取第n个元素
let third = v.iter().nth(2);

// find: 查找第一个满足条件的元素
let even = v.iter().find(|&&x| x % 2 == 0);

// position: 查找满足条件的第一个元素的位置
let pos = v.iter().position(|&x| x == 2);

// collect: 收集到容器中
let v2: Vec<i32> = v.iter().map(|&x| x + 1).collect();
```

#### 迭代器适配器

产生其他迭代器的方法，允许构建复杂的迭代器链：

```
let v = vec![1, 2, 3];

// map: 转换每个元素
let plus_one: Vec<i32> = v.iter().map(|&x| x + 1).collect();

// filter: 过滤元素
let even: Vec<&i32> = v.iter().filter(|&&x| x % 2 == 0).collect();

// zip: 将两个迭代器组合成一个迭代器
let names = vec!["Alice", "Bob", "Charlie"];
let ages = vec![30, 25, 35];
let persons: Vec<(&str, i32)> = names.iter()
    .zip(ages.iter())
    .map(|(name, age)| (*name, *age))
    .collect();

// enumerate: 添加索引
for (i, val) in v.iter().enumerate() {
    println!("第{}个元素是{}", i, val);
}

// chain: 连接两个迭代器
let v1 = vec![1, 2];
let v2 = vec![3, 4];
let chained: Vec<i32> = v1.iter().chain(v2.iter()).map(|&x| x).collect();

// take: 取前n个元素
let first_two: Vec<&i32> = v.iter().take(2).collect();

// skip: 跳过前n个元素
let last: Vec<&i32> = v.iter().skip(2).collect();

// rev: 反转迭代器
let reversed: Vec<&i32> = v.iter().rev().collect();

// flat_map: 映射并扁平化
let words = vec!["hello", "world"];
let chars: Vec<char> = words.iter()
    .flat_map(|word| word.chars())
    .collect();

// cloned: 克隆引用的值
let cloned: Vec<i32> = v.iter().cloned().collect();
```

### 实现 Iterator trait

自定义类型可以实现 `Iterator` trait：

```
struct Counter {
    count: u32,
    max: u32,
}

impl Counter {
    fn new(max: u32) -> Counter {
        Counter { count: 0, max }
    }
}

impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        if self.count < self.max {
            self.count += 1;
            Some(self.count)
        } else {
            None
        }
    }
}

// 使用
let mut counter = Counter::new(3);

assert_eq!(counter.next(), Some(1));
assert_eq!(counter.next(), Some(2));
assert_eq!(counter.next(), Some(3));
assert_eq!(counter.next(), None);

// 使用其他迭代器方法
let sum: u32 = Counter::new(5).sum();
assert_eq!(sum, 15); // 1 + 2 + 3 + 4 + 5
```

### 性能考虑

迭代器在 Rust 中是零开销抽象，编译器会优化迭代器代码为等效的低级代码，没有性能损失。

## 9.3 函数式编程模式

### 组合模式 (Pipeline)

通过链式调用创建数据处理管道：

```
let v = vec![1, 2, 3, 4, 5];

let sum_of_even_squares: i32 = v.iter()
    .filter(|&&x| x % 2 == 0)     // 只保留偶数
    .map(|&x| x * x)              // 计算平方
    .sum();                       // 求和

assert_eq!(sum_of_even_squares, 20); // 2² + 4² = 4 + 16 = 20
```

### 高阶函数

将函数作为参数或返回函数的函数：

```
// 接受函数作为参数
fn apply_twice<F>(f: F, x: i32) -> i32 
where
    F: Fn(i32) -> i32 
{
    f(f(x))
}

let add_one = |x| x + 1;
let result = apply_twice(add_one, 5);
assert_eq!(result, 7); // (5 + 1) + 1 = 7

// 返回函数
fn create_adder(n: i32) -> impl Fn(i32) -> i32 {
    move |x| x + n
}

let add_five = create_adder(5);
assert_eq!(add_five(10), 15);
```

### 组合子模式

使用函数组合子构建更复杂的行为：

```
use std::collections::HashMap;

// 假设我们有一个处理Result的函数
fn process_data(data: &str) -> Result<i32, String> {
    // 处理逻辑...
    Ok(42)
}

let data = vec!["data1", "invalid", "data3"];

// map_or_else: 处理成功与失败情况
let results: Vec<i32> = data.iter()
    .map(|&d| process_data(d).map_or_else(
        |_err| 0,          // 错误时返回0
        |value| value * 2  // 成功时将值乘以2
    ))
    .collect();
```

### 记忆化和惰性求值

```
use std::collections::HashMap;

// 记忆化斐波那契数列
struct Fibonacci {
    cache: HashMap<u64, u64>,
}

impl Fibonacci {
    fn new() -> Fibonacci {
        let mut cache = HashMap::new();
        cache.insert(0, 0);
        cache.insert(1, 1);
        Fibonacci { cache }
    }

    fn calculate(&mut self, n: u64) -> u64 {
        if !self.cache.contains_key(&n) {
            let value = self.calculate(n - 1) + self.calculate(n - 2);
            self.cache.insert(n, value);
        }
        *self.cache.get(&n).unwrap()
    }
}

// 使用
let mut fib = Fibonacci::new();
assert_eq!(fib.calculate(10), 55);
```

### 惰性序列

```
// 创建一个简单的无限序列
struct Integers {
    current: i32,
}

impl Integers {
    fn new() -> Integers {
        Integers { current: 0 }
    }
}

impl Iterator for Integers {
    type Item = i32;

    fn next(&mut self) -> Option<Self::Item> {
        let result = self.current;
        self.current += 1;
        Some(result)
    }
}

// 使用
let first_five: Vec<i32> = Integers::new().take(5).collect();
assert_eq!(first_five, vec![0, 1, 2, 3, 4]);
```

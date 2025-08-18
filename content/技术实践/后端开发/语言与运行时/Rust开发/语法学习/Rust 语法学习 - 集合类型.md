---
title: "Rust 语法学习 - 集合类型"
date: 2025-03-29T12:24:45+08:00
updated: 2025-08-18T11:36:16+08:00
---

# Rust 语法学习 - 集合类型

集合是包含多个值的数据结构，与数组和元组不同，集合分配在堆上，大小可以在运行时改变。

## 6.1 Vector

`Vec<T>` 可以存储多个相同类型的值，类似于动态数组。

### 创建 Vector

```rust
// 创建空Vec
let v: Vec<i32> = Vec::new();

// 使用宏创建带初始值的Vec
let v = vec![1, 2, 3, 4, 5];

// 创建并添加元素
let mut v = Vec::new();
v.push(5);
v.push(6);
v.push(7);
v.push(8);
```

### 读取元素

有两种读取元素的方式：

```rust
let v = vec![1, 2, 3, 4, 5];

// 使用索引（如果越界会panic）
let third = &v[2];
println!("第三个元素是: {}", third);

// 使用get（返回Option，更安全）
match v.get(2) {
    Some(third) => println!("第三个元素是: {}", third),
    None => println!("没有第三个元素"),
}
```

### 借用规则

Vector 和所有权规则一样遵循借用规则：

```rust
let mut v = vec![1, 2, 3, 4, 5];

let first = &v[0]; // 不可变借用

v.push(6); // 错误: 可变借用，同时存在不可变借用

println!("第一个元素: {}", first);
```

错误原因是 Vector 可能在内存不足时重新分配空间，使原有引用失效。

### 遍历 Vector

```rust
let v = vec![100, 32, 57];

// 遍历不可变引用
for i in &v {
    println!("{}", i);
}

// 遍历可变引用
let mut v = vec![100, 32, 57];
for i in &mut v {
    *i += 50; // 使用解引用操作符修改值
}
```

### 使用枚举存储多种类型

```rust
enum SpreadsheetCell {
    Int(i32),
    Float(f64),
    Text(String),
}

let row = vec![
    SpreadsheetCell::Int(3),
    SpreadsheetCell::Text(String::from("blue")),
    SpreadsheetCell::Float(10.12),
];
```

### 常用方法

```rust
let mut v = vec![1, 2, 3];

// 添加元素
v.push(4);

// 移除最后一个元素并返回
let last = v.pop(); // Some(4)

// 获取长度
let len = v.len(); // 3

// 检查是否为空
let is_empty = v.is_empty(); // false

// 调整大小
v.resize(5, 0); // [1, 2, 3, 0, 0]

// 容量操作
let capacity = v.capacity();
v.reserve(10); // 确保至少还能存储10个元素
v.shrink_to_fit(); // 减少多余的容量

// 清空向量
v.clear(); // []
```

### Vector 的丢弃

```rust
{
    let v = vec![1, 2, 3, 4];
    // 在这里使用v
} // 离开作用域，v被丢弃，所有元素也被丢弃
```

## 6.2 String

Rust 中的字符串有些复杂，因为涉及到字符编码和内存管理。核心语言只有一种字符串类型：`str`，通常以借用形式 `&str` 出现。`String` 类型是从标准库提供的，是可增长、可变、有所有权的 UTF-8 编码字符串。

### 创建字符串

```rust
// 创建新的空String
let mut s = String::new();

// 从字符串字面值创建String
let s = "initial contents".to_string();
let s = String::from("initial contents");

// 创建带有初始内容的String
let hello = String::from("你好");
let hello = String::from("こんにちは");
let hello = String::from("안녕하세요");
```

### 更新字符串

```rust
let mut s = String::from("Hello");

// 追加字符串切片
s.push_str(", world!");

// 追加单个字符
s.push('!');

// 使用+运算符连接
let s1 = String::from("Hello, ");
let s2 = String::from("world!");
let s3 = s1 + &s2; // s1被移动且不能再使用

// 使用format!宏
let s1 = String::from("tic");
let s2 = String::from("tac");
let s3 = String::from("toe");
let s = format!("{}-{}-{}", s1, s2, s3); // 不获取所有权
```

### 索引字符串

Rust 不支持通过索引访问 String 的字符，因为 UTF-8 编码的复杂性：

```rust
let s = String::from("hello");
// let h = s[0]; // 错误：Rust不允许这样做
```

一个 UTF-8 编码的字符可能占用多个字节，按索引访问可能会返回无效的字符。

### 字符串切片

```rust
let hello = "Здравствуйте";
let s = &hello[0..4]; // 获取前4个字节："Зд"
// let s = &hello[0..1]; // 错误：不是字符边界，会panic
```

### 遍历字符串

```rust
let hindi = "नमस्ते";

// 遍历字符
for c in hindi.chars() {
    println!("{}", c);
}

// 遍历字节
for b in hindi.bytes() {
    println!("{}", b);
}
```

### 常用方法

```rust
let mut s = String::from("hello");

// 追加字符串
s.push_str(" world");

// 插入字符
s.insert(5, ',');

// 替换部分内容
s.replace("hello", "hi");

// 删除部分内容
s.remove(5); // 删除第5个字节的字符
s.truncate(5); // 保留前5个字节

// 拆分
let parts: Vec<&str> = s.split(' ').collect();

// 是否包含子串
let contains = s.contains("world");

// 去除空白
let s = "  hello  ".trim();

// 转换大小写
let upper = "hello".to_uppercase();
let lower = "HELLO".to_lowercase();

// 长度
let byte_len = s.len(); // 字节长度
let char_count = s.chars().count(); // 字符数量
```

## 6.3 HashMap

`HashMap<K, V>` 存储键值对的映射，适用于通过键查找数据的情况。

### 创建 HashMap

```rust
use std::collections::HashMap;

// 创建空HashMap
let mut scores = HashMap::new();

// 插入键值对
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

// 从元组的vector创建
let teams = vec![String::from("Blue"), String::from("Yellow")];
let initial_scores = vec![10, 50];
let scores: HashMap<_, _> = teams.into_iter().zip(initial_scores.into_iter()).collect();
```

### 所有权

对于实现了 `Copy` trait 的类型，值会被复制到 HashMap 中。对于其他类型如 `String`，所有权会被转移：

```rust
use std::collections::HashMap;

let field_name = String::from("Favorite color");
let field_value = String::from("Blue");

let mut map = HashMap::new();
map.insert(field_name, field_value);
// field_name和field_value不再有效
```

### 访问值

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Yellow"), 50);

// 使用get方法返回Option<&V>
let team_name = String::from("Blue");
let score = scores.get(&team_name); // Some(&10)

// 遍历键值对
for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

### 更新 HashMap

```rust
use std::collections::HashMap;

let mut scores = HashMap::new();

// 覆盖一个值
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Blue"), 25); // 现在蓝队的分数是25

// 只在键不存在时插入
scores.entry(String::from("Yellow")).or_insert(50);
scores.entry(String::from("Blue")).or_insert(50); // 不会改变蓝队分数

// 根据旧值更新
let text = "hello world wonderful world";
let mut map = HashMap::new();

for word in text.split_whitespace() {
    let count = map.entry(word).or_insert(0);
    *count += 1; // 更新计数
}
// {"hello": 1, "world": 2, "wonderful": 1}
```

### 常用方法

```rust
use std::collections::HashMap;

let mut map = HashMap::new();
map.insert("a", 1);
map.insert("b", 2);

// 检查是否包含键
if map.contains_key("a") {
    println!("有键'a'");
}

// 移除键值对
map.remove("a");

// 获取长度
let len = map.len(); // 1

// 清空
map.clear();

// 默认值
let v = map.entry("c").or_default(); // 如果键不存在，插入默认值并返回其引用

// 获取所有键或值
let keys: Vec<_> = map.keys().collect();
let values: Vec<_> = map.values().collect();
```

### 哈希函数

默认情况下，`HashMap` 使用抵抗 DoS 攻击的哈希函数。可以通过指定不同的 `Hasher` 类型改变哈希算法：

```rust
use std::collections::HashMap;
use std::hash::BuildHasherDefault;
use fnv::FnvHasher; // 需要添加fnv依赖

// 使用FNV算法
let mut map = HashMap::with_hasher(BuildHasherDefault::<FnvHasher>::default());
map.insert(1, "a");
```

## 6.4 其他集合类型

除了上述三种主要集合类型，标准库还提供了其他集合：

### HashSet

与 `HashMap` 类似，但只存储键，用于检查某个值是否存在：

```rust
use std::collections::HashSet;

let mut fruits = HashSet::new();
fruits.insert("apple");
fruits.insert("banana");
fruits.insert("apple"); // 不会重复添加

// 检查包含
let has_apple = fruits.contains("apple"); // true

// 集合操作
let mut set1 = HashSet::new();
set1.insert(1);
set1.insert(2);

let mut set2 = HashSet::new();
set2.insert(2);
set2.insert(3);

// 并集
let union: HashSet<_> = set1.union(&set2).collect(); // {1, 2, 3}

// 交集
let intersection: HashSet<_> = set1.intersection(&set2).collect(); // {2}

// 差集
let difference: HashSet<_> = set1.difference(&set2).collect(); // {1}
```

### BTreeMap / BTreeSet

有序版本的 `HashMap` 和 `HashSet`：

```rust
use std::collections::BTreeMap;
use std::collections::BTreeSet;

let mut map = BTreeMap::new();
map.insert(3, "c");
map.insert(1, "a");
map.insert(2, "b");

// 按键排序遍历
for (key, value) in &map {
    println!("{}: {}", key, value); // 输出顺序: 1: a, 2: b, 3: c
}

let mut set = BTreeSet::new();
set.insert(3);
set.insert(1);
set.insert(2);

// 按值排序遍历
for value in &set {
    println!("{}", value); // 输出顺序: 1, 2, 3
}
```

### VecDeque

双端队列，支持在两端高效添加和删除元素：

```rust
use std::collections::VecDeque;

let mut queue = VecDeque::new();

// 添加元素
queue.push_back(1);   // 后端添加
queue.push_front(0);  // 前端添加

// 删除元素
let first = queue.pop_front(); // 从前端移除
let last = queue.pop_back();   // 从后端移除
```

### LinkedList

双向链表，支持在两端添加和删除元素：

```rust
use std::collections::LinkedList;

let mut list = LinkedList::new();
list.push_back(1);
list.push_back(2);
list.push_front(0);

// [0, 1, 2]
```

### BinaryHeap

二叉最大堆，总是弹出最大值：

```rust
use std::collections::BinaryHeap;

let mut heap = BinaryHeap::new();
heap.push(1);
heap.push(5);
heap.push(2);

assert_eq!(heap.peek(), Some(&5)); // 查看最大值
assert_eq!(heap.pop(), Some(5));   // 移除最大值
```

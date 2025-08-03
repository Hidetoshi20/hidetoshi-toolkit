# Rust 开发规范

本规范旨在为客户端 Rust 项目提供一套统一的开发标准，确保代码质量、可维护性和团队协作效率。规范内容借鉴了社区最佳实践，并结合了客户端开发的具体场景。

## 📚 规范文档索引

- **[项目结构规范](#-项目结构规范)** - Cargo 项目目录、模块组织、文件命名
- **[代码风格与格式化](#-代码风格与格式化)** - `rustfmt`、`clippy`、命名约定
- **[API 设计与文档](#-api-设计与文档)** - 公共 API 设计、文档注释 (`cargo doc`)
- **[错误处理规范](#-错误处理规范)** - `Result<T, E>`、`panic!`、错误类型设计
- **[依赖管理规范](#-依赖管理规范)** - `Cargo.toml`、Crate 版本、安全审计
- **[测试开发规范](#-测试开发规范)** - 单元测试、集成测试、文档测试
- **[并发与异步编程](#-并发与异步编程)** - `async/await`、线程安全、状态管理
- **[Unsafe 使用规范](#-unsafe-使用规范)** - 何时使用、封装与文档
- **[性能优化指南](#-性能优化指南)** - 基准测试、数据结构选择、避免不必要分配

---

## 🏗️ 项目结构规范

### Cargo 项目目录结构
一个标准的 Rust 项目应遵循以下结构：
```
project-root/
├── .cargo/                  # Cargo 配置目录
│   └── config.toml          # Cargo 本地配置
├── benches/                 # 基准测试
│   └── my_benchmark.rs
├── examples/                # 使用示例
│   └── simple.rs
├── src/                     # 源代码
│   ├── bin/                 # 可执行文件源码 (如果项目有多个可执行文件)
│   ├── lib.rs               # 库的根文件
│   ├── main.rs              # 主可执行文件源码
│   ├── api/                 # 模块：API 定义
│   ├── core/                # 模块：核心业务逻辑
│   ├── models/              # 模块：数据结构定义
│   └── utils/               # 模块：通用工具函数
├── tests/                   # 集成测试
│   └── feature_test.rs
├── build.rs                 # 构建脚本
├── Cargo.toml               # 项目清单文件
└── README.md                # 项目说明
```

### 模块组织
- **`lib.rs` 或 `main.rs`**: 作为模块树的根，只用于组织和声明子模块，不应包含具体实现。
- **按功能划分模块**: 在 `src` 目录下创建与功能对应的子目录（如 `api`, `core`, `utils`），每个子目录包含一个 `mod.rs` 文件来声明其内部模块。
- **`mod.rs` 与 `module_name.rs`**:
  - 使用 `module_name/mod.rs` 来组织包含多个子模块的复杂模块。
  - 使用 `module_name.rs` 来定义一个独立的、不包含子模块的模块。

### 文件命名规范
- **文件名**: 使用蛇形命名法 (`snake_case`)，例如 `user_profile.rs`。
- **目录名**: 使用蛇形命名法 (`snake_case`)，例如 `data_models`。

---

## 💅 代码风格与格式化

### 自动格式化与 Lint
- **`rustfmt`**: 所有提交的代码都必须使用 `rustfmt` 进行格式化。建议在 IDE 中配置保存时自动格式化。
- **`clippy`**: 强制使用 `clippy` 进行代码检查。应修复所有 `clippy::all` 和 `clippy::pedantic` 级别的警告，除非有充分理由并使用 `#[allow(...)]` 明确标注。

```bash
# 格式化代码
cargo fmt

# 运行 Clippy
cargo clippy -- -D warnings
```

### 命名约定
- **变量/函数/模块**: 蛇形命名法 (`snake_case`)，例如 `user_id`, `fetch_data`。
- **类型/Trait/枚举**: 驼峰命名法 (`PascalCase`)，例如 `UserProfile`, `Fetchable`。
- **常量**: 大写蛇形命名法 (`SCREAMING_SNAKE_CASE`)，例如 `MAX_CONNECTIONS`。
- **泛型**: 简短的驼峰命名法 (`PascalCase`)，通常是单个大写字母，例如 `T`, `U`, `E`。

---

## 📖 API 设计与文档

### 公共 API 设计
- **最小化原则**: 只将必要的部分声明为 `pub`。模块内部的实现细节应保持私有。
- **稳定性**: 公共 API 应被视为稳定接口。任何破坏性变更都需要在版本号中体现（遵循 SemVer）。
- **一致性**: API 的命名和行为应在整个项目中保持一致。

### 文档注释
- **强制要求**: 所有 `pub` 的函数、结构体、枚举、Trait 和模块都必须有文档注释。
- **使用 `///`**: 为外部可见项编写文档。
- **使用 `//!`**: 为模块或 Crate 整体编写文档。
- **包含示例代码**: 文档注释中应包含可运行的示例代码块，并通过 `cargo test` 进行测试。

```rust
//! `user_management` 模块提供了用户管理的核心功能。
//!
//! 这个模块负责用户的创建、查询和更新。

/// 代表一个系统用户。
///
/// # Examples
///
/// ```
/// use my_project::models::User;
///
/// let user = User::new("1", "Alice");
/// assert_eq!(user.name, "Alice");
/// ```
pub struct User {
    pub id: String,
    pub name: String,
}

impl User {
    /// 创建一个新用户。
    ///
    /// # Panics
    ///
    /// 如果 `id` 或 `name` 为空，则会 panic。
    pub fn new(id: &str, name: &str) -> Self {
        if id.is_empty() || name.is_empty() {
            panic!("ID and name cannot be empty");
        }
        Self {
            id: id.to_string(),
            name: name.to_string(),
        }
    }
}
```

---

## 🛡️ 错误处理规范

### `Result` vs `panic!`
- **可恢复错误 (`Result<T, E>`)**: 对于可预期的、能够被调用者处理的错误（如 I/O 错误、解析失败、业务逻辑错误），必须返回 `Result`。
- **不可恢复错误 (`panic!`)**: 仅在程序遇到无法恢复的状态时使用 `panic!`。例如：
  - 违反了代码内部的某个不变量或契约。
  - 示例代码或测试中，用于简化错误处理。
  - 无法修复的致命错误。

### 错误类型设计
- **专用错误类型**: 为每个模块或主要功能定义专用的错误枚举，并实现 `std::error::Error` Trait。
- **使用 `thiserror`**: 推荐使用 `thiserror` 库来简化错误类型的定义。
- **使用 `anyhow`**: 在应用程序的顶层（例如 `main.rs`）或测试中，可以使用 `anyhow::Result` 来简化错误链的处理。

```rust
use thiserror::Error;

#[derive(Error, Debug)]
pub enum DataError {
    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),
    
    #[error("Deserialization failed: {0}")]
    Parse(#[from] serde_json::Error),

    #[error("User not found with id: {0}")]
    NotFound(String),

    #[error("Unknown data store error")]
    Unknown,
}

pub fn fetch_user(user_id: &str) -> Result<User, DataError> {
    // ... 业务逻辑
    Err(DataError::NotFound(user_id.to_string()))
}
```

---

## 📦 依赖管理规范

### `Cargo.toml`
- **版本锁定**: 优先使用精确版本号（例如 `version = "1.2.3"`）或带 `~` 的版本（`version = "~1.2"`）来避免不必要的破坏性更新。
- **功能开关 (`features`)**: 只启用需要的功能，以减少编译时间和二进制文件大小。
- **开发依赖**: 将测试、基准测试、示例代码的依赖项放在 `[dev-dependencies]` 中。

### 安全审计
- **定期审计**: 使用 `cargo-audit` 或 `cargo-deny` 定期检查项目的依赖项是否存在已知的安全漏洞。

```bash
# 安装 cargo-audit
cargo install cargo-audit

# 运行审计
cargo audit
```

---

## 🧪 测试开发规范

### 测试类型
- **单元测试**: 与源代码放在同一个文件中，位于 `#[cfg(test)]` 模块内。用于测试私有函数和模块内部逻辑。
- **集成测试**: 放在 `tests` 目录下。每个文件都是一个独立的 Crate，只能测试库的公共 API。
- **文档测试**: `cargo test` 会自动运行文档注释中的示例代码。

### 测试结构
```rust
// src/utils.rs

pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 2), 4);
    }

    #[test]
    #[should_panic]
    fn test_add_overflow() {
        // 示例：测试 panic
    }
}
```

### Mocking
- **Trait 和泛型**: 优先使用 Trait 和泛型来抽象依赖，以便在测试中传入 Mock 实现。
- **`mockall`**: 对于复杂的场景，可以使用 `mockall` 等库来创建 Mock 对象。

---

## ⚡ 并发与异步编程

### 线程安全
- **所有权与借用**: 充分利用 Rust 的所有权和借用检查器来在编译时防止数据竞争。
- **同步原语**:
  - `Arc<T>`: 用于在多个线程之间共享所有权。
  - `Mutex<T>` / `RwLock<T>`: 用于保护共享数据，提供互斥访问。

### 异步编程
- **`async/await`**: 在进行 I/O 密集型操作时，使用 `async/await` 语法。
- **运行时选择**: 根据项目需求选择合适的异步运行时（如 `tokio`, `async-std`）。
- **`Send` 和 `Sync`**: 确保在异步任务和线程间传递的数据类型实现了 `Send` 和 `Sync` Trait。

---

## ⚠️ Unsafe 使用规范

- **极力避免**: `unsafe` 是 Rust 的“逃生舱口”，应极力避免使用。
- **充分理由**: 只有在以下情况才考虑使用 `unsafe`：
  - 与 C 库进行 FFI（外部函数接口）交互。
  - 实现需要手动内存管理的底层数据结构。
  - 访问和修改静态可变变量。
- **封装与文档**:
  - **封装**: 必须将 `unsafe` 代码块封装在安全的抽象（函数或模块）内部。
  - **文档**: 必须为 `unsafe` 代码块添加详细注释，解释其必要性以及如何满足其安全契约。

```rust
/// # Safety
///
/// 调用者必须确保传入的 `slice` 长度至少为 `len`。
pub unsafe fn get_unchecked(slice: &[u8], index: usize) -> u8 {
    // 此处有详细的理由说明为什么这个操作是安全的
    *slice.get_unchecked(index)
}
```

---

## 🚀 性能优化指南

- **基准测试先行**: 在进行任何优化之前，必须使用 `cargo bench` 编写基准测试来识别性能瓶颈。
- **数据结构选择**: 根据访问模式选择合适的数据结构（例如 `Vec` vs `HashMap`）。
- **避免不必要的分配**:
  - 优先使用栈分配。
  - 尽可能使用切片（`&str`, `&[T]`）代替有所有权的数据类型（`String`, `Vec<T>`）。
  - 使用迭代器（Iterators）进行零成本抽象。
- **发布构建**: 始终使用 `cargo run --release` 或 `cargo build --release` 来测试和发布性能敏感的应用。

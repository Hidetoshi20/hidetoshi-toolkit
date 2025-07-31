# 前端 TypeScript React Monorepo 开发规范

> 本规范文档已拆分为多个专门的文件，便于AI助手和开发者查阅。每个文件专注于特定的开发领域。

## 📚 规范文档索引

### 🏗️ 项目结构
- **[项目结构规范](./project-structure.md)** - Monorepo目录结构、文件命名、index.ts导出规范

### 🔧 开发规范
- **[TypeScript开发规范](./typescript-standards.md)** - 类型定义、导入导出、文档规范
- **[React开发规范](./react-standards.md)** - 组件结构、状态管理、API调用、性能优化
- **[样式开发规范](./styling-standards.md)** - Less Module、classnames、设计系统、响应式设计

### 🧪 测试规范
- **[测试开发规范](./testing-standards.md)** - Vitest、Storybook、Mock数据、测试配置

### 🛡️ 错误处理
- **[错误处理规范](./error-handling-standards.md)** - 静态函数错误处理、组件错误边界、异步错误处理

### 📖 文档规范
- **[文档编写规范](./documentation-standards.md)** - 文档结构、编写原则、模板示例

## 🎯 核心原则

### 面向AI设计
- 文档主要供AI助手阅读，使用清晰的结构和标准格式
- 每个规范都有完整的代码示例和说明
- 便于AI理解和生成符合规范的代码

### 工具集成
- 优先使用 `ahooks` 的 `useRequest` 处理异步请求
- 使用 `lodash` 的工具函数进行数据处理
- 使用 `classnames` 进行样式类名拼接
- 使用 `pnpm` 作为包管理器

### 代码质量
- 全面使用TypeScript进行类型检查
- 统一的命名规范和代码风格
- 完整的错误处理和测试覆盖
- 模块化的项目结构

## 🚀 快速开始

1. **查看项目结构**：[项目结构规范](./project-structure.md)
2. **了解开发规范**：[TypeScript规范](./typescript-standards.md) | [React规范](./react-standards.md)
3. **学习样式开发**：[样式开发规范](./styling-standards.md)
4. **掌握测试方法**：[测试开发规范](./testing-standards.md)
5. **了解错误处理**：[错误处理规范](./error-handling-standards.md)
6. **学习文档编写**：[文档编写规范](./documentation-standards.md)

## 📋 规范特点

- **完整性**：覆盖前端开发的各个方面
- **实用性**：提供具体的代码示例和最佳实践
- **可维护性**：清晰的文档结构和更新规范
- **AI友好**：专门为AI助手设计的文档格式

---

*本规范文档会持续更新，确保与最新的开发实践保持一致。* 
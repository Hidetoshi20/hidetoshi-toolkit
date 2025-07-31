# 项目结构规范

## Monorepo 目录结构
```
project-root/
├── packages/
│   ├── shared/                 # 共享组件和工具
│   │   ├── components/         # 共享UI组件
│   │   ├── hooks/             # 共享React Hooks
│   │   ├── utils/             # 共享工具函数
│   │   └── types/             # 共享TypeScript类型定义
│   ├── app1/                  # 应用1
│   ├── app2/                  # 应用2
│   └── libs/                  # 第三方库封装
├── scripts/                   # 构建工具和脚本
├── docs/                      # 项目文档
└── package.json              # 根package.json
```

## 文档目录结构
```
docs/
├── README.md                    # 项目总体说明
├── getting-started.md           # 快速开始指南
├── architecture.md              # 架构设计文档
├── api/                         # API 文档
│   ├── user.md
│   └── auth.md
├── components/                  # 组件文档
│   ├── Button.md
│   └── UserProfile.md
├── guides/                      # 开发指南
│   ├── testing.md
│   └── deployment.md
└── design/                      # 设计文档
    ├── design-system.md
    └── ui-components.md
```

## 测试目录结构
- **函数测试**：使用 Vitest，统一放在 `src/__tests__` 目录下
- **组件测试**：使用 Storybook，统一放在 `src/stories` 目录下
- **Mock 数据**：统一放在 `src/__mocks__` 目录下

## 文件命名规范
- 组件文件：`PascalCase.tsx`
- 工具文件：`camelCase.ts`
- 类型文件：`types.ts` 或 `index.ts`
- 常量文件：`constants.ts`
- 样式文件：`ComponentName.module.less`
- 测试文件：`functionName.test.ts`
- 组件 Story：`ComponentName.stories.tsx`
- Mock 数据：`apiName.mock.ts`

## index.ts 统一导出规范
每个目录下都应该有一个 `index.ts` 文件，用于统一导出该目录下的所有公共接口：

```typescript
// components/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { UserProfile } from './UserProfile';

// types/index.ts
export type { UserData, UserStatus } from './user';
export type { ComponentProps, StateType } from './component';

// hooks/index.ts
export { useUser } from './useUser';
export { useRequest } from 'ahooks';

// utils/index.ts
export { formatDate } from './date';
export { validateEmail } from './validation';
export { debounce, throttle } from 'lodash';
```

**使用规范：**
- 外部目录导入时，统一从 `index.ts` 导入
- 内部文件之间可以相互导入
- `index.ts` 只导出需要对外暴露的接口
- 避免在 `index.ts` 中重新导出第三方库，除非需要统一管理 
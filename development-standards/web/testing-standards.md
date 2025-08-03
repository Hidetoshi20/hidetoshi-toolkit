# 测试开发规范

## 测试工具和目录结构
- **函数测试**：使用 Vitest，统一放在 `src/__tests__` 目录下
- **组件测试**：使用 Storybook，统一放在 `src/stories` 目录下
- **Mock 数据**：统一放在 `src/__mocks__` 目录下

## 测试文件命名
- 函数测试：`functionName.test.ts`
- 组件 Story：`ComponentName.stories.tsx`
- Mock 数据：`apiName.mock.ts`

## Vitest 函数测试结构
```typescript
import { describe, it, expect, vi } from 'vitest';
import { formatDate, validateEmail } from '@/utils';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('2023-01-01');
  });
  
  it('should handle invalid date', () => {
    expect(formatDate(null)).toBe('');
  });
});

describe('validateEmail', () => {
  it('should validate correct email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  it('should reject invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

## Storybook 组件测试结构
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { UserProfile } from './UserProfile';

const meta: Meta<typeof UserProfile> = {
  title: 'Components/UserProfile',
  component: UserProfile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
      status: 'active'
    },
    onSave: (data) => console.log('Save:', data),
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    user: null,
  },
};
```

## Mock 数据使用规范
```typescript
// src/__mocks__/user.mock.ts
export const mockUser: UserData = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  status: 'active'
};

export const mockUserList: UserData[] = [
  mockUser,
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://example.com/jane.jpg',
    status: 'inactive'
  }
];

// src/__mocks__/api.mock.ts
export const mockApiResponse = {
  success: true,
  data: mockUserList,
  message: 'Success'
};

// 在测试中使用
import { mockUser, mockUserList } from '@/__mocks__/user.mock';
import { mockApiResponse } from '@/__mocks__/api.mock';

describe('User API', () => {
  it('should fetch user data', async () => {
    const response = await fetchUserData('1');
    expect(response).toEqual(mockUser);
  });
});
```

## 测试配置

### Vitest 配置 (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Storybook 配置 (.storybook/main.ts)
```typescript
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
```

## 测试最佳实践

### 函数测试原则
- 测试函数的核心功能
- 测试边界条件和错误情况
- 使用描述性的测试名称
- 保持测试的独立性

### 组件测试原则
- 测试组件的渲染和交互
- 测试不同状态下的组件表现
- 使用 Storybook 展示组件的各种状态
- 提供完整的组件使用示例

### Mock 数据原则
- 创建真实的数据结构
- 提供多种测试场景的数据
- 保持 Mock 数据的可维护性
- 避免在测试中硬编码数据

## 测试覆盖率要求
- 函数测试覆盖率：≥ 80%
- 组件测试覆盖率：≥ 70%
- 关键业务逻辑：100% 覆盖

## 测试运行命令
```bash
# 运行函数测试
pnpm test

# 运行 Storybook
pnpm storybook

# 生成测试覆盖率报告
pnpm test:coverage

# 运行特定测试文件
pnpm test:unit -- src/__tests__/utils.test.ts
``` 
# TypeScript 开发规范

## 类型定义规范
- 接口使用描述性名称：`UserData`
- 类型使用描述性名称：`UserStatus`
- 枚举使用描述性名称：`UserRole`
- 常量使用全大写加下划线：`API_ENDPOINTS`

## 导入导出规范
```typescript
// 优先使用命名导出
export { Button, Input } from './components';
export type { UserData, UserStatus } from './types';

// 统一使用命名导出，避免默认导出
export { UserProfile } from './UserProfile';

// 使用 index.ts 进行统一导入
import { Button, Input, UserProfile } from '@/components';
import { UserData, UserStatus } from '@/types';
import { useUser, formatDate } from '@/hooks';
```

## 类型文档规范
```typescript
/**
 * 用户数据接口
 * 
 * @description 定义用户对象的数据结构
 * @property id - 用户唯一标识
 * @property name - 用户姓名
 * @property email - 用户邮箱
 * @property avatar - 用户头像URL
 * @property status - 用户状态，可以是 'active' | 'inactive' | 'pending'
 */
interface UserData {
  /** 用户唯一标识符 */
  id: string;
  /** 用户姓名，必填项 */
  name: string;
  /** 用户邮箱地址，必须符合邮箱格式 */
  email: string;
  /** 用户头像URL，可选 */
  avatar?: string;
  /** 用户状态，默认为 'active' */
  status: UserStatus;
}
```

## 工具函数文档
```typescript
/**
 * 格式化日期为指定格式
 * 
 * @description 将Date对象格式化为可读的字符串，支持多种格式
 * @since 1.0.0
 * 
 * @param date - 要格式化的日期对象
 * @param format - 输出格式，默认为 'YYYY-MM-DD'
 * @returns 格式化后的日期字符串，如果输入无效则返回空字符串
 * 
 * @example
 * ```typescript
 * import { formatDate } from '@/utils/date';
 * 
 * const date = new Date('2023-01-01');
 * formatDate(date); // '2023-01-01'
 * formatDate(date, 'YYYY/MM/DD'); // '2023/01/01'
 * ```
 */
```

## API 文档规范
```typescript
/**
 * 获取用户数据
 * 
 * @description 从服务器获取指定用户的详细信息，支持缓存和错误重试
 * @since 1.0.0
 * @author API团队
 * 
 * @param userId - 用户唯一标识符，必须是有效的字符串
 * @param options - 请求选项，包含超时时间和重试次数
 * @returns Promise<UserData> 用户数据对象，包含完整的用户信息
 * @throws {Error} 当网络请求失败或用户不存在时抛出错误
 * 
 * @example
 * ```typescript
 * import { fetchUserData } from '@/api/user';
 * 
 * try {
 *   const userData = await fetchUserData('123');
 *   console.log(userData.name);
 * } catch (error) {
 *   console.error('获取用户数据失败:', error);
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // 使用自定义选项
 * const userData = await fetchUserData('123', {
 *   timeout: 5000,
 *   retries: 3
 * });
 * ```
 */
```

## Hook 文档规范
```typescript
/**
 * 用户数据管理Hook
 * 
 * @description 提供用户数据的获取、更新和缓存功能
 * @since 1.0.0
 * 
 * @param userId - 用户ID，用于获取指定用户的数据
 * @returns 包含用户数据、加载状态和操作方法的对象
 * 
 * @example
 * ```typescript
 * import { useUser } from '@/hooks/useUser';
 * 
 * const { user, loading, updateUser, refreshUser } = useUser('123');
 * 
 * if (loading) return <Loading />;
 * if (!user) return <NotFound />;
 * 
 * return <UserProfile user={user} onUpdate={updateUser} />;
 * ```
 */
```

## 环境配置类型定义
```typescript
// 环境变量类型定义
interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  APP_VERSION: string;
}

// 环境变量验证
const validateEnvironment = (env: any): Environment => {
  if (!env.API_BASE_URL) {
    throw new Error('API_BASE_URL is required');
  }
  return env as Environment;
};
``` 

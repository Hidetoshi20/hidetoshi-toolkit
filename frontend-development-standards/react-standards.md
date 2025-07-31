# React 开发规范

## 组件结构规范
```typescript
import React, { useState, useEffect } from 'react';
import { useRequest } from 'ahooks';
import { debounce } from 'lodash';
import classNames from 'classnames';
import styles from './ComponentName.module.less';

interface ComponentProps {
  title: string;
  onSave?: (data: UserData) => void;
}

const ComponentName: React.FC<ComponentProps> = ({ title, onSave }) => {
  // 状态定义
  const [state, setState] = useState<StateType>(initialValue);
  
  // 使用 ahooks 的 useRequest
  const { data, loading, run } = useRequest(fetchData, {
    manual: true,
    onSuccess: (result) => {
      // 处理成功逻辑
    }
  });
  
  // 使用 lodash 的 debounce
  const debouncedSave = debounce(onSave, 300);
  
  // 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [dependencies]);
  
  return (
    <div className={styles.componentName}>
      {/* JSX 内容 */}
    </div>
  );
};

export { ComponentName };
```

## 组件分类
- **展示组件**：纯展示，无状态，接收 props
- **容器组件**：处理业务逻辑，管理状态
- **高阶组件**：用于组件复用和逻辑抽象

## Hooks 使用规范
- 优先使用 `ahooks` 的 `useRequest` 处理异步请求
- 使用 `lodash` 的工具函数进行数据处理
- 自定义 Hooks 以 `use` 开头：`useUserData`

## 状态管理规范

### 状态分类
- **本地状态**：使用 `useState`
- **共享状态**：优先使用 Context API，Redux 仅适用于极少的单实例全局数据
- **服务端状态**：使用 `ahooks` 的 `useRequest`

### Context 使用规范
```typescript
// 创建 Context
const UserContext = React.createContext<UserContext | null>(null);

// Provider 组件
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// 自定义 Hook
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
```

### Context + useReducer 组合使用示例
```typescript
// 定义 Action 类型
type UserAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'CLEAR_USER' };

// 定义 Reducer
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return { user: action.payload, loading: false };
    case 'UPDATE_USER':
      return { 
        user: state.user ? { ...state.user, ...action.payload } : null, 
        loading: false 
      };
    case 'CLEAR_USER':
      return { user: null, loading: false };
    default:
      return state;
  }
};

// 使用 useReducer 的 Provider
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, { user: null, loading: false });
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};
```

### 状态管理选择指南

**优先使用 Context API 的场景：**
- 组件树中的状态共享
- 主题、语言等全局配置
- 用户信息、认证状态
- 购物车、表单状态等业务状态

**考虑使用 Redux 的场景：**
- 需要复杂的状态计算和中间件
- 需要时间旅行调试功能
- 需要严格的状态不可变性
- 大型应用中需要统一的状态管理

**推荐做法：**
- 90% 的情况下使用 Context API + useReducer
- 只有确实需要 Redux 特性时才使用 Redux
- 避免过度工程化，保持简单

## API 调用规范

### 使用 ahooks useRequest
```typescript
import { useRequest } from 'ahooks';

const useUserData = (userId: string) => {
  return useRequest(
    () => fetchUserData(userId),
    {
      refreshDeps: [userId],
      onSuccess: (data) => {
        console.log('用户数据获取成功:', data);
      },
      onError: (error) => {
        console.error('用户数据获取失败:', error);
      }
    }
  );
};
```

### API 函数规范
```typescript
// api/user.ts
export const fetchUserData = async (userId: string): Promise<UserData> => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
};
```

## 组件文档规范
```typescript
/**
 * 用户资料组件
 * 
 * @description 用于显示和编辑用户基本信息，支持头像上传和表单验证
 * @since 1.0.0
 * @author 开发团队
 * 
 * @example
 * ```tsx
 * import { UserProfile } from '@/components';
 * 
 * <UserProfile 
 *   user={userData} 
 *   onSave={handleSave}
 *   editable={true}
 * />
 * ```
 * 
 * @param user - 用户数据对象，包含用户的基本信息
 * @param onSave - 保存回调函数，当用户点击保存时触发
 * @param editable - 是否可编辑，默认为 true
 * @param loading - 是否显示加载状态，默认为 false
 * 
 * @returns JSX.Element 用户资料组件
 * 
 * @throws {Error} 当用户数据格式不正确时抛出错误
 */
```

## 性能优化规范

### 组件优化
- 使用 `React.memo` 包装纯组件
- 使用 `useMemo` 缓存计算结果
- 使用 `useCallback` 缓存函数引用

### 代码分割
```typescript
// 使用 React.lazy 进行代码分割
const UserProfile = React.lazy(() => import('./UserProfile').then(module => ({ default: module.UserProfile })));

// 在路由中使用
<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>
``` 
# 错误处理规范

## 静态函数错误处理
所有静态函数都应该添加 try-catch 错误处理：

```typescript
// 工具函数错误处理
export const formatDate = (date: Date | null): string => {
  try {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const validateEmail = (email: string): boolean => {
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  } catch (error) {
    console.error('Error validating email:', error);
    return false;
  }
};

// API 函数错误处理
export const fetchUserData = async (userId: string): Promise<UserData> => {
  try {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
};
```

## 组件错误边界使用
对于规模适当大小的组件，合理使用 ErrorBoundary：

```typescript
// 错误边界组件
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

// 在组件中使用错误边界
const UserProfilePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <UserProfile />
    </ErrorBoundary>
  );
};

// 对于小型组件，可以在组件内部处理错误
const UserAvatar: React.FC<{ user: UserData }> = ({ user }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div className="avatar-fallback">头像加载失败</div>;
  }

  return (
    <img
      src={user.avatar}
      alt={user.name}
      onError={() => setHasError(true)}
      className="user-avatar"
    />
  );
};
```

## 异步错误处理
```typescript
const { data, loading, error } = useRequest(fetchData, {
  onError: (error) => {
    // 统一错误处理
    showErrorMessage(error.message);
  }
});

if (error) {
  return <ErrorMessage error={error} />;
}
```

## 错误处理最佳实践

### 静态函数错误处理原则
- 所有工具函数都应该有 try-catch
- 提供合理的默认返回值
- 记录错误日志便于调试
- 避免抛出未处理的错误

### 组件错误边界使用原则
- 页面级组件使用 ErrorBoundary
- 复杂业务组件使用 ErrorBoundary
- 简单展示组件内部处理错误
- 提供友好的错误提示界面

### 错误分类处理
```typescript
// 网络错误
if (error.name === 'NetworkError') {
  return <NetworkErrorFallback />;
}

// 权限错误
if (error.status === 403) {
  return <PermissionErrorFallback />;
}

// 数据错误
if (error.status === 404) {
  return <NotFoundFallback />;
}

// 通用错误
return <GeneralErrorFallback error={error} />;
```

## 错误监控和日志

### 全局错误处理
```typescript
// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // 发送到错误监控服务
});

// React 错误边界
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  console.error('React error:', error, errorInfo);
  // 发送到错误监控服务
}
```

### 性能监控
```typescript
// 使用 Performance API
const measureComponentRender = (componentName: string) => {
  const start = performance.now();
  return () => {
    const end = performance.now();
    console.log(`${componentName} render time:`, end - start);
  };
};
```

## 错误处理工具函数

### 错误包装器
```typescript
// 包装异步函数，提供统一的错误处理
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorMessage: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  };
};

// 使用示例
const safeFetchUser = withErrorHandling(
  fetchUserData,
  'Failed to fetch user data'
);
```

### 错误重试机制
```typescript
// 带重试的异步函数
export const withRetry = <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return async (): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i === maxRetries) break;
        
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    
    throw lastError!;
  };
};

// 使用示例
const fetchUserWithRetry = withRetry(
  () => fetchUserData('123'),
  3,
  1000
);
```

## 错误处理配置

### 错误边界配置
```typescript
interface ErrorBoundaryConfig {
  fallback: React.ComponentType<{ error: Error }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  shouldRethrow?: boolean;
}

// 可配置的错误边界
class ConfigurableErrorBoundary extends React.Component<
  ErrorBoundaryConfig & { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: ErrorBoundaryConfig & { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error!} />;
    }

    return this.props.children;
  }
}
``` 
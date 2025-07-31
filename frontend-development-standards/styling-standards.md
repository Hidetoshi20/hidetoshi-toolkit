# 样式开发规范

## Less Module 样式
- 使用 Less Module 进行样式隔离
- 组件样式文件与组件文件同名：`ComponentName.module.less`
- 使用 classnames 库进行类名拼接

## 样式命名规范
```less
/* 使用 BEM 命名法 */
.userProfile {
  /* 组件样式 */
  
  &__header {
    /* 子元素样式 */
  }
  
  &--active {
    /* 修饰符样式 */
  }
  
  &__content {
    padding: 16px;
    
    &__title {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
```

## Less Module 和 classnames 使用示例
```typescript
// ComponentName.tsx
import React from 'react';
import classNames from 'classnames';
import styles from './ComponentName.module.less';

interface ComponentProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

const ComponentName: React.FC<ComponentProps> = ({ 
  variant = 'primary', 
  size = 'medium', 
  disabled = false 
}) => {
  const buttonClass = classNames(
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    {
      [styles['button--disabled']]: disabled
    }
  );

  return (
    <button className={buttonClass} disabled={disabled}>
      按钮内容
    </button>
  );
};

export { ComponentName };
```

```less
// ComponentName.module.less
@primary-color: #1890ff;
@secondary-color: #f0f0f0;

.button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &--primary {
    background-color: @primary-color;
    color: white;
    
    &:hover:not(.button--disabled) {
      opacity: 0.8;
    }
  }
  
  &--secondary {
    background-color: @secondary-color;
    color: #333;
    
    &:hover:not(.button--disabled) {
      background-color: darken(@secondary-color, 10%);
    }
  }
  
  &--small {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

## Less Module 变量和混入使用规范
```less
// 定义全局变量 (variables.less)
@primary-color: #1890ff;
@border-radius: 4px;
@font-size-base: 14px;

// 定义混入 (mixins.less)
.flex-center() {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-base() {
  padding: 8px 16px;
  border-radius: @border-radius;
  font-size: @font-size-base;
  cursor: pointer;
  transition: all 0.3s;
}

// 组件样式使用 (ComponentName.module.less)
@import './variables.less';
@import './mixins.less';

.userProfile {
  .flex-center();
  
  &__button {
    .button-base();
    background-color: @primary-color;
    color: white;
    
    &:hover {
      opacity: 0.8;
    }
  }
}
```

## 样式最佳实践

### 设计系统变量
```less
// design-tokens.less
// 颜色系统
@color-primary: #1890ff;
@color-success: #52c41a;
@color-warning: #faad14;
@color-error: #f5222d;

// 间距系统
@spacing-xs: 4px;
@spacing-sm: 8px;
@spacing-md: 16px;
@spacing-lg: 24px;
@spacing-xl: 32px;

// 字体系统
@font-size-xs: 12px;
@font-size-sm: 14px;
@font-size-md: 16px;
@font-size-lg: 18px;
@font-size-xl: 20px;

// 圆角系统
@border-radius-sm: 2px;
@border-radius-md: 4px;
@border-radius-lg: 8px;
```

### 响应式设计
```less
// breakpoints.less
@screen-xs: 480px;
@screen-sm: 576px;
@screen-md: 768px;
@screen-lg: 992px;
@screen-xl: 1200px;

// 响应式混入
.responsive(@min-width, @content) {
  @media (min-width: @min-width) {
    @content();
  }
}

// 使用示例
.container {
  padding: @spacing-md;
  
  .responsive(@screen-md, {
    padding: @spacing-lg;
  });
  
  .responsive(@screen-lg, {
    padding: @spacing-xl;
  });
}
```

### 动画和过渡
```less
// animations.less
@transition-duration: 0.3s;
@transition-timing: ease-in-out;

.fade-in() {
  opacity: 0;
  animation: fadeIn @transition-duration @transition-timing forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 使用示例
.modal {
  .fade-in();
}
```

## 样式组织规范

### 文件结构
```
styles/
├── variables.less          # 全局变量
├── mixins.less            # 全局混入
├── animations.less         # 动画定义
├── breakpoints.less       # 响应式断点
├── design-tokens.less     # 设计系统变量
└── components/            # 组件样式
    ├── Button.module.less
    └── UserProfile.module.less
```

### 导入顺序
```less
// 1. 导入全局变量和混入
@import './variables.less';
@import './mixins.less';

// 2. 组件样式
.component {
  // 样式内容
}
```

### 命名约定
- 组件类名使用 PascalCase：`.userProfile`
- 子元素使用双下划线：`&__header`
- 修饰符使用双横线：`&--active`
- 状态类使用双横线：`&--disabled` 
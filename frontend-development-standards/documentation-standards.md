# 文档编写规范

## 文档类型和目录结构
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

## 文档编写原则
- **面向AI**：文档主要供AI助手阅读，使用清晰的结构和标准格式
- **完整性**：每个功能模块都应有完整的文档说明
- **可维护性**：文档结构清晰，便于更新和维护
- **实用性**：重点说明如何使用，而非实现细节

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

## 工具函数文档规范
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

## Markdown 文档编写规范

### 文档结构模板
```markdown
# 文档标题

## 概述
简要说明文档的目的和内容。

## 功能特性
- 特性1：详细说明
- 特性2：详细说明

## 使用方法
### 基本用法
```typescript
// 代码示例
```

### 高级用法
```typescript
// 高级代码示例
```

## API 参考
### 参数说明
| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| param1 | string | 是 | - | 参数说明 |

## 注意事项
- 重要提醒1
- 重要提醒2

## 相关链接
- [相关文档1](link1)
- [相关文档2](link2)
```

### 文档编写要求
- **标题层级**：使用标准的Markdown标题层级（#, ##, ###）
- **代码块**：使用语法高亮，标明语言类型
- **表格**：使用标准Markdown表格格式
- **链接**：使用相对路径或绝对路径
- **图片**：提供alt文本，使用相对路径
- **列表**：使用有序列表和无序列表
- **强调**：使用**粗体**和*斜体*进行强调

### 文档更新规范
- 每次功能更新时同步更新相关文档
- 使用版本号标记文档更新
- 提供更新日志和变更说明
- 保持文档的时效性和准确性

## 文档质量检查清单

### 内容完整性
- [ ] 文档标题清晰明确
- [ ] 概述部分说明了文档目的
- [ ] 功能特性完整列出
- [ ] 使用示例覆盖主要场景
- [ ] API 参数说明详细
- [ ] 注意事项和限制条件明确

### 格式规范性
- [ ] 标题层级使用正确
- [ ] 代码块有语言标识
- [ ] 表格格式规范
- [ ] 链接地址有效
- [ ] 图片有 alt 文本

### 可维护性
- [ ] 文档结构清晰
- [ ] 内容组织合理
- [ ] 便于后续更新
- [ ] 版本信息完整

## 文档模板示例

### 组件文档模板
```markdown
# ComponentName 组件

## 概述
ComponentName 是一个用于...的 React 组件。

## 功能特性
- 特性1：支持...
- 特性2：提供...

## 基本用法
```tsx
import { ComponentName } from '@/components';

<ComponentName 
  prop1="value1"
  prop2="value2"
/>
```

## API 参考

### Props
| 属性 | 类型 | 默认值 | 必填 | 说明 |
|------|------|--------|------|------|
| prop1 | string | - | 是 | 属性说明 |
| prop2 | number | 0 | 否 | 属性说明 |

### 事件
| 事件名 | 类型 | 说明 |
|--------|------|------|
| onChange | (value: string) => void | 值变化时触发 |

## 注意事项
- 注意事项1
- 注意事项2

## 相关链接
- [设计稿](link)
- [相关组件](link)
```

### API 文档模板
```markdown
# API 名称

## 概述
API 的功能描述和用途说明。

## 请求格式
```typescript
// 请求示例
const response = await apiName(params);
```

## 参数说明
| 参数名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| param1 | string | 是 | - | 参数说明 |

## 响应格式
```typescript
interface Response {
  code: number;
  data: DataType;
  message: string;
}
```

## 错误码
| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 400 | 参数错误 | 检查参数格式 |
| 500 | 服务器错误 | 联系技术支持 |

## 使用示例
```typescript
// 示例代码
```

## 注意事项
- 注意事项1
- 注意事项2
``` 
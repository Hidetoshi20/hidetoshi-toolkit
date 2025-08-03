# SwiftUI 开发规范

本规范为使用 SwiftUI 构建 iOS、macOS 及其他 Apple 平台应用提供了指导原则和最佳实践，旨在确保代码的清晰性、可维护性和性能。

## 📚 规范文档索引

- **[项目结构规范](#-项目结构规范)** - Xcode 项目分组、文件组织
- **[代码风格与格式化](#-代码风格与格式化)** - 命名约定、SwiftLint
- **[视图 (View) 设计](#-视图-view-设计)** - 视图拆分、修饰符、预览
- **[状态管理与数据流](#-状态管理与数据流)** - 属性包装器选择、单向数据流
- **[导航 (Navigation)](#-导航-navigation)** - `NavigationStack`、`sheet`、`fullScreenCover`
- **[网络请求](#-网络请求)** - `async/await`、`URLSession`
- **[错误处理](#-错误处理)** - `Result` 类型、在视图中展示错误
- **[测试 (Testing)](#-测试-testing)** - `XCTest`、视图模型测试
- **[文档注释](#-文档注释)** - 使用 `///` 进行代码文档化

---

## 🏗️ 项目结构规范

清晰的目录结构是项目可维护性的基础。推荐按功能或类型对文件进行分组。

### Xcode 项目分组
```
AppName/
├── AppNameApp.swift          # App 入口
├── Application/              # App 代理、全局配置
├── Features/                 # 按功能模块组织
│   ├── Home/                 # 首页功能
│   │   ├── Views/
│   │   ├── ViewModels/
│   │   └── Models/
│   └── Profile/              # 个人资料功能
│       ├── Views/
│       ├── ViewModels/
│       └── Models/
├── Components/               # 可复用的 SwiftUI 视图
├── Helpers/                  # 扩展、工具函数
├── Services/                 # 网络、数据存储等服务
├── Models/                   # 全局共享的数据模型
└── Assets.xcassets         # 资源文件
```

---

## 💅 代码风格与格式化

### 命名约定
遵循标准的 Swift API 设计指南：
- **类型/协议**: 驼峰命名法 (`PascalCase`)，例如 `UserProfileView`, `Decodable`。
- **变量/函数/属性**: 小驼峰命名法 (`lowerCamelCase`)，例如 `userName`, `fetchUserData()`。
- **常量**: 小驼峰命名法 (`lowerCamelCase`)，例如 `let maxRetryCount = 3`。
- **布尔值**: 命名应像断言一样，例如 `isUserLoggedIn`。

### SwiftLint
- **强制使用**: 项目应集成 [SwiftLint](https://github.com/realm/SwiftLint) 来强制执行统一的编码风格。
- **配置文件**: 在项目根目录提供一个 `.swiftlint.yml` 配置文件，以确保团队成员使用相同的规则。

---

## 🎨 视图 (View) 设计

### 视图拆分
- **单一职责**: 每个 SwiftUI 视图都应该只负责一小块 UI 的渲染和交互。
- **小视图组合**: 将复杂的视图拆分成多个更小的、可复用的子视图。
- **行数限制**: 单个视图的 `body` 属性应保持简短（建议不超过 100 行）。

```swift
// 推荐：拆分为多个小视图
struct UserProfileView: View {
    let user: User

    var body: some View {
        VStack {
            AvatarView(url: user.avatarURL)
            UserInfoView(name: user.name, email: user.email)
            SettingsLink()
        }
    }
}
```

### 修饰符 (Modifiers)
- **顺序**: 修饰符的顺序很重要。将影响布局的修饰符（如 `.frame()`, `.padding()`）放在前面，将影响外观的修饰符（如 `.background()`, `.foregroundColor()`）放在后面。
- **自定义修饰符**: 对于重复使用的修饰符组合，应创建自定义的 `ViewModifier`。

```swift
struct PrimaryButtonModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
    }
}

extension View {
    func primaryButtonStyle() -> some View {
        self.modifier(PrimaryButtonModifier())
    }
}
```

### 预览 (Previews)
- **必须提供**: 所有视图都应提供 `PreviewProvider`，以便在 Xcode Previews 中快速迭代和测试。
- **多种状态**: 为视图提供多种预览状态，如默认状态、加载中、错误状态、不同设备尺寸等。

---

## 🔄 状态管理与数据流

### 属性包装器选择
- **`@State`**: 用于管理属于**单个视图**的简单值类型（`String`, `Int`, `Bool`, `Struct`）。数据是视图私有的。
- **`@Binding`**: 用于在视图之间**双向传递**可变状态。子视图可以修改父视图拥有的 `@State` 或 `@StateObject` 中的数据。
- **`@StateObject`**: 用于在视图中**创建并持有**一个符合 `ObservableObject` 协议的引用类型（`Class`）的实例。其生命周期与视图绑定。
- **`@ObservedObject`**: 用于**观察**一个由外部传入的 `ObservableObject` 实例。视图不拥有该对象，当对象销毁时视图可能会崩溃。
- **`@EnvironmentObject`**: 用于从环境中读取一个共享的 `ObservableObject`，避免在视图层级中手动传递。

### 单向数据流
- **数据源唯一**: 遵循“单一数据源”原则。状态应由父视图或专门的状态容器（ViewModel）拥有。
- **数据向下流动**: 状态从父视图流向子视图。
- **事件向上传递**: 子视图通过闭包回调或 `@Binding` 将用户交互事件通知给父视图进行处理。

```swift
class UserViewModel: ObservableObject {
    @Published var user: User? // 数据源

    func fetchUser() { /* ... */ }
}

struct UserView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        VStack {
            if let user = viewModel.user {
                Text(user.name)
            } else {
                ProgressView()
            }
        }
        .onAppear {
            viewModel.fetchUser() // 事件触发
        }
    }
}
```

---

## 🧭 导航 (Navigation)

- **`NavigationStack`**: 用于基于路径的导航，适用于层级较深的场景。
- **`NavigationLink`**: 与 `NavigationStack` 配合使用，用于触发导航。
- **模态视图**: 
  - 使用 `.sheet()` 呈现一个非全屏的模态视图。
  - 使用 `.fullScreenCover()` 呈现一个全屏的模态视图。

---

## 🌐 网络请求

- **`async/await`**: 优先使用 Swift 5.5 引入的 `async/await` 语法来处理异步网络请求。
- **`URLSession`**: 使用原生的 `URLSession` 进行网络调用，并将其封装在专门的 `Service` 类中。
- **`Codable`**: 使用 `Codable` 协议来解析 JSON 数据。

```swift
struct User: Codable { /* ... */ }

class NetworkService {
    static let shared = NetworkService()
    private init() {}

    func fetchUser(id: String) async throws -> User {
        let url = URL(string: "https://api.example.com/users/\(id)")!
        let (data, _) = try await URLSession.shared.data(from: url)
        let user = try JSONDecoder().decode(User.self, from: data)
        return user
    }
}
```

---

## 🛡️ 错误处理

- **`Result<Success, Failure>`**: 在异步操作（如网络请求）的返回类型中，推荐使用 `Result` 来明确表示成功或失败的状态。
- **`do-catch`**: 使用 `do-catch` 语句来处理可能抛出错误的函数。
- **在视图中展示错误**: 将错误状态保存在 `@State` 变量中，并使用 `.alert()` 或自定义的错误视图来向用户展示友好的错误信息。

---

## 🧪 测试 (Testing)

- **`XCTest`**: 使用 `XCTest` 框架编写单元测试和集成测试。
- **测试 ViewModel**: 重点测试 ViewModel 中的业务逻辑、状态转换和与服务的交互。
- **Mocking**: 使用协议和依赖注入来模拟服务（如 `NetworkService`），以便在测试中隔离依赖项。

---

## ✍️ 文档注释

- **`///`**: 所有公共的（`public` 或 `internal`）类型、属性和方法都必须有文档注释。
- **参数和返回值**: 使用 `- Parameter` 和 `- Returns` 关键字来描述函数的参数和返回值。

```swift
/// Fetches user data from the remote server.
///
/// - Parameter userId: The unique identifier of the user.
/// - Returns: A `User` object.
/// - Throws: An error if the network request fails or the user is not found.
func fetchUser(userId: String) async throws -> User {
    // ...
}
```

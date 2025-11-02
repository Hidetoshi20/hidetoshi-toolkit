# 开发规范与操作指南

本文档详细说明了本仓库的开发规范、常见操作流程和版本管理约定。

## 快速使用

### 配置文件使用
```bash
# 复制配置文件到目标位置
cp clash.yaml ~/.config/clash/config.yaml

# 验证配置生效
clash -t ~/.config/clash/config.yaml
```

### 脚本使用
```bash
# 赋予执行权限
chmod +x script-name.sh

# 运行脚本（建议先测试）
./script-name.sh
```

## 目录

- [快速使用](#快速使用)
- [仓库约定](#仓库约定)
- [常见操作](#常见操作)
- [版本管理](#版本管理)
- [文档结构](#文档结构)

## 仓库约定

### 命名规范
- **文件与目录**：统一使用 `kebab-case` 命名（小写字母 + 连字符）
- **配置文件**：保持原有名称以确保工具兼容性
- **脚本文件**：使用描述性名称，包含功能说明

### 文档规范
- **原则**：短而全，力求自解释
- **结构**：重要配置文件在同目录放置简短使用说明
- **语言**：中文优先，技术术语保留英文原名

### 兼容性要求
- **系统标注**：注明脚本/配置适用的操作系统（如 macOS、Linux）
- **版本说明**：标明依赖软件的版本要求
- **测试环境**：建议先在测试环境运行涉及系统变更的脚本

## 常见操作

### 配置备份与恢复

#### 备份当前配置
```bash
# 从软件目录复制配置文件到仓库
cp ~/.config/clash/config.yaml ./clash.yaml.backup
cp ~/.zshrc ./zshrc.backup
```

#### 恢复配置到新环境
```bash
# 从仓库复制配置文件到目标目录
cp ./clash.yaml ~/.config/clash/config.yaml
cp ./zshrc ~/.zshrc
```

#### 配置文件更新
- 软件升级后如出现不兼容，请先查阅版本变更日志
- 重大版本更新前建议备份原配置
- 使用 `diff` 工具比较配置差异

### 脚本使用建议

#### 执行前检查
```bash
# 赋予执行权限
chmod +x script-name.sh

# 检查脚本语法（针对 bash 脚本）
bash -n script-name.sh

# 在测试环境运行
./script-name.sh --dry-run  # 如果支持
```

#### 生产环境使用
- 涉及系统变更的脚本，先在测试环境验证
- 阅读脚本注释，了解具体操作步骤
- 准备回滚方案，记录执行前的系统状态

### 文件管理操作

#### 目录结构维护
```bash
# 检查仓库状态
git status

# 查看文件变更
git diff

# 添加新文件
git add new-config-file.yaml
git commit -m "add: 新增 XXX 配置文件"
```

#### 配置文件同步
```bash
# 批量更新配置文件
rsync -av --progress ./configs/ ~/.config/

# 验证文件完整性
md5sum target-file.conf
```

## 版本管理

### Git 工作流程

#### 基础操作
```bash
# 查看当前状态
git status

# 添加修改到暂存区
git add .

# 提交修改
git commit -m "类型: 简短描述

详细说明修改原因、影响范围和注意事项。"

# 推送到远程仓库
git push
```

#### 提交信息规范
- **格式**：`类型: 简短描述`
- **类型**：
  - `add`: 新增文件或功能
  - `update`: 更新现有配置
  - `fix`: 修复问题或错误
  - `remove`: 删除不需要的文件
  - `docs`: 文档更新
  - `refactor`: 重构配置结构

### 分支管理策略

#### 重要修改流程
```bash
# 创建功能分支
git checkout -b feature/config-update

# 完成修改后
git checkout main
git merge feature/config-update

# 清理分支
git branch -d feature/config-update
```

#### 版本标记
```bash
# 创建版本标签
git tag -a v1.0.0 -m "版本 1.0.0: 主要功能完成"

# 推送标签
git push origin v1.0.0
```

## 文档结构

### 仓库组织
```
hidetoshi-scripts/
├── README.md                 # 仓库概述和快速开始
├── docs/                     # 详细文档目录
│   ├── development.md       # 开发规范与操作（本文档）
│   ├── frontend-vibe/       # AI 辅助开发框架
│   └── travel-plan.md       # 旅行规划文档
├── clash.yaml               # 网络代理配置
├── .idea/                   # IntelliJ IDEA 配置
└── .obsidian/               # Obsidian 知识库配置
```

### 配置文件分类

#### 网络配置
- `clash.yaml`: Clash 代理工具配置
- 包含多个地理区域的服务器端点

#### 开发工具配置
- `.gitignore`: Git 忽略文件规则
- 编辑器配置文件（IDE 配置）

#### 脚本文件
- 按功能分类的自动化脚本
- 系统维护和任务自动化工具

### 文档关系

- **README.md**：仓库总览和快速上手指南
- **DEVELOPMENT.md**：详细的开发规范和操作流程
- **docs/frontend-vibe/**：AI 辅助开发的完整方法论和模板
- **具体配置文件**：包含内联注释的使用说明

## 安全注意事项

### 敏感信息处理
- **禁止提交**：令牌、私钥、密码等敏感信息
- **推荐做法**：使用环境变量或外部私有文件
- **配置模板**：提供配置模板，敏感字段使用占位符

### 备份策略
- 定期备份重要配置文件
- 使用版本标签标记稳定状态
- 建立异地备份机制

---

**相关文档**：
- [README.md](README.md) - 仓库概述和快速开始
- [frontend-vibe](docs/frontend-vibe/) - AI 辅助开发框架
- [CLAUDE.md](CLAUDE.md) - Claude Code 使用指南
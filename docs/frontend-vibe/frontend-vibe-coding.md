# 前端 vibe coding 范式

把 AI 当成“协作式结对工程师”，而不是“自动代码生成器”。这份文档包含两部分：

1. **总体框架**：6 个阶段，定义了 vibe coding 的标准作业流程（SOP）。
2. **场景模板**：针对常见前端任务（新页面/功能增强/重构/小改/bugfix）的轻量模板，直接套用即可。

## 快速索引
- [模板速链](#模板速链) — 直接复制可用 Prompt / PR 模板
- [1. 前端 vibe coding 总体框架](#1-前端-vibe-coding-总体框架) — 标准 0→5 阶段
- [2. 场景 vibe 模板](#2-场景-vibe-模板) — A~E 场景的流程、Prompt 与 commit 策略
- [3. 落地与产品化建议](#3-落地与产品化建议) — 如何把范式固化到团队协作

## 模板速链
- 新页面 / 新路由：`docs/frontend-vibe/new-page.md`
- 既有页面加功能：`docs/frontend-vibe/feature-enhancement.md`
- 行为不变重构：`docs/frontend-vibe/refactor.md`
- 小改（文案/样式）：`docs/frontend-vibe/micro-tweak.md`
- Bug 修复：`docs/frontend-vibe/bugfix.md`
- PR 描述骨架：`docs/frontend-vibe/PR_TEMPLATE.md`
- 模板库说明：`docs/frontend-vibe/README.md`

---

## 1. 前端 vibe coding 总体框架

> 核心问题：如何让 AI 在真实上下文里进行“驱动式协作”，而不是一次性吐出 500 行“想象力代码”。

### 阶段 0 · 任务定义 / 背景收集
- **目标**：让 AI 理解“要做什么”与“为什么做”，建立单一事实源。
- **需要准备**：spec.md（或 issue/ticket）、业务背景、范围内/外、验收标准（AC）、已知风险（store/URL/schema/UI/权限/性能）。
- **常用 Prompt**
```text
请复述需求并指出不清晰的地方与潜在边界。
列出此需求的技术风险或前置依赖。
```
- **输出**：澄清过的 spec.md，后续所有讨论、patch、commit 都引用它。
- **原因**：跳过这步，AI 就会在模糊假设上瞎编，所有后续意见都不可靠。

### 阶段 1 · 任务分解 / 施工计划
- **目标**：把需求切成最小可提交单元（5-30 行 diff），形成 tasks.md。
- **需要准备**：步骤序列、每步改动的文件/模块、每步肉眼可验证的结果。
- **常用 Prompt**
```text
基于 spec.md，按最小提交单元拆任务。每步写：
1. 要改的文件（含包/模块）
2. 新增/删除的数据结构
3. 完成后我可以如何手动验收
```
- **输出**：排序好的 steps list，相当于“微 PR 计划”。
- **原因**：没有这步就会出现“一次生成 500 行 diff”的巨石改动，无法评审/回滚/灰度。

### 阶段 2 · 上下文装载 / 现状理解
- **目标**：让 AI 在真实代码库语境里提方案，而不是写教材级 React App。
- **需要准备**：相关目录结构、现有组件/slice/hook、命名风格、复用约定（如 Canonical/Ephemeral/UI Control 架构、monorepo 包边界、RTK slice 模板）。
- **常用 Prompt**
```text
以下是当前实现。请给“如何在现有架构里最小侵入地加功能”的 patch plan。
禁止引入新的状态管理方式或重复的 utils。若必须新增，请说明现有抽象为何不够。
```
- **输出**：patch plan（接近 PR 描述草稿），细到“在哪个文件插入哪个字段 / 哪里加 action”。
- **原因**：这一步把 vibe coding 与“纯生成式 AI”拉开差距，让你指导 AI 复用而非重写。

### 阶段 3 · 生成候选 Patch / Diff
- **目标**：AI 产出最小 diff 粒度的候选 patch，并解释副作用。
- **需要准备**：针对 steps 的输入上下文、需要修改的具体文件。
- **常用 Prompt**
```text
基于步骤 X，请给以下文件的最小 diff（unified diff 风格）。保持现有代码风格，禁止编造未展示的辅助函数。
若需要依赖未展示代码，直接声明“需要现有 useFetch hook”，不要自创。
```
- **输出**：候选 patch + AI 的变更说明。你手动粘贴并验证引用的符号是否真实存在。
- **原因**：人工把握“apply patch”的节奏，确保每一步小而可控，diff 可审计。

### 阶段 4 · 自测 / 回归验证
- **目标**：把 AI 当 QA / reviewer，提前生成验收清单与回归点。
- **需要准备**：功能路径、回归面、边界条件（空数据 / 网络错误 / 慢请求 / 权限不足）。
- **常用 Prompt**
```text
假设 patch 已应用，请列出手测路径（按步骤写清楚）。
再列出最可能受影响的旧功能，按风险从高到低排序。
```
- **输出**：手测计划，可直接放进 PR 描述；QA 和 Reviewer 都能复用。

### 阶段 5 · Commit / PR 整理
- **目标**：让提交与 tasks.md 的 step 对齐，PR 可读、易回滚。
- **需要准备**：每步 diff、命名好的 commit message、PR 描述（title/summary/test plan/risk&rollout）。
- **常用 Prompt**
```text
基于当前 patch 和验收点，请生成：
1. PR title + summary + test plan + risk & rollout
2. commit 拆分建议，使用 feat/fix/refactor/test/chore 等语义
```
- **输出**：可直接复制的 PR 文案 + commit 列表。
- **原因**：提交历史成为“任务分解的复盘”，方便 blame、回滚、灰度与审计。

---

## 2. 场景 vibe 模板

> 使用方法：进入具体场景 → 依次套用“适用时机 / 阶段速查 / Prompt 片段 / Commit 策略”。所有模板都默认遵循 0→5 阶段，只是粒度不同。

### 模板共通要求
- 任何场景都：先写 mini spec → 让 AI 拆 steps → 贴上下文 → 要求最小 patch。
- 每个 step 完结后才进入下一步 patch，形成 tight loop。
- 测试清单、PR 描述、commit message 交给 AI 初稿，你只需校对与补充事实。

---

### 场景 A · 实现新页面（新路由 / 新视图）
- **适用时机**：新增 `/settings`、`/user-report`、新 Dashboard 等独立路由。

**阶段速查**
- `0 定义`：spec.md 写页面目标、数据来源、交互流程、设计约束。
- `1 分解`：Step 1 shell、Step 2 数据、Step 3 渲染、Step 4 交互、Step 5 QA 状态、Step 6 文案/i18n。
- `2 上下文`：贴 layout / router 注册方式 / 全局状态约定，请 AI 给 patch plan。
- `3 Patch`：逐步生成 diff（先壳后逻辑），禁止一次写完所有逻辑。
- `4 自测`：导航可达、404 保持、Sidebar 选中态、loading/error。
- `5 Commit`：按 step 切 commit，例如 `feat(page-settings): add SettingsPage shell`。

**Prompt 片段**
```text
请把以下描述整理成页面级 spec.md，包含字段列表、交互流程、验收标准（面向最终用户）。
---
请按最小 commit 粒度拆步骤，写清每步要动的文件和可验证的结果。
---
只生成 Step 1 的最小 diff：新增页面壳组件 + 路由注册，不含真实业务逻辑，不引入新的全局状态。
```

**Commit 策略示例**
- `feat(page-settings): add SettingsPage shell and route`
- `feat(page-settings): wire data fetch via useSettingsQuery`
- `feat(page-settings): add edit modal interaction`
- `chore(i18n): add settings strings`

---

### 场景 B · 既有页面加新功能
- **适用时机**：现有页面增入口（导出按钮、批量删除、额外筛选）。
- **关键词**：增量、可控、复用既有逻辑。

**阶段速查**
- `0 定义`：轻量 spec，强调新入口、触发流程、权限、URL/状态/接口影响。
- `1 分解`：Step 1 UI 入口、Step 2 调用逻辑、Step 3 反馈、Step 4 edge cases。
- `2 上下文`：贴目标页面、store/hook/service、Toast/Modal 封装，要求 AI 说明新增按钮插入点和副作用触发层。
- `3 Patch`：逐步生成（按钮 → 逻辑 → 反馈），保持 diff 小。
- `4 自测`：老入口回归、布局不被遮挡、权限视图正确。
- `5 Commit`：UI/逻辑/反馈/测试分开，例如 `feat(report-export): add Export PDF button`。

**Prompt 片段**
```text
把以下描述结构化为功能增强 spec.md，突出新增交互入口、调用流程、接口契约、肉眼可见的验收标准。
---
请拆步骤，并标注每步会修改的现有文件，禁止大面积重写。
---
基于现有代码，给最小 patch 计划：按钮插入位置、副作用触发层、需要复用的封装。
```

**Commit 策略示例**
- `feat(report-export): add Export PDF button (UI only)`
- `feat(report-export): hook export click to exportReport thunk`
- `fix(report-export): handle export error toast`
- `test(report-export): document manual test plan`

---

### 场景 C · 重构（行为不变）
- **适用时机**：拆分 800 行组件、提取 hook/slice、性能/可维护性优化。
- **目标**：行为锁定，逐步迁移。

**阶段速查**
- `0 定义`：refactor spec 里写动机、必须保持的行为、允许顺手修复的瑕疵、明确范围外内容。
- `1 分解`：遵循“提取 → 替换 → 清理”。每步后应用可运行。
- `2 上下文`：贴原文件，请 AI 指出可抽的逻辑块、可拆的 UI、需要谨慎的副作用。
- `3 Patch`：先抽 hook/util（旧组件立即引用），再拆 UI，再清理冗余。
- `4 自测`：行为不变清单、边界输入、性能观察点（渲染次数、依赖数组）。
- `5 Commit`：用 `refactor:` / `chore:` / `test:`，方便 blame 与回滚。

**Prompt 片段**
```text
请把以下重构目标写成 refactor spec，列出“行为必须不变”的清单（bullet）。
---
按“提取 → 替换 → 清理”拆 steps，保证每一步结束后应用仍可运行。
---
分析下列代码：1) 哪些逻辑可抽到 useXxx()/utils？2) 哪些 UI 子块可拆组件？3) 哪些副作用需要小心移动？
```

**Commit 策略示例**
- `refactor(table-editor): extract selection logic into useRowSelection`
- `refactor(table-editor): split Toolbar actions into ToolbarActions.tsx`
- `chore(table-editor): remove dead code`
- `test(table-editor): add regression checklist`

---

### 场景 D · 小改（微调 UI/文案/样式）
- **适用时机**：文案、对齐方式、按钮位置、轻量样式调整。
- **目标**：最小 diff、快速验证、不误伤全局样式或 i18n。

**阶段速查**
- `0 定义`：三行变更摘要 + 是否涉及 i18n/a11y/交互/布局。
- `1 分解`：通常 1 step，但让 AI 枚举风险点（global.css/theme token/layout grid）。
- `2 上下文`：贴组件/CSS module/styled component/theme token。
- `3 Patch`：单个最小 diff（≤30 行），禁止发明新类名体系。
- `4 自测`：多个分辨率、暗黑/高对比、i18n key。
- `5 Commit`：`chore`/`style`/`fix`，若行为改变则用 `feat`。

**Prompt 片段**
```text
请总结以下需求为变更摘要，并写 3 条从用户角度出发的验收标准。
---
这个改动可能影响哪些全局样式/公共组件？我需要规避什么风险？
---
基于现有代码给最小 patch，复用当前 token/variant，禁止新增类名体系。
```

**Commit 策略示例**
- `chore(ui): update CTA button label to '保存并继续'`
- `style(header): align action buttons to the left`

---

### 场景 E · Bug 修复
- **适用时机**：线上异常、崩溃、边界缺陷。
- **核心流程**：复现 → 定位 → 最小修复 → 回归验证。

**阶段速查**
- `0 定义`：bug.md 写复现步骤（URL/环境/浏览器）、预期 vs 实际、日志栈、影响范围。
- `1 分解`：Step 1 复现并锁定根因，Step 2 最小修复 + 回归点。
- `2 上下文`：贴相关组件/逻辑，尤其报错栈涉及的函数。
- `3 Patch`：要求防御式代码（null check/guard clause），只做最小修复，不顺手重构。
- `4 自测`：复现路径、主流程、极端输入（null/empty/timeout）。
- `5 Commit`：单 commit 一般即可，PR 描述包含 Root cause / Fix / Test plan。

**Prompt 片段**
```text
整理以下信息成 bug report：复现步骤（编号）、预期 vs 实际（并列）、影响范围、假设根因。
---
根据 bug report 与代码，指出最可能的根因（在哪段逻辑、什么条件），并给出最小修复策略，解释副作用控制。
---
标出在边界值下会出问题的行，并给出保持风格的一份 diff 级修复 patch。
```

**Commit 策略示例**
- `fix(report-export): handle undefined fileName from API response`
- PR 描述模板：Root cause / Fix explanation / Test plan（含复现步骤与回归点）

---

## 3. 落地与产品化建议

1. **任务一律起草 mini spec**  
   - 新页面/大功能 → `spec.md`  
   - Bug → `bug.md`  
   - 重构 → `refactor-spec.md`  
   - 小改 → 三行“变更摘要”

2. **让 AI 产出 `tasks.md`**  
   - 每个 step ≈ 一个 commit  
   - 避免巨石 PR，自然形成可回滚的颗粒度

3. **Patch 永远按 step 逐次生成**  
   - 先要 patch plan，再要最小 diff  
   - 人工粘贴、人工校对引用符号

4. **PR 描述交给 AI 初稿**  
   - 包含 summary / test plan / risk & rollout  
   - QA 直接按 test plan 点回归，Reviewer 秒懂

5. **模板库即开即用**  
   - 常用 Prompt 已拆进 `docs/frontend-vibe/`（详见 [模板速链](#模板速链)）  
   - `docs/frontend-vibe/PR_TEMPLATE.md` 可直接复制到 GitHub/GitLab PR 描述  
   - 若要内置更多上下文（如 Canonical/Ephemeral/UI Control 约束），在对应模板中补充即可，方便团队共用

你随时可以把 monorepo（gel-ui / gel-util / ai-chat / report-print …）的上下文喂给 AI，按上述模板生成定制 SOP，实现“团队可复制的 vibe coding”。

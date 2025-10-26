# 前端 vibe coding 范式

把 AI 当成“协作式结对工程师”，而不是“自动代码生成器”。这份文档包含两部分：

1. **总体框架**：6 个阶段，定义了 vibe coding 的标准作业流程（SOP）。
2. **场景模板**：针对常见前端任务（新页面/功能增强/重构/小改/bugfix）的轻量模板，直接套用即可。

## 快速索引

- [模板速链](#模板速链) — 直接复制可用 Prompt / PR 模板
- [设计文档与过程文档](#设计文档与过程文档) — 单一事实源 vs 每次任务的过程序列
- [1. 前端 vibe coding 总体框架](#1-前端-vibe-coding-总体框架) — 标准 0→5 阶段
- [3. 落地与产品化建议](#3-落地与产品化建议) — 如何把范式固化到团队协作

## 模板速链

- 新页面 / 新路由：`docs/frontend-vibe/new-page.md`
- 既有页面加功能：`docs/frontend-vibe/feature-enhancement.md`
- 行为不变重构：`docs/frontend-vibe/refactor.md`
- 小改（文案/样式）：`docs/frontend-vibe/micro-tweak.md`
- Bug 修复：`docs/frontend-vibe/bugfix.md`
- 文档修改/优化/编写：`docs/frontend-vibe/documentation.md`
- PR 描述骨架：`docs/frontend-vibe/PR_TEMPLATE.md`
- 模板库说明：`docs/frontend-vibe/README.md`

## 设计文档与过程文档

- **设计文档（design.md / architecture.md）= 长期事实源**：记录系统边界、模块职责、关键决策与约束，任何影响架构/数据契约/依赖关系的改动都必须在此同步，保持“读文档 = 了解真实实现”。
- **spec.md / tasks.md / bug.md = 过程序列**：每次任务/迭代创建一次，用于澄清需求与拆解步骤，完成后可以归档；若信息已被吸收进设计文档，可选择性删除或附在 PR 中。
- **每个阶段都要问一句：这次改动需要更新设计文档吗？** 若答案为是，请在 tasks.md 中加入显式的“更新 design doc 第 X 章”步骤，并在 PR/Test Plan 里标记完成情况。
- **设计文档应保持简洁**：描述现状与决策，不复制 spec；引用最新代码路径/接口，方便 Reviewer 与新人追溯。必要时附上“Last reviewed at <日期>”。

---

## 1. 前端 vibe coding 总体框架

> 核心问题：如何让 AI 在真实上下文里进行“驱动式协作”，而不是一次性吐出 500 行“想象力代码”。

### 阶段 0 · 任务定义 / 背景收集

- **目标**：让 AI 理解“要做什么”与“为什么做”，建立单一事实源。
- **需要准备**：spec.md（或 issue/ticket）、业务背景、范围内/外、验收标准（AC）、已知风险（store/URL/schema/UI/权限/性能）、最新设计文档链接及本次可能影响的章节。
- **常用 Prompt**

```text
请复述需求并指出不清晰的地方与潜在边界。
列出此需求的技术风险或前置依赖。
```

- **输出**：澄清过的 spec.md（一次任务一次）、需要更新或新增的设计文档章节列表，后续所有讨论、patch、commit 都引用 spec.md 并同步回设计文档。
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
- **额外要求**：若某步需要更新设计文档，请显式写入 steps，并说明修改的章节/标题。
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

- **输出**：手测计划（含功能/回归/边界），可直接放进 PR 描述；若本次改动触及架构/数据契约，请附上“设计文档同步完成”检查项。QA 和 Reviewer 都能复用。

### 阶段 5 · Commit / PR 整理

- **目标**：让提交与 tasks.md 的 step 对齐，PR 可读、易回滚。
- **需要准备**：每步 diff、命名好的 commit message、PR 描述（title/summary/test plan/risk&rollout）、设计文档的变更说明（包括未改动时的确认结论）。
- **常用 Prompt**

```text
基于当前 patch 和验收点，请生成：
1. PR title + summary + test plan + risk & rollout
2. commit 拆分建议，使用 feat/fix/refactor/test/chore 等语义
```

- **输出**：可直接复制的 PR 文案 + commit 列表，并确保其中包含 design doc 更新（若适用）或“无需更新”的确认语句，方便 reviewer 自查。
- **原因**：提交历史成为“任务分解的复盘”，方便 blame、回滚、灰度与审计。

---

## 3. 落地与产品化建议

1. **任务一律起草 mini spec**

   - 新页面/大功能 → `spec.md`
   - Bug → `bug.md`
   - 重构 → `refactor-spec.md`
   - 小改 → 三行“变更摘要”

2. **设计文档 = 事实源**

   - 设计文档位于 `docs/design/`（或自定义路径），描述架构/数据/约束。
   - 每次任务评估是否需要更新：若涉及 API、状态流、依赖变更，必须写入或修改对应章节。
   - 若无需更改，也要在 PR/Test Plan 中注明“design doc 无需更新”方便追溯。

3. **让 AI 产出 `tasks.md`**

   - 每个 step ≈ 一个 commit
   - 避免巨石 PR，自然形成可回滚的颗粒度

4. **Patch 永远按 step 逐次生成**

   - 先要 patch plan，再要最小 diff
   - 人工粘贴、人工校对引用符号

5. **PR 描述交给 AI 初稿**

   - 包含 summary / test plan / risk & rollout
   - QA 直接按 test plan 点回归，Reviewer 秒懂

6. **模板库即开即用**
   - 常用 Prompt 已拆进 `docs/frontend-vibe/`（详见 [模板速链](#模板速链)）
   - `docs/frontend-vibe/PR_TEMPLATE.md` 可直接复制到 GitHub/GitLab PR 描述
   - 若要内置更多上下文（如 Canonical/Ephemeral/UI Control 约束），在对应模板中补充即可，方便团队共用

你随时可以把 monorepo（gel-ui / gel-util / ai-chat / report-print …）的上下文喂给 AI，按上述模板生成定制 SOP，实现“团队可复制的 vibe coding”。

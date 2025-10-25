# vibe coding prompt 库

将 `docs/frontend-vibe/frontend-vibe-coding.md` 的范式拆成可直接复制的提示语和文档模板：

| 文件 | 适用场景 |
| --- | --- |
| `new-page.md` | 新页面 / 新路由 |
| `feature-enhancement.md` | 现有页面增加功能 |
| `refactor.md` | 行为不变重构 |
| `micro-tweak.md` | 文案 / 样式等小改 |
| `bugfix.md` | bug report + 最小修复 |
| `PR_TEMPLATE.md` | PR 描述骨架（配合任何场景） |

## 使用姿势
1. 复制对应文件中的 Prompt block，根据 `<>` 占位符填入上下文。
2. 与 AI 循环互动：阶段 Prompt → 落地 diff → 再进入下一阶段。
3. 完成后使用 `PR_TEMPLATE.md` 补充 summary / test plan / 风险。

## 小贴士
- Prompt 里保留了阶段编号，方便对照总体 SOP。
- 若需要更多模板（例如 QA checklist、spec.md 骨架），直接按相同格式增补即可。

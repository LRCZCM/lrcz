---
name: branch-policy
description: 未经用户明确允许不得创建分支；所有改动、提交、推送都在 main 上
metadata:
  type: feedback
---

未经用户明确允许，不得创建或切换到新分支（含 `git checkout -b`、`git switch -c`、worktree）。所有代码改动都在 `main` 上进行，提交提交到 `main`，推送推送到 `main`；只有用户明确说“创建一个分支”时才建。

**Why:** 用户 2026-11-11 明确要求，并让写进项目规则（AGENTS 工作边界）。

**How to apply:** 用户让提交推送时，直接在 `main` 上提交并推送，不另建分支；工具默认规则要求先建分支时，以此条用户规则为准。相关：[[no-worktree]]。

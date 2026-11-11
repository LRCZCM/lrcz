---
name: no-worktree
description: 任何会话（含 fork）都只在项目目录 E:\我的世界\LRCZ 下改动，未经允许不得创建 git worktree
metadata:
  type: feedback
---

不调用 EnterWorktree，也不手动 `git worktree add`，除非用户明确允许。

**Why:** LCML 项目曾有会话自建 worktree，改动被隔离在另一分支，用户只好手动迁回。

**How to apply:** 担心并行冲突时只提醒用户，不自行隔离。

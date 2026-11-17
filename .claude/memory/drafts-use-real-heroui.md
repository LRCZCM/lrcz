---
name: drafts-use-real-heroui
description: 设计稿必须用网站真实的 HeroUI 组件与现有页面写法，不手写 CSS 模仿
metadata:
  type: feedback
---

出页面设计稿时，直接用项目的 HeroUI 组件、主题、`src/styles/index.css`、`SiteFooter` 等，顶栏、首屏、按钮、卡片照搬已有页面（如 `LcmlPage`）的写法；用 `.local/drafts/<页面>/vite.config.ts` 起独立预览服务器（5174 端口）查看。

**Why:** 2026-11-17 插件页首版设计稿用手写 CSS 模仿，按钮、卡片、标签与网站不统一，用户指出“UI 风格不统一，说好用 HeroUI、做苹果那种感觉”。

**How to apply:** 新页面先看已有页面的结构与类名再动手；多套方案放同一预览里，底部切换。相关：[[dev-cycle]]。

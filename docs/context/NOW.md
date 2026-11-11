# 当前状态

本文件只写现状。新进展先写进“近期记录”，由用户定期手动触发整理：并入“进度”总结，原文移入 `docs/archive/NOW-<日期>.md`。提交及远程同步状态以 Git 为准。

## 进度

- 项目已初始化（2026-11-11）：Vite + React + TypeScript 骨架，接入 HeroUI v3、Tailwind CSS v4、Lucide、Motion，配置 oxlint、Prettier 与 `@/` 路径别名；首页为验证依赖接通的占位页。
- 协作文档已按 LCML 规范建立，见 [AGENTS](../../AGENTS.md#资料位置)。
- 本地 Git 仓库已初始化，尚未配置远程仓库。

## 待人工验证

- `npm run dev` 打开首页，确认 HeroUI 按钮样式、Lucide 图标与入场动效正常显示。

## 待定事项

- 产品用途与首个里程碑。
- 远程仓库地址。
- 路由（建议 React Router）、全局状态管理（建议先用 React 自带，复杂后再定）、请求方式（建议 `fetch` 封装在 `src/api/`，需要缓存时再考虑 TanStack Query）。
- 国际化：是否需要多语言。
- 主题定制（品牌色、字体）与深色模式切换方式。
- 测试框架（建议首次需要时引入 Vitest）。
- 部署方式。

## 近期记录

1. 2026-11-11 项目初始化：脚手架、依赖、规范文档、本地 Git。验证：`npm run check` 通过（类型检查、oxlint、Prettier、构建）；浏览器中的显示效果未验证。

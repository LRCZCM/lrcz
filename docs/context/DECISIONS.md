# 已确认决策

## 纯前端项目

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：本仓库只做前端，不做后端；需要的接口由外部提供。
- 来源：用户初始化项目时明确提出。

## 技术栈

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：React + Vite + TypeScript，组件库 HeroUI（v3），样式 Tailwind CSS（v4，HeroUI v3 的要求），图标 Lucide，动效库 Motion。依赖用途见 [开发规范的依赖](DEVELOPMENT.md#依赖)。
- 理由：HeroUI、Tailwind、Lucide 与动效库由用户指定；TypeScript 用于在编译期发现错误、便于长期维护。动效库选 Motion（原 Framer Motion），因其是 React 生态最常用的动效库，覆盖入场、退场、布局过渡与手势。
- 来源：用户初始化项目时指定组件库、样式、图标与“加一些动效库”；TypeScript 与 Motion 的具体选择为初始化时的建议，用户如有异议可替换。

## 代码检查与格式化

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：沿用 Vite 模板自带的 oxlint 做代码检查，Prettier（含 Tailwind 类名排序插件）做格式化；`npm run check` 为提交前完整检查。
- 理由：oxlint 速度快、零配置可用；Prettier 统一格式，避免 diff 中混入格式改动。
- 来源：项目初始化时按“前端项目要规范、可持续开发”的要求确定。

## 文档结构

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：参照 LCML 项目，共享文档为 `AGENTS.md`、`README.md` 及 `docs/context/` 下的 `WORKFLOW.md`、`DEVELOPMENT.md`、`DESIGN.md`、`DECISIONS.md`、`NOW.md`，另有 Git 忽略的本机环境记录 `.local/ENVIRONMENT.md`；每类事实只维护一处，职责见 [AGENTS](../../AGENTS.md#资料位置)。
- 来源：用户要求参考 LCML 的开发规范初始化。

## 版本管理

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：使用 Git 管理，默认分支 `main`；远程仓库地址待用户提供。
- 来源：用户初始化项目时要求。

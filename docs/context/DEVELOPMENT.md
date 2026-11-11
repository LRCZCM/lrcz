# 开发规范与目录职责

## 适用原则

新增或修改代码前按当前任务定位本文件对应章节。目标是高内聚、低耦合、适度拆分：功能相关代码就近组织，不为形式创建空组件、空目录或多层转发。协作与上下文读写规则见 [AGENTS](../../AGENTS.md)，写多少、怎么写见 [WORKFLOW](WORKFLOW.md)。

## 项目边界

- 纯前端单页应用，不在本仓库写后端服务、数据库或服务端渲染。需要对接的接口由外部提供，接口地址等配置走 `VITE_` 前缀的环境变量（`.env.example` 在首次需要时建立）。
- 构建产物在 `dist/`，不提交。

## 目录职责

下表中“已建立”的目录已有代码；“首次需要时建立”的目录不提前创建空目录。

| 目录              | 放入内容                                                                                               | 边界                                                   | 状态   |
| ----------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------ |
| `src/main.tsx`    | 挂载根组件、引入全局样式                                                                               | 不放业务逻辑                                           | 已建立 |
| `src/app/`        | 根组件 `App`（全局 Provider 与路由表）、站点信息常量 `site.ts`（品牌名、作者、邮箱、备案号）、错误边界 | 不放具体页面内容                                       | 已建立 |
| `src/pages/`      | 页面组件，一页一个文件 `XxxPage.tsx`；页面变复杂时改为目录 `xxx/`，页面专用子组件与函数放在其中        | 页面之间不互相引用                                     | 已建立 |
| `src/components/` | 跨两个及以上页面复用的组件，按功能命名（如页脚 `SiteFooter`）                                          | 不放只有一处使用的组件                                 | 已建立 |
| `src/assets/`     | 两个及以上页面共用的图片（如 LCML 图标）                                                               | 只有一处使用的图片放在该页面目录旁                     | 已建立 |
| `src/styles/`     | 全局样式入口 `index.css`（引入 Tailwind 与 HeroUI）、主题变量覆盖                                      | 组件样式写在组件的 Tailwind 类名里，不在这里堆页面样式 | 已建立 |
| `src/api/`        | 请求外部接口的函数与响应类型，一个后端资源一个文件                                                     | 不放界面状态                                           | 待定   |
| `public/`         | 原样拷贝的静态文件（favicon 等）                                                                       | 需要打包处理的图片放到引用它的页面或组件旁边           | 已建立 |

LCML 产品页在 `src/pages/lcml/`：`LcmlPage` 为页面骨架，`DemoSection` 与 `demo/` 为启动器复原动画（`state.ts` 界面状态、`chapters.ts` 各章脚本、其余为各页面视图），`useChangelog.ts` 读取并解析更新日志，素材放在 `assets/`；`release.ts` 是发布仓库的地址、经代理下载安装包的地址与读取文件（GitHub 与 ghfast 代理同时请求、用先返回的，都失败再走 jsDelivr）。使用手册 `/lcml/manual` 在 `manual/`：`ManualPage` 为页面骨架，`manual.ts` 读取、解析手册（目录、标题锚点、搜索小节、链接转换），`Markdown.tsx` 把 marked 的解析结果渲染成界面，其余为首页、导航、目录、搜索组件。

路由用 React Router 的 `BrowserRouter`，路由表写在 `src/app/App.tsx`，一个产品一个路由（如 `/lcml`），未知路径回到首页。全局状态管理、请求库、国际化尚未选型，见 [NOW 的待定事项](NOW.md#待定事项)。

## 命名与写法

- 语言：TypeScript 严格模式；不用 `any`，外部数据在读入处收窄类型。
- 文件名：组件与页面用 `PascalCase.tsx`，与导出名相同；Hook 用 `useXxx.ts`；其他模块用 `camelCase.ts`。
- 导出：一律具名导出（`export function HomePage`），不用默认导出，便于搜索与重构。
- 组件写成函数组件；props 类型就近声明为 `type XxxProps`，不单独建类型文件，出现跨文件复用时再移出。
- 引入路径：跨目录用 `@/` 别名（指向 `src/`），同目录用相对路径。
- 格式由 Prettier 统一（无分号、单引号、行宽 100、Tailwind 类名自动排序），缩进 2 空格，源码与文档统一 UTF-8、LF 换行。不手动调整格式，提交前 `npm run check` 会检查。

## 组件与样式

- 界面控件优先用 HeroUI v3 组件（`@heroui/react`），外观通过 HeroUI 的 `variant`、`size` 等属性与主题变量调整；HeroUI 已有的组件不另写同类实现。HeroUI 没有的组件按 HeroUI 风格用 Tailwind 自做。
- 样式用 Tailwind 类名写在组件上；颜色用 HeroUI 主题语义类（如 `bg-background`、`text-foreground`），不写死十六进制颜色，保证深色模式可用。例外：复原其他软件界面的演示（如 `src/pages/lcml/demo/`）照搬该软件的配色，颜色集中写成 CSS 变量（`demo/tokens.ts`），组件里用 `bg-(--lm-panel)` 这类写法引用。
- 图标统一用 `lucide-react`，尺寸用 Tailwind `size-*` 类。
- 动效：组件自带的交互动效用 HeroUI 的；页面级入场、列表增删、布局过渡用 Motion（`import { motion } from 'motion/react'`）。动效写组件时一次做好，并遵守系统“减少动效”设置。具体时长与曲线见 [DESIGN](DESIGN.md)。

## 依赖

- 新增依赖须说明用途并经用户同意，写入本节或 [DECISIONS](DECISIONS.md)。
- 不为几行代码加依赖；同一用途只保留一个库。
- 版本由 `package-lock.json` 锁定，安装用 `npm install`（CI 中用 `npm ci`）。

当前依赖用途：

| 依赖                                         | 用途                          |
| -------------------------------------------- | ----------------------------- |
| `react`、`react-dom`                         | 界面框架                      |
| `@heroui/react`、`@heroui/styles`            | 组件库与其样式、主题          |
| `lucide-react`                               | 图标                          |
| `motion`                                     | 动效                          |
| `react-router`                               | 页面路由                      |
| `marked`                                     | 解析 LCML 使用手册的 Markdown |
| `tailwindcss`、`@tailwindcss/vite`           | 样式与其 Vite 插件            |
| `vite`、`@vitejs/plugin-react`、`typescript` | 构建与类型检查                |
| `oxlint`                                     | 代码检查                      |
| `prettier`、`prettier-plugin-tailwindcss`    | 格式化与 Tailwind 类名排序    |

## 测试范围

建议（待定）：只为核心逻辑写自动化测试，例如数据转换、计算、校验规则等出错时界面上不易察觉的部分；界面与简单功能交由人工测试。测试框架在首次需要时选型（建议 Vitest，与 Vite 共用配置），测试文件与被测文件同目录，命名 `xxx.test.ts`。

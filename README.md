# LRCZ

纯前端项目，不含后端服务。产品用途：待定（见 [NOW 的待定事项](docs/context/NOW.md#待定事项)）。

协作规则见 [AGENTS](AGENTS.md)。

## 技术栈

| 用途              | 选用                                           |
| ----------------- | ---------------------------------------------- |
| 框架              | React 19 + TypeScript                          |
| 构建              | Vite                                           |
| 组件库            | HeroUI v3（`@heroui/react`、`@heroui/styles`） |
| 样式              | Tailwind CSS v4（`@tailwindcss/vite`）         |
| 图标              | Lucide（`lucide-react`）                       |
| 动效              | Motion（`motion`，从 `motion/react` 引入）     |
| 代码检查 / 格式化 | oxlint / Prettier（含 Tailwind 类名排序插件）  |

版本以 `package.json` 与 `package-lock.json` 为准。

## 环境要求

- Node.js 24 及以上（npm 随附）。

## 命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器
npm run build        # 类型检查并构建到 dist/
npm run preview      # 本地预览构建产物
npm run typecheck    # 只做类型检查
npm run lint         # oxlint 检查
npm run format       # Prettier 格式化全部文件
npm run check        # 提交前完整检查：类型 + lint + 格式 + 构建
```

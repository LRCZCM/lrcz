# LRCZ

来日创造（LRCZ）的官网。纯前端项目，不含后端服务。

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
| Markdown 解析     | marked（使用手册）                             |
| 代码检查 / 格式化 | oxlint / Prettier（含 Tailwind 类名排序插件）  |

版本以 `package.json` 与 `package-lock.json` 为准。

## 环境要求

- Node.js 24 及以上（npm 随附）。

## 命令

```bash
npm install          # 安装依赖
npm run dev          # 启动开发服务器（http://127.0.0.1:5173）
npm run build        # 类型检查并构建到 dist/（会从 GitHub 下载 LCML 使用手册与插件信息）
npm run preview      # 本地预览构建产物
npm run typecheck    # 只做类型检查
npm run lint         # oxlint 检查
npm run format       # Prettier 格式化全部文件
npm run check        # 提交前完整检查：类型 + lint + 格式 + 构建
```

`npm run dev` 与构建都需要能访问 GitHub：会下载 LCML 使用手册，以及插件仓库 LcPlugins 的手册、配图与插件信息。LcPlugins 是私有仓库，需要能读取它的 GitHub 只读令牌：在根目录 `.env`（Git 已忽略）写一行 `GITHUB_TOKEN=令牌`，或设置同名环境变量；以后 LCML 手册放进私有仓库也用这个令牌。服务器上由 Jenkins 自动构建部署，流程与换服务器步骤见 [DEPLOY](docs/context/DEPLOY.md)。

# 当前状态

本文件只写现状。新进展先写进“近期记录”，由用户定期手动触发整理：并入“进度”总结，原文移入 `docs/archive/NOW-<日期>.md`。提交及远程同步状态以 Git 为准。

## 进度

- 项目已初始化（2026-11-11）：Vite + React + TypeScript 骨架，接入 HeroUI v3、Tailwind CSS v4、Lucide、Motion，配置 oxlint、Prettier 与 `@/` 路径别名；协作文档按 LCML 规范建立，见 [AGENTS](../../AGENTS.md#资料位置)。Git 远程仓库为 `https://github.com/LRCZCM/lrcz.git`（`main` 分支）。
- 主页已按设计稿方案 A 完成，用户已验收：标志加“来日创造”、LRCZ、邮箱按钮、“产品”下拉按钮（LCML、插件），页脚版权、邮箱与 ICP 备案号；颜色模式跟随系统，适配手机；所有页面滚到底先停在页脚上方。设计稿原文在 `.local/drafts/`。
- LCML 产品页 `/lcml` 已按设计稿方案 A 完成，用户已验收：首屏与下载按钮（GitHub 直接下载与 gh-proxy 国内加速）、启动器界面复原动画（七章）、功能卡片、更新日志（打开页面时读取 LCML-release 的 CHANGELOG.md）、下载与反馈入口。
- LCML 使用手册 `/lcml/manual` 已完成（待用户验收）：构建时从 LCML-release 的 `docs/manual/` 下载、随网站发布；左侧分组导航、右侧本页目录、全文搜索、手机端抽屉、截图看大图。手册组件在 `src/components/manual/`，与插件手册共用。
- 插件页已完成，用户已实测：列表 `/plugins`（设计稿 C，分类、搜索、版本标签），详情即插件使用手册 `/plugins/<插件>`（与 LCML 手册同一套组件），顶栏“下载”直接下载 Jenkins 最新成功构建的 jar，标签后“历史版本”链到 Jenkins 构建列表。插件信息与手册在构建时从私有仓库 LcPlugins 读取（令牌 `GITHUB_TOKEN`）；版本号与下载地址打开页面时经本站 `/api/plugins/<插件名>.json` 动态读取，插件更新后不必重新部署网站。图标：插件板块“补齐”、LcInputLib“手势轨迹”、工具皮带“橙色像素皮带”。
- 部署在自有国内服务器（1Panel + OpenResty）：本机构建、手动上传 `dist/`；伪静态含 SPA 回退、手册目录 404 与 `/api/plugins/` 只读转发，见 [DECISIONS 的部署](DECISIONS.md#部署)。插件由同一服务器上的 Jenkins 自动构建分发，见 [DECISIONS 的插件分发](DECISIONS.md#插件分发jenkins)。整理前的逐条记录见 [NOW-2026-11-18](../archive/NOW-2026-11-18.md)。

## 待人工验证

- LCML 使用手册：真机手机（360–390px）上的排版与抽屉；Safari 中从别的章节点带 `#小节` 的链接后，截图加载完落点是否还准（Safari 不支持滚动锚定，自动化只测了 Edge）。
- 插件页真机手机宽度：顶栏下载按钮不被挤掉、标签行正常换行（无界面截图在窄宽度下失真，未能自动检查）。
- 滚轮停在页脚上方：真实触控板惯性下的手感，Firefox、Safari 与 Mac 上的效果。

## 待定事项

- 更新日志的读取方式：现为打开页面时同时从 GitHub 与 gh-proxy 代理读取（都失败提示重试）；备选为打包网站时读取一次写进页面（国内打开更快、不依赖访客网络，但 LCML 每次发版后要重新部署网站），待用户定。
- 加速下载的版本号取自更新日志：若 CHANGELOG 已写新版本而发行版尚未发布，两个下载按钮都会指向不存在的文件，发版顺序需注意（建议先发布再更新 CHANGELOG）。
- JS 包约 980KB，超过构建的 500KB 提示线；建议把 `/lcml`、手册与插件页改为按需加载，待用户定。
- 使用手册的分组：LCML 的 README 目录现为平铺列表，网页用代码里的默认分组；建议在 README 目录中用 `### 分组名` 写明，以后只改 README。待用户定。
- 全局状态管理（建议先用 React 自带，复杂后再定）、请求方式（建议 `fetch` 封装在 `src/api/`，需要缓存时再考虑 TanStack Query）。
- 国际化：是否需要多语言。
- 主题定制（品牌色、字体）与深色模式切换方式。
- 测试框架（建议首次需要时引入 Vitest）。
- 网站自动部署：建议以后由 Jenkins 构建并发布网站；目前服务器 HTTPS 连不上 GitHub，构建时下载手册的方式需先改，暂缓。

## 近期记录

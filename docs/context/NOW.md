# 当前状态

本文件只写现状。新进展先写进“近期记录”，由用户定期手动触发整理：并入“进度”总结，原文移入 `docs/archive/NOW-<日期>.md`。提交及远程同步状态以 Git 为准。

## 进度

- 项目已初始化（2026-11-11）：Vite + React + TypeScript 骨架，接入 HeroUI v3、Tailwind CSS v4、Lucide、Motion，配置 oxlint、Prettier 与 `@/` 路径别名。
- 主页已按设计稿方案 A 完成，用户已验收：标志加“来日创造”、LRCZ、邮箱按钮、“产品”下拉按钮（LCML → `/lcml`），页脚版权与 ICP 备案号；颜色模式跟随系统，适配手机。设计稿原文在 `.local/drafts/`。
- LCML 产品页 `/lcml` 已按设计稿方案 A 完成，用户已验收：首屏与下载按钮、启动器界面复原动画（登录、启动、实例、新建、资源、皮肤、外观七章）、功能卡片、更新日志（打开页面时读取 LCML-release 的 CHANGELOG.md 并解析）、下载与反馈入口。设计稿原文在 `.local/drafts/lcml/`。
- LCML 使用手册 `/lcml/manual` 已按设计稿完成（待用户验收）：内容在构建时从 LCML-release 的 `docs/manual/` 下载、随网站发布，左侧分组导航、右侧本页目录、全文搜索、手机端抽屉。
- 协作文档已按 LCML 规范建立，见 [AGENTS](../../AGENTS.md#资料位置)。
- Git 远程仓库为 `https://github.com/LRCZCM/lrcz.git`（`main` 分支）。

## 待人工验证

- LCML 使用手册：真机手机（360–390px）上的排版与抽屉；Safari 中从别的章节点带 `#小节` 的链接后，截图加载完落点是否还准（Safari 不支持滚动锚定，自动化只测了 Edge）。

## 待定事项

- 更新日志的读取方式：现为打开页面时同时从 GitHub 与 gh-proxy 代理读取（都失败提示重试）；备选为打包网站时读取一次写进页面（国内打开更快、不依赖访客网络，但 LCML 每次发版后要重新部署网站），待用户定。
- 加速下载的版本号取自更新日志：若 CHANGELOG 已写新版本而发行版尚未发布，两个下载按钮都会指向不存在的文件，发版顺序需注意（建议先发布再更新 CHANGELOG）。
- JS 包约 945KB（加入使用手册后从 690KB 增加），超过构建的 500KB 提示线；建议把 `/lcml` 与 `/lcml/manual` 改为按需加载，待用户定。
- 使用手册的分组：README 目录现为平铺列表，网页用代码里的默认分组；建议在 README 目录中用 `### 分组名` 写明，以后只改 README。待用户定。
- 全局状态管理（建议先用 React 自带，复杂后再定）、请求方式（建议 `fetch` 封装在 `src/api/`，需要缓存时再考虑 TanStack Query）。
- 国际化：是否需要多语言。
- 主题定制（品牌色、字体）与深色模式切换方式。
- 测试框架（建议首次需要时引入 Vitest）。
- 自有服务器的 OpenResty 配置（见 [DECISIONS 的部署](DECISIONS.md#部署)）待用户在 1Panel 中设置并实测。

## 近期记录

1. 2026-11-11 项目初始化：脚手架、依赖、规范文档、本地 Git。验证：`npm run check` 通过（类型检查、oxlint、Prettier、构建）；浏览器中的显示效果未验证。
2. 2026-11-11 关联远程仓库并覆盖旧内容；记录 ICP 备案号与阿里云 EAS 部署决定。
3. 2026-11-11 主页：首屏、LCML 产品介绍、关于、页脚（落实 ICP 备案号）；截图与图标取自 LCML 仓库，图标同时用作网站图标。验证：`npm run check` 通过；用无界面 Edge 截图查看了桌面浅色、深色与 390px 手机宽度的整页效果；真实浏览器中的动效与链接跳转未验证。
4. 2026-11-11 用户觉得主页文字太多、产品先不做：删除 LCML 产品区及其截图，主页只留必要信息；在 `.local/drafts/` 出三份 HTML 设计稿，用无界面 Edge 截图检查过桌面与手机宽度。
5. 2026-11-11 用户选定方案 A 并要求标志放在文字前：主页重写为单屏（`BrandMark`、`HomePage`、`SiteFooter`），删除页头、首屏、关于与滚动入场组件；开发服务器固定在 127.0.0.1。验证：`npm run check` 通过；无界面 Edge 截图检查了浅色、深色与手机宽度。
6. 2026-11-11 首页邮箱下方加产品入口（LCML，深色底图标），引入 React Router，新增 `/lcml` 占位页；页脚与站点常量移到 `src/components/`、`src/app/`；主体整块上移 8vh 做视觉居中。验证：`npm run check` 通过；预览服务器直接访问 `/lcml` 返回 200；无界面 Edge 截图检查了首页浅色、手机深色与 `/lcml`。
7. 2026-11-11 产品入口改为邮箱旁的“产品”下拉按钮（HeroUI Dropdown，支持悬停、点击、触屏与键盘），去掉图标那一排。验证：`npm run check` 通过（提示 JS 包 609KB 超过 500KB 警告线，未处理）；用 puppeteer 驱动 Edge 实测：悬停打开、移入面板保持、移开关闭、悬停后点击不关闭、点项目跳转、触屏点按打开与点外部关闭、键盘回车打开 / Esc 关闭 / 回车选中跳转均通过；鼠标悬停打开时按 Esc 不关闭（焦点不在菜单内）。
8. 2026-11-11 LCML 产品页：用户选设计稿 A，要求演示再加实例页、下载页的功能并尽量还原。实现 `src/pages/lcml/`（`LcmlPage`、`DemoSection`、`ChangelogSection`、`useChangelog`、`demo/` 启动器复原），素材（壁纸、方块图标、皮肤渲染图）取自 LCML 仓库放在 `src/pages/lcml/assets/`；界面文案取自 LCML 中文语言文件，布局参照 LCML 11 月 6 日的界面截图与当天首次启动截图。验证：`npm run check` 通过（JS 包约 690KB 的提示同上）；puppeteer 驱动 Edge 按时间点截取七章画面逐一检查，整页看了桌面浅色、深色与 390px 手机宽度，均无横向滚动、无脚本报错；点章节跳转、更新日志拦截网络后的错误提示与重试加载均实测通过。
9. 2026-11-11 LCML 产品页按用户意见调整：演示下方注明“网页模拟的界面示意、LCML 基于 JavaFX 开发”；首屏图标移到“LCML”左侧，下载按钮旁加 GitHub 按钮（公开发布仓库）；章节去掉说明文字只留标题。验证：`npm run check` 通过，无界面 Edge 截图检查桌面与手机宽度；用户实测首页与 LCML 页后确认提交。
10. 2026-11-11 LCML 使用手册：先出 `.local/drafts/lcml/manual.html` 设计稿，用户确认后实现 `src/pages/lcml/manual/`，路由 `/lcml/manual/:chapter?`；新增依赖 `marked`；发布仓库地址与读取提取到 `src/pages/lcml/release.ts`（更新日志共用，新增 6 秒超时换源）；产品页顶栏加“使用手册”。验证：`npm run check` 通过（JS 包约 945KB 的提示）；用 Edge 调试协议实测：Ctrl K 搜索、方向键加回车跳到小节并对齐、站内 `xxx.md#小节` 链接跳转对齐、目录随滚动高亮、点截图看大图与 Esc 关闭、未知章节回到手册首页、390px 宽无横向滚动、抽屉打开与点章节后关闭、深色模式，均无脚本报错。
11. 2026-11-11 国内访问：比较了 Gitee 原始文件（文字被跨域拦截）、Gitee 接口（快但每 IP 每小时 60 次）、jsDelivr 各线路与 ghfast 代理，用户选 ghfast。`release.ts` 改为 GitHub 与代理同时请求、用先返回的，都失败再走 jsDelivr；产品页首屏与结尾加“国内加速下载”。验证：`npm run check` 通过；Edge 调试协议拦截请求实测：正常时用 GitHub、拦掉 GitHub 时更新日志、手册与截图都走代理、两者都拦掉时走 jsDelivr，按钮地址为 `ghfast.top/…/releases/download/v26.11.11.4/LCML-26.11.11.4.exe`；用 curl 经代理下载该安装包返回 200（文件名正确，前 2MB 约 4 秒）。
12. 2026-11-11 产品页“下载 Windows 版”与结尾“下载 LCML”改为从 GitHub 直接下载最新版安装包（`releases/download/v版本号/LCML-版本号.exe`），不再跳转发布页；顶栏小“下载”仍跳发布页。验证：`npm run check` 通过；curl 该地址经跳转返回 200、文件名正确。
13. 2026-11-11 代理换成 gh-proxy.org，只保留 GitHub 与 gh-proxy 两个来源（去掉 ghfast 与 jsDelivr），超时由 6 秒放宽到 10 秒；加速下载也走 gh-proxy。验证：`npm run check` 通过；curl 确认 gh-proxy 允许跨域读取、经它下载安装包返回 200 且文件名正确（本机开着代理工具，测得的速度不代表国内访客）；Edge 拦截请求实测：正常用 GitHub、拦掉 GitHub 时更新日志、手册与截图走 gh-proxy、两者都拦掉时显示重试提示，下载按钮保持不可点。
14. 2026-11-11 读不到更新日志时，“下载 Windows 版”“下载 LCML”改为新窗口打开 GitHub 发布页（加速下载仍不可点）。验证：`npm run check` 通过；Edge 拦掉 GitHub 与 gh-proxy 后两个主按钮指向发布页并带新窗口打开，加速下载为禁用。
15. 2026-11-11 用户确认直接使用 ESA Pages 托管，新增根目录 `esa.jsonc` 开启 SPA 路由回退（见 [部署决定](DECISIONS.md#部署)），解决直接访问 `/lcml` 等路由时的静态托管 404；记录未经用户同意不创建分支的要求。验证：`npm run check` 首次因配置格式未通过，Prettier 格式化后完整检查通过（仍有约 946KB 的 JS 包警告）；未部署验证。改动留在 `main`，未创建分支；受默认分支提交前须先建分支的工具规则限制，未提交推送。待部署后直接访问并刷新 `/lcml`、`/lcml/manual` 验证。
16. 2026-11-11 使用手册显示效果与交互优化：全站细滚动条；侧栏与右栏改用 HeroUI `ScrollShadow`（滚动条悬停才显示、边缘渐隐）；左侧导航改为分组图标加竖线、当前章节蓝条弹性滑动并自动滚进可见范围；右栏目录蓝条随滚动滑动；屏宽不足 1280px 时正文上方吸顶“本页目录”下拉与回到顶部；截图加载骨架、淡入、失败重试；看大图加关闭按钮与图注，点空白可关闭；顶栏与三栏对齐；首页卡片、快速上手、翻页卡片悬停反馈；Mac 显示 ⌘K；本页内跳小节平滑滚动，修复再点同一小节不滚动。规范见 [DESIGN 使用手册](DESIGN.md#lcml-使用手册)。验证：`npm run check` 通过（JS 包约 957KB 的提示同上）；Edge 调试协议实测：1600/1100/390 宽与深色截图、看大图点空白关闭、拦截截图请求后显示失败与重试恢复、本页目录连点同一项落点一致（标题距顶 80px）、换章回顶部、手机下拉目录，均无脚本报错。未验证：真实鼠标下滚动条悬停显示（无界面浏览器不画滚动条）、Mac 与 Safari 上的效果。
17. 2026-11-11 看大图的关闭按钮被弹窗圆角裁成水滴形，去掉裁切并改为 36px 圆形；页脚加联系邮箱；所有页面滚到底先停在页脚上方、再滚才露出页脚（见 [DESIGN 页脚](DESIGN.md#基础)）。比较过 CSS 滚动吸附（Edge 实测快速滚动会冲过去，不可用），改为拦截滚轮。验证：`npm run check` 通过；Edge 调试协议模拟滚轮：手册页与产品页快速连滚停在边界（页脚上方），停顿后再滚到底；间隔 120ms 的慢速滚动同样停住；滚轮在侧栏上时滚侧栏、页面不动；关闭按钮截图为正圆。未验证：真实触控板惯性下的手感、Firefox 与 Safari、手机（按设计不拦截）。
18. 2026-11-17 使用手册改为构建时下载：`vite.config.ts` 新增 `lcmlManual` 插件，启动开发服务器与构建时把 LCML-release 的 `docs/manual/` 下载到 `public/lcml-manual/`（已加入 .gitignore 与 .prettierignore），设置 `MANUAL_TOKEN` 时带令牌以支持私有仓库；页面改为从本站 `/lcml-manual/` 读取。部署改为自有国内服务器、本机构建手动上传，删除 `esa.jsonc`。验证：`npm run check` 通过；预览服务器下手册 Markdown 与截图返回 200，无界面 Edge 打开 `/lcml/manual/accounts` 标题与截图（本站地址）正常显示。
19. 2026-11-17 插件页 `/plugins` 设计稿：首版手写 CSS 与网站风格不统一（用户指出），已移到 `.local/drafts/plugins/old/`；新稿改为用网站真实的 HeroUI 组件、主题、页脚与 LCML 页的顶栏和首屏写法，在 `.local/drafts/plugins/` 用独立预览服务器查看（`npx vite --config .local/drafts/plugins/vite.config.ts`，端口 5174，底部切换 A 卡片、B 陈列、C 列表）。插件数据与截图取自 LcPlugins。验证：Edge 调试协议截图检查了 1440 宽浅色、深色与 390 宽深色，均无横向滚动、无脚本报错；悬停、搜索与分类切换未实测。待用户选稿。
20. 2026-11-17 插件页：用户选设计稿 C 并去掉大标题。新增 `src/pages/plugins/`（`PluginsPage` 列表：分类切换、搜索、每行一个插件；`PluginPage` 详情占位；`PluginsHeader` 共用顶栏），路由 `/plugins` 与 `/plugins/:id`，首页产品菜单加“插件”（`src/assets/plugins-icon.svg`）。`vite.config.ts` 抽出 GitHub 目录下载，新增 `lcPlugins` 插件：下载 LcPlugins 的 `docs/manual/` 到 `public/plugins-manual/`，从各插件 `plugin.json`、`build.gradle.kts`、`plugin.yml` 与 `libs.versions.toml` 汇总成 `virtual:plugins`；令牌由 `MANUAL_TOKEN` 改名为 `GITHUB_TOKEN`。LcPlugins 仓库（未提交）新增两个插件的 `plugin.json` 与 `images/icon.svg`，AGENTS 资料表加 `plugin.json` 一行。验证：类型检查、oxlint、Prettier 通过；LcPlugins 为私有且新文件未推送，构建与开发服务器改用测试脚本把 LcPlugins 请求指向本机工作区：构建通过，生成数据正确（1.0.0、Paper 26.1–26.3、前置 CraftEngine 与 LcInputLib）；Edge 调试协议实测分类切换、搜索命中与无结果提示、点行进详情、未知插件回列表、首页产品菜单出现插件并能跳转，1440 浅色与 390 深色无横向滚动、无脚本报错。未验证：设置 `GITHUB_TOKEN` 后直接从 GitHub 构建（需先推送 LcPlugins）。
21. 2026-11-17 图标设计稿：插件板块与 LcInputLib 各出三稿，放在 `.local/drafts/icons/`（打开 `index.html`），与 LCML 图标同一画法（深色圆角底、等轴方块三面配色、橙色点缀），含实际尺寸与产品菜单、插件页顶栏、插件列表中的效果。验证：无界面 Edge 截图检查原尺寸与对比页。待用户选稿。
22. 2026-11-17 用户选定插件板块图标 B（补齐）、LcInputLib 图标 C（手势轨迹），已替换 `src/assets/plugins-icon.svg` 与 LcPlugins 的 `docs/manual/LcInputLib/images/icon.svg`（未提交）。工具皮带图标按同一画法出三稿（A 系皮带的方块、B 圆盘、C 橙色像素皮带），加在 `.local/drafts/icons/index.html`。验证：无界面 Edge 截图检查原尺寸与对比页。待用户选工具皮带图标。
23. 2026-11-17 用户选定工具皮带图标 C（橙色像素皮带），已替换 LcPlugins 的 `docs/manual/LcToolBelt/images/icon.svg`（未提交）；三个图标的决定记入 DECISIONS 的插件页。验证：测试预览（本机 LcPlugins 数据）重启后，Edge 调试协议复测插件列表分类、搜索、详情、未知插件、首页产品菜单均通过，1440 浅色与 390 深色无横向滚动、无脚本报错，截图确认三个新图标显示。
24. 2026-11-17 令牌：用户提供与 LCML-release 共用的只读令牌，存入根目录 `.env`（Git 忽略）；`vite.config.ts` 改用 `loadEnv` 读取 `.env` 或环境变量中的 `GITHUB_TOKEN`。验证：令牌访问 LcPlugins 与 LCML-release 均返回 200；`npm run check` 全部通过（JS 包约 980KB 的提示同上），但 GitHub 上的 LcPlugins 尚无 `docs/manual/`（`c596501` 起的提交未推送），构建出的插件列表为空，需推送后重新构建确认。
25. 2026-11-17 经用户同意提交并推送 LcPlugins（`8dcd9ed`，连同此前未推送的 `ad3f7a2`、`c596501`）；该提交说明标题与正文间漏了空行，未强制推送修正。验证：`npm run check` 全部通过，构建直接从 GitHub 读到两个插件（手册、配图、图标与汇总数据正确）；`npm run dev` 下 Edge 调试协议复测插件列表分类、搜索、详情、未知插件、首页产品菜单均通过，1440 浅色与 390 深色无横向滚动、无脚本报错。网站改动待用户测试后提交。
26. 2026-11-17 用户实测插件页（首页入口、分类、搜索、详情、窄屏与深色）通过，提交并推送网站改动。

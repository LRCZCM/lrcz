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
- 决定：使用 Git 管理，默认分支 `main`，远程仓库 `https://github.com/LRCZCM/lrcz.git`。
- 来源：用户初始化项目时要求。

## ICP 备案

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：网站沿用已有备案，页脚须显示备案号 `浙ICP备2025170013号-4`，链接到 `https://beian.miit.gov.cn/`（新窗口打开，`rel="noopener noreferrer"`）。写页脚时落实。
- 来源：用户确认备案要继续使用；备案号与链接取自旧仓库（2026-06 的“来日创造”页面）。

## 部署

- 状态：已确认。
- 确认日期：2026-11-18。
- 决定：部署到自己的国内服务器（Debian + 1Panel + OpenResty，域名已备案），由同机 Jenkins 自动构建发布：lrcz 推送到 main，或 LCML-release、LcPlugins 的 `docs/manual/` 有改动时，任务 `lrcz-website` 执行 `npm ci` 与完整的 `npm run check`，通过后才替换线上目录，上一版留作 `index.prev`；失败时线上不变。构建流程写在仓库的 `Jenkinsfile`，服务器搭建、凭据、伪静态与换服务器步骤只记在 [DEPLOY](DEPLOY.md)。构建经 `api.github.com` 读取手册与插件信息（服务器连不上 `raw.githubusercontent.com`），Jenkins 拉取全部仓库用 GitHub 账号 LRCZCM 的 SSH 密钥（凭据 `github-lrczcm-ssh`）。OpenResty 须把未知路径回退到 `index.html`，手册目录下找不到的文件返回 404，`/api/plugins/` 只读转发到 Jenkins；本机构建、手动上传 `dist/` 作为备用。
- 理由：推送即上线，改文档不必再手动部署；部署前完整检查挡住有问题的提交；Jenkins 与网站同机，部署只是本机复制，不需要把服务器登录凭据交给外部服务（因此不选 GitHub Actions）。拉代码用账号密钥而非各仓库只读部署密钥，是用户为省去逐仓库配置做的取舍，该密钥只放 Jenkins 凭据。
- 来源：最初用阿里云 ESA Pages 托管（2026-11-11）；用户改为放到自己的国内服务器，先本机构建、手动上传（2026-11-17）；用户要求全自动流程，选 Jenkins 方案并要求部署前跑完整检查，要求所有仓库统一用账号最高权限的 SSH 密钥，部署流程只保存在本仓库（2026-11-18）。

## 品牌信息

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：网站英文名 LRCZ，中文名“来日创造”；作者 LRCZCM，联系邮箱 lrczcm@qq.com。站点文字常量集中在 `src/pages/home/site.ts`。
- 来源：用户在提出主页需求时给出。

## 主页视觉方向

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：学苹果官网的简洁风格，直接使用 HeroUI 组件；主页采用设计稿方案 A“晨光”（整屏居中，标志在“来日创造”前，下方 LRCZ 与邮箱，页脚版权与备案），文字只留必要信息。具体规则见 [DESIGN](DESIGN.md)。
- 来源：用户说喜欢苹果那样简洁的风格；第一版主页后用户认为文字太多，从三份设计稿中选定 A，并要求把标志放到文字前面。

## 路由与产品入口

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：首页邮箱按钮旁放“产品”下拉按钮，面板中列出全部产品（图标、名称、短说明），每个产品一个路由，第一个是 LCML（`/lcml`，使用深色底图标），第二个是插件（`/plugins`，深蓝底拼图图标，2026-11-17 加入），产品介绍页内容后续再定。路由用 React Router（`BrowserRouter`，地址不带 `#`）。部署时服务器须把未知路径回退到 `index.html`，否则直接打开 `/lcml` 会 404。
- 来源：用户要求产品入口放在首页、点击跳转 `/lcml`；最初做成邮箱下方一排图标，用户觉得排版不好，改为邮箱旁的下拉按钮（2026-11-11 确认）。路由库为此引入。

## LCML 使用手册

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：使用手册以 Markdown 写在公开发布仓库 `LRCZCM/LCML-release` 的 `docs/manual/`，网站构建时下载到 `public/lcml-manual/`（含截图）随网站发布，页面从本站读取后渲染；手册更新后网站自动重新构建部署（见[部署](#部署)），路由 `/lcml/manual`（首页，读 README）与 `/lcml/manual/<文件名>`（各章）；LCML 产品页顶栏有“使用手册”入口。章节顺序取自 README“## 目录”中的链接列表，分组以目录里的“### 分组名”为准，README 未写分组时用代码中的默认分组（开始、账号与皮肤、下载、实例、排错与工具、设置与帮助）。Markdown 用 `marked` 解析成标记后由自己的组件渲染，不执行文中的 HTML。界面按 `.local/drafts/lcml/manual.html` 设计稿。
- 来源：用户提出手册写在 GitHub 公开仓库、以后只更新 MD，网页读取后渲染；用户希望以后可以把手册放进私有仓库，确认改为构建时下载、手动重新部署（2026-11-17），私有仓库时在构建环境设置只读令牌（2026-11-17 起与插件共用 `GITHUB_TOKEN`）；设计稿经用户确认后要求按规范做进项目（2026-11-11）。`marked` 为实现时的建议，随设计稿一并确认。

## 发布仓库的国内访问

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：更新日志同时向 GitHub 原始文件地址和第三方代理 `https://gh-proxy.org/` 请求，用先返回的一个，之后的请求沿用它（使用手册已改为构建时下载，不再经此读取）；只用这两个来源，都失败时提示重试。LCML 产品页的首屏和结尾各加“国内加速下载”按钮，经同一代理直接下载最新版安装包（版本号取自更新日志第一个版本，地址 `releases/download/v版本号/LCML-版本号.exe`），旁边的主按钮（首屏“下载 Windows 版”、结尾“下载 LCML”）从 GitHub 直接下载同一个安装包，不再跳转发布页，读不到更新日志（不知道版本号）时改为新窗口打开发布页；两个顶栏的小“下载”按钮仍跳转发布页。代理是个人维护的公益服务，域名可能被封后更换，失效时改 `src/pages/lcml/release.ts` 中的 `PROXY`。
- 来源：用户反映国内连 GitHub 有问题；比较了 Gitee 接口（每 IP 每小时 60 次）、阿里云 OSS 同步（用户认为太麻烦）后，用户先选 ghfast 代理并要求加通过代理下载最新版的按钮；随后改用 gh-proxy（文档 https://gh-proxy.com/docs/github-accelerator ），并要求只保留 GitHub 与 gh-proxy，去掉 ghfast 与 jsDelivr（2026-11-11）。

## LCML 产品页

- 状态：已确认。
- 确认日期：2026-11-11。
- 决定：按设计稿 A（发布会式）制作 `/lcml`。中间用网页代码复原 LCML 启动器界面做成自动播放的动画，不用截图，章节为登录、启动、实例、新建、资源、皮肤、外观；下载跳转 GitHub 公开发布仓库的最新版本页 `LRCZCM/LCML-release/releases/latest`，反馈跳转其 Issues 新建页；更新日志读取该仓库 `CHANGELOG.md` 的内容解析后显示在页面上，不链接到 GitHub。
- 来源：用户要求截图重做为动画、尽量还原启动器页面，展示登录、启动与其他功能，下载先跳 GitHub，更新日志不放 GitHub 链接；用户在三份设计稿中选 A，并要求补充实例页与下载页的功能演示（2026-11-11）。

## 插件页

- 状态：已确认。
- 确认日期：2026-11-17。
- 决定：`/plugins` 为插件列表，按设计稿 C（列表）制作，不要大标题首屏，顶栏下直接是分类切换与搜索；`/plugins/<插件名小写>` 为插件详情，即该插件的使用手册（首页），各章为 `/plugins/<插件名小写>/<章节>`，模板与 LCML 使用手册一致（共用组件）。每个插件的手册按 LCML 的写法拆章：`README.md` 为引言加“## 目录”（“### 分组名”下列出各章链接），每章一个文件；LcInputLib 的开发者接入文档并入手册作为“开发者”一章。插件信息在私有仓库 `LRCZCM/LcPlugins` 维护：每个插件的手册目录 `docs/manual/<插件名>/` 放 `plugin.json`（中文名、一句话、分类、封面、图标），版本号与下载地址在打开页面时经本站 `/api/plugins/<插件名>.json` 读取 Jenkins 最新成功构建，读不到时用构建网站时记下的；构建时取的是 Jenkins 上该插件任务（`https://jenkins.lrcz.com/job/LcPlugins/job/<插件名>/`）最近一次成功构建的编号（2026-11-17 起，见 LcPlugins 的 DECISIONS“版本号与自动构建”）；`plugin.json` 另有两个必填开关（2026-11-19）：`download_plugin` 为 true 时才读 Jenkins、显示版本、下载与历史版本（Jenkins 上还没有成功构建时同样不显示），`manual_hidden` 为 true 时该插件不进列表、手册打不开、手册文件不随网站发布，前置取自 `plugin.yml` 的 `depend`，支持的 Paper 版本为 `api-version` 到 `gradle/libs.versions.toml` 的 `minecraft`，`plugin.yml` 写了 `folia-supported: true` 时 Paper 版本后加“支持 Folia”标签（2026-11-19）。网站构建时用只读令牌 `GITHUB_TOKEN` 把 `docs/manual/` 下载到 `public/plugins-manual/` 并汇总成列表；手册或 `plugin.json` 更新后网站自动重新构建部署，插件代码更新不需要重新部署网站。LcPlugins 是私有仓库，顶栏不放 GitHub 与反馈链接。图标与 LCML 图标同一画法（深色圆角底 `#1F2A44`、白色等轴方块三面配色、品牌橙点缀）：插件板块为“补齐”（大方块缺一角、橙色小方块落入，`src/assets/plugins-icon.svg`），LcInputLib 为“手势轨迹”（准星与渐大的橙点画出 L），工具皮带为插件自带皮带贴图换成品牌橙色；插件图标放在 LcPlugins 各手册目录的 `images/icon.svg`，设计稿在 `.local/drafts/icons/`。
- 来源：用户在三份设计稿（卡片、陈列、列表）中选 C 并要求去掉大标题；数据选构建时从 LcPlugins 读、每个手册文件夹一份 `plugin.json`；令牌与使用手册共用；首页产品菜单加插件入口；详情页先占位，后定为详情页就是手册、按 LCML 拆章、开发者文档并入手册；图标在三稿中选定插件板块 B、LcInputLib C、工具皮带 C（2026-11-17）；用户要求先写好的手册在补上 Jenkins 前也能上线，并在 `plugin.json` 加下载与隐藏两个开关（2026-11-19）。设计稿在 `.local/drafts/plugins/`。

## 插件分发（Jenkins）

- 状态：已确认。
- 确认日期：2026-11-18。
- 决定：插件免费公开下载，由部署网站的同一台服务器上的 Jenkins（1Panel 应用，`https://jenkins.lrcz.com`，数据目录 `/1panel/apps/jenkins/jenkins/data`）自动构建分发。文件夹 `LcPlugins` 下每个插件一个流水线任务，版本号即构建编号（规则见 LcPlugins 仓库 DECISIONS 的“版本号与自动构建”）。匿名用户只有全部/Read 与任务/Read：可看构建列表、日志与变更历史（即更新日志）并下载 jar，看不到工作区。服务器上的构建环境、凭据、任务配置与 Webhook 见 [DEPLOY](DEPLOY.md)；拉取 LcPlugins 用账号 SSH 密钥 `github-lrczcm-ssh`（2026-11-18 起，此前为该仓库的只读部署密钥）。
- 理由：推送即出可下载的版本、访客可选历史版本；Jenkins 与网站同机，网站经本站转发动态读取最新版本。服务器网络实测（2026-11-17）：直连 GitHub 的 HTTPS 不通、SSH（22 端口）可用，Maven 中央仓库、PaperMC 与 Gradle 插件仓库直连可用；清华、阿里云、华为、中科大的 Jenkins 镜像已不提供插件清单 `update-center.json`（只剩插件文件）；gh-proxy 会丢掉认证信息，只能拉公开仓库。因此不用代理、不用公共加速，拉代码走 SSH。
- 来源：用户提出上传新版本覆盖旧版本并提供下载，讨论后选 Jenkins（服务器 8 核 40G）；要求免费公开、构建编号即版本号、按插件分任务、日志公开无妨、更新日志在 Jenkins 上看；关闭服务器代理后改用 SSH 部署密钥（2026-11-17～18），后按用户要求统一换成账号 SSH 密钥（2026-11-18）。

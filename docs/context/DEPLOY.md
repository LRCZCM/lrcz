# 部署与自动化

官网、使用手册与插件的自动构建发布流程，以及换服务器时的重建步骤。本文件是部署流程的唯一记录，其他仓库只链接到这里。决定与理由见 [DECISIONS 的部署](DECISIONS.md#部署)、[插件分发](DECISIONS.md#插件分发jenkins)。本文不写密码、令牌、私钥。

## 涉及的仓库

都在 GitHub 账号 `LRCZCM` 下，默认分支 `main`。

| 仓库                                                   | 可见性 | 内容                                                                                                 | 推送后自动发生                                        |
| ------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [lrcz](https://github.com/LRCZCM/lrcz)                 | 公开   | 官网源码、网站任务的 `Jenkinsfile`、本文件                                                           | 网站任务构建并部署                                    |
| [LCML-release](https://github.com/LRCZCM/LCML-release) | 公开   | LCML 安装包发行版（Releases，手动发布）、`CHANGELOG.md`、使用手册 `docs/manual/`                     | 仅 `docs/manual/` 有改动时网站任务构建并部署          |
| [LcPlugins](https://github.com/LRCZCM/LcPlugins)       | 私有   | 插件源码 `plugins/<插件名>/`、插件任务的 `Jenkinsfile`、各插件手册与 `plugin.json`（`docs/manual/`） | 插件代码改动构建对应插件；`docs/manual/` 改动构建网站 |

## 自动化总览

| 改了什么                       | 结果                                                                                                      | 人工操作         |
| ------------------------------ | --------------------------------------------------------------------------------------------------------- | ---------------- |
| lrcz 推送到 main               | Jenkins 任务 `lrcz-website`：`npm ci` → `npm run check` → 替换线上目录，约 1–2 分钟                       | 无               |
| LCML-release 的 `docs/manual/` | 同上（构建时经 GitHub API 下载手册）                                                                      | 无               |
| LcPlugins 的 `docs/manual/`    | 同上                                                                                                      | 无               |
| LcPlugins 的某插件代码         | Jenkins 任务 `LcPlugins/<插件名>` 构建 jar，构建编号即版本号；网站打开页面时经 `/api/plugins/` 读到新版本 | 无               |
| LCML 新版本                    | 在 LCML-release 手动发 Release；网站打开页面时读 `CHANGELOG.md` 与发行版下载地址                          | 手动发版（保留） |

网站任务任一步失败时线上保持原样；部署成功后上一版留在站点目录的 `index.prev`，回退时在服务器上互换 `index` 与 `index.prev` 的目录名即可。

## 当前服务器

| 项目         | 值                                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 系统与面板   | Debian + 1Panel，Docker                                                                                                                                                                                                         |
| Web 服务     | 1Panel 应用 OpenResty，容器 `1Panel-openresty-HYpw`，宿主机 `/1panel/www` 挂到容器内 `/www`                                                                                                                                     |
| 官网         | `www.lrcz.com`（已备案、HTTPS），站点目录 `/1panel/www/sites/www.lrcz.com/index`                                                                                                                                                |
| Jenkins      | 1Panel 应用 Jenkins（`jenkins/jenkins:2.580.2-lts`），宿主机端口 8082，数据目录 `/1panel/apps/jenkins/jenkins/data`（容器内 `/var/jenkins_home`，下称 `$JENKINS_HOME`），容器以 root 运行并挂载宿主机 `docker.sock` 与 `docker` |
| Jenkins 域名 | `jenkins.lrcz.com`（HTTPS），1Panel 反向代理到 `http://127.0.0.1:8082`                                                                                                                                                          |
| 构建工具     | `$JENKINS_HOME/tools/temurin-25`（插件用 JDK 25），`$JENKINS_HOME/tools/node-24`（网站用 Node 24）                                                                                                                              |

服务器网络（2026-11-18 实测）：`raw.githubusercontent.com` 不通，git 走 HTTPS 连 `github.com` 会卡住，因此**拉代码一律用 SSH**；`api.github.com` 可用（网站构建经它下载手册）；npm 用 `https://registry.npmmirror.com`；Docker Hub 直连不通，需在 Docker 配镜像加速；Maven 中央仓库、PaperMC、Gradle 插件仓库直连可用。换服务器后先按这些逐项实测。

## 换服务器：重建步骤

最省事的做法：在旧服务器停掉 Jenkins，把整个 `$JENKINS_HOME` 打包搬到新服务器同一位置（凭据用其中的 `secrets/` 加密，必须整体一起搬），再从第 3 步的“容器名与端口”开始核对。下面是从零搭建的完整步骤。

### 1. 面板与应用

1. 安装 1Panel，应用商店装 OpenResty 与 Jenkins（端口设为 8082；1Panel 的 Jenkins 应用默认以 root 运行并挂载 `docker.sock`，保持不变，部署要用）。
2. Docker 配镜像加速（1Panel 的“容器 → 配置”）。

### 2. 官网站点

1. 1Panel 新建静态网站 `www.lrcz.com`，申请 HTTPS 证书。
2. 站点“伪静态”填入（`8082` 为 Jenkins 端口）：

```nginx
location /lcml-manual/ {
    try_files $uri =404;
}
location /plugins-manual/ {
    try_files $uri =404;
}
# 插件页动态读取最新版本号与下载地址：只读转发到 Jenkins 上该插件“最近一次成功构建”的接口
location ~ ^/api/plugins/(Lc[A-Za-z0-9]+)\.json$ {
    limit_except GET { deny all; }
    proxy_pass http://127.0.0.1:8082/job/LcPlugins/job/$1/lastSuccessfulBuild/api/json?tree=displayName,url,artifacts%5BrelativePath%5D;
    proxy_set_header Host jenkins.lrcz.com;
    proxy_hide_header Set-Cookie;
    proxy_hide_header X-Jenkins;
    proxy_hide_header X-Jenkins-Session;
    proxy_hide_header X-Hudson;
    proxy_hide_header Cache-Control;
    add_header Cache-Control "public, max-age=60";
}
location / {
    try_files $uri $uri/ /index.html;
}
```

3. 新建反向代理网站 `jenkins.lrcz.com` → `http://127.0.0.1:8082`，申请 HTTPS 证书。

### 3. Jenkins 基础配置

1. 初始化时装推荐插件，另确认有：Git、GitHub、Pipeline、Credentials Binding、Plain Credentials、SSH Credentials、Matrix Authorization Strategy、Folders、Timestamper。
2. 系统管理 → System：Jenkins URL 为 `https://jenkins.lrcz.com/`。
3. 系统管理 → Security：授权策略选“项目矩阵授权策略”，管理员 `lrczcm` 全部权限，`Anonymous` 只勾“全部/Read”与“任务/Read”（访客可看构建、日志并下载 jar，看不到工作区）。同页“Git Host Key Verification Configuration”选 Manually provided keys，填入 GitHub 的 SSH 主机公钥（取自 `https://api.github.com/meta` 的 `ssh_keys`，每行写成 `github.com <公钥>`）。
4. 容器名与端口：OpenResty 容器名若变化，改 lrcz 仓库 `Jenkinsfile` 的 `SITE_CONTAINER`；站点目录若变化，改 `SITE_DIR`（容器内路径）；Jenkins 端口若变化，改伪静态里的 `proxy_pass` 与反向代理。

### 4. 构建工具

在宿主机执行（版本按需更新；Node 与本机开发保持同一大版本）：

```bash
T=/1panel/apps/jenkins/jenkins/data/tools
# Node 24（网站）
V=v24.21.0
mkdir -p $T/node-24
curl -fL https://npmmirror.com/mirrors/node/$V/node-$V-linux-x64.tar.xz | tar -xJ -C $T/node-24 --strip-components=1
# Temurin JDK 25（插件）：从 Adoptium 下载 Linux x64 的 JDK 25 压缩包解压到 $T/temurin-25
```

插件的 Gradle 用 `$JENKINS_HOME/.gradle/gradle.properties` 找 JDK：

```properties
# 项目要求 Java 25 工具链，使用这里手动安装的 Temurin 25
org.gradle.java.installations.paths=/var/jenkins_home/tools/temurin-25
org.gradle.java.installations.auto-download=false
```

### 5. 凭据

系统管理 → Credentials → System → 全局，新建：

| ID                  | 类型                          | 内容                                                                                                             | 用途                                          |
| ------------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `github-lrczcm-ssh` | SSH Username with private key | 用户名 `git`，私钥为已加到 GitHub 账号 `LRCZCM`（Settings → SSH keys）的密钥，现为服务器 `/root/.ssh/id_ed25519` | 拉取全部仓库（lrcz、LCML-release、LcPlugins） |
| `github-lcplugins`  | Username with password        | 用户名 `LRCZCM`，密码为能读 LcPlugins 内容的 GitHub 只读令牌                                                     | 网站构建时作为 `GITHUB_TOKEN` 调 GitHub API   |

用账号密钥是用户的决定（2026-11-18），该密钥对账号下所有仓库有写权限，换服务器时只放进 Jenkins 凭据，不写进任何文件。

### 6. 任务

**网站 `lrcz-website`**（顶层，流水线）：

- 勾选“GitHub project”，地址 `https://github.com/LRCZCM/lrcz/`；构建触发器勾“GitHub hook trigger for GITScm polling”。
- 流水线定义选 Pipeline script from SCM：Git，仓库 `git@github.com:LRCZCM/lrcz.git`，凭据 `github-lrczcm-ssh`，分支 `*/main`，脚本路径 `Jenkinsfile`，勾选轻量级检出。
- 其余（关注两个手册仓库、检查、部署）都写在仓库的 [Jenkinsfile](../../Jenkinsfile) 里。

**插件**：新建文件夹 `LcPlugins`，其中每个插件一个流水线任务，任务名即插件目录名（`plugins/<插件名>`，现有 `LcInputLib`、`LcToolBelt`）：

- “GitHub project”与触发器同上（地址 `https://github.com/LRCZCM/LcPlugins/`）。
- Pipeline script from SCM：仓库 `git@github.com:LRCZCM/LcPlugins.git`，凭据 `github-lrczcm-ssh`，分支 `*/main`，脚本路径 `Jenkinsfile`，轻量级检出。
- 附加行为“Polling ignores commits in certain paths”，Included Regions 为该插件目录及其依赖的公共构建文件，例如 LcToolBelt（依赖 LcInputLib）：

```text
plugins/LcInputLib/.*
build-logic/.*
gradle/.*
settings.gradle.kts
build.gradle.kts
gradle.properties
plugins/LcToolBelt/.*
```

LcInputLib 去掉最后一行即可。新插件照此加一个任务，并在伪静态的 `/api/plugins/` 规则下自动可用（名字须以 `Lc` 开头）。

### 7. GitHub Webhook

lrcz、LCML-release、LcPlugins 三个仓库各加一个：Settings → Webhooks → Add webhook，Payload URL `https://jenkins.lrcz.com/github-webhook/`，Content type `application/json`，事件只选 push。

### 8. 首次运行与验收

1. 每个任务手动“立即构建”一次。Jenkins 判断有无改动时，用的是上一次构建记下的仓库地址与凭据；没有构建记录，或改了任务的仓库地址、凭据之后，都要先手动构建一次，Webhook 才能正常触发。
2. 依次验证：
   - lrcz 推送一次，`lrcz-website` 自动构建成功，`https://www.lrcz.com/`、`/lcml`、`/plugins`、`/lcml/manual` 正常，`/lcml-manual/不存在.png` 返回 404，`/api/plugins/LcInputLib.json` 返回 JSON。
   - LCML-release 或 LcPlugins 改一处 `docs/manual/` 并推送，网站自动更新。
   - LcPlugins 只改插件代码，只触发对应插件任务，不触发网站。
3. 旧服务器的 DNS 切换前，新服务器的证书与备案接入先办好。

## 本机手动部署（备用）

Jenkins 不可用时：本机 `npm run build`（需要 `.env` 中的 `GITHUB_TOKEN`，见 [README](../../README.md#命令)），把 `dist/` 的内容上传到站点目录，保留目录里 1Panel 自带的 `404.html`。

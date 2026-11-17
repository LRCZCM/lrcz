import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv, type Plugin } from 'vite'

// 读取私有仓库（如 LcPlugins）需要只读令牌 GITHUB_TOKEN，写在 .env 或环境变量里；只在本机构建时使用，不会进入网页
const token = loadEnv('', import.meta.dirname, 'GITHUB_').GITHUB_TOKEN
const headers = token ? { Authorization: `Bearer ${token}` } : undefined

async function get(url: string) {
  const response = await fetch(url, { headers })
  if (!response.ok) {
    const hint = response.status === 404 && !token ? '（私有仓库需设置 GITHUB_TOKEN）' : ''
    throw new Error(`读取 GitHub 失败：${url} 返回 ${response.status}${hint}`)
  }
  return response
}

const raw = (repo: string, path: string) =>
  get(`https://raw.githubusercontent.com/${repo}/main/${path}`)

/** 把仓库 main 分支 dir 目录下的全部文件下载到 out，返回各文件相对 dir 的路径。 */
async function downloadDir(repo: string, dir: string, out: string) {
  const api = `https://api.github.com/repos/${repo}/git/trees/main?recursive=1`
  const { tree } = (await (await get(api)).json()) as { tree: { path: string; type: string }[] }
  const files = tree
    .filter((t) => t.type === 'blob' && t.path.startsWith(dir))
    .map((t) => t.path.slice(dir.length))
  await rm(out, { recursive: true, force: true })
  await Promise.all(
    files.map(async (file) => {
      await mkdir(dirname(join(out, file)), { recursive: true })
      await writeFile(
        join(out, file),
        Buffer.from(await (await raw(repo, dir + file)).arrayBuffer()),
      )
    }),
  )
  return files
}

/** 启动开发服务器与构建时，把 LCML 使用手册（含截图）从发布仓库下载到 public/，随网站一起发布。 */
function lcmlManual(): Plugin {
  return {
    name: 'lcml-manual',
    async buildStart() {
      // 输出目录与 src/pages/lcml/manual/manual.ts 的 MANUAL_FILES 对应
      await downloadDir('LRCZCM/LCML-release', 'docs/manual/', 'public/lcml-manual')
    },
  }
}

const PLUGINS_REPO = 'LRCZCM/LcPlugins'
const PLUGINS_OUT = 'public/plugins-manual'
const PLUGINS_MODULE = 'virtual:plugins'
// 每个插件在 Jenkins 的 LcPlugins 文件夹下有一个同名构建任务，版本号即最近一次成功构建的编号
const PLUGINS_JENKINS = 'https://jenkins.lrcz.com/job/LcPlugins/job'

/** 插件最近一次成功构建的版本号、jar 下载地址与全部构建（历史版本）页面。 */
async function latestBuild(name: string) {
  const api = `${PLUGINS_JENKINS}/${name}/lastSuccessfulBuild/api/json?tree=number,url,artifacts[relativePath]`
  const response = await fetch(api)
  if (!response.ok) throw new Error(`读取插件构建失败：${api} 返回 ${response.status}`)
  const build = (await response.json()) as {
    number: number
    url: string
    artifacts: { relativePath: string }[]
  }
  const [jar] = build.artifacts
  if (!jar) throw new Error(`读取插件构建失败：${build.url} 没有构建产物`)
  return {
    version: String(build.number),
    download: `${build.url}artifact/${jar.relativePath}`,
    builds: `${PLUGINS_JENKINS}/${name}/`,
  }
}

function pick(text: string, pattern: RegExp, where: string) {
  const match = text.match(pattern)
  if (!match) throw new Error(`读取插件信息失败：${where} 中找不到 ${pattern}`)
  return match[1]
}

/**
 * 启动开发服务器与构建时，把 LcPlugins 的 docs/manual/（各插件的手册、配图与 plugin.json）下载到 public/，
 * 并汇总成插件列表，页面从 virtual:plugins 引入（类型见 src/pages/plugins/virtualPlugins.d.ts）。
 * 版本号与下载地址取自 Jenkins，前置取自 plugin.yml 的 depend，支持的 Paper 版本为 api-version 到仓库编译用的版本。
 */
function lcPlugins(): Plugin {
  let list: Promise<unknown[]>

  const load = async () => {
    const files = await downloadDir(PLUGINS_REPO, 'docs/manual/', PLUGINS_OUT)
    const names = files.flatMap((f) => f.match(/^([^/]+)\/plugin\.json$/)?.[1] ?? [])
    const latest = pick(
      await (await raw(PLUGINS_REPO, 'gradle/libs.versions.toml')).text(),
      /^minecraft = "(.+)"/m,
      'libs.versions.toml',
    )
    return Promise.all(
      names.map(async (name) => {
        const meta = JSON.parse(await readFile(join(PLUGINS_OUT, name, 'plugin.json'), 'utf8'))
        const yml = await (
          await raw(PLUGINS_REPO, `plugins/${name}/src/main/resources/plugin.yml`)
        ).text()
        const oldest = pick(yml, /^api-version: '(.+)'/m, `${name} 的 plugin.yml`)
        const depend = yml.match(/^depend: \[(.*)\]/m)?.[1] ?? ''
        return {
          id: name.toLowerCase(),
          name,
          title: meta.title,
          summary: meta.summary,
          category: meta.category,
          cover: `/plugins-manual/${name}/${meta.cover}`,
          icon: `/plugins-manual/${name}/${meta.icon}`,
          ...(await latestBuild(name)),
          paper: oldest === latest ? oldest : `${oldest}–${latest}`,
          depends: depend.split(',').flatMap((d) => d.trim() || []),
        }
      }),
    )
  }

  return {
    name: 'lc-plugins',
    async buildStart() {
      list = load()
      await list
    },
    resolveId: (id) => (id === PLUGINS_MODULE ? `\0${PLUGINS_MODULE}` : undefined),
    async load(id) {
      if (id === `\0${PLUGINS_MODULE}`)
        return `export const plugins = ${JSON.stringify(await list)}`
    },
  }
}

// /api/plugins/<插件名>.json：插件页动态读取最新构建。线上由服务器 OpenResty 转发到 Jenkins，开发与预览时转给线上站点
const pluginsApi = { '/api/plugins': { target: 'https://www.lrcz.com', changeOrigin: true } }

export default defineConfig({
  plugins: [react(), tailwindcss(), lcmlManual(), lcPlugins()],
  server: { host: '127.0.0.1', proxy: pluginsApi },
  preview: { host: '127.0.0.1', proxy: pluginsApi },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})

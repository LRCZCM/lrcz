// LCML 公开发布仓库（不含源码）：安装包、反馈、更新日志与使用手册都在这里
export const GITHUB_URL = 'https://github.com/LRCZCM/LCML-release'
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/latest`
export const FEEDBACK_URL = `${GITHUB_URL}/issues/new/choose`

// 第三方 GitHub 代理（gh-proxy.org），国内连不上 GitHub 时用；失效时改这里
const PROXY = 'https://gh-proxy.org/'
const RAW = 'https://raw.githubusercontent.com/LRCZCM/LCML-release/main/'
// GitHub 与代理同时请求，谁快用谁
const SOURCES = [RAW, PROXY + RAW]
// 连不上时常常不立刻报错，超时就算失败
const TIMEOUT = 10000

/** 某个版本的安装包（发行版标签 v版本号，文件 LCML-版本号.exe）。 */
export const downloadUrl = (version: string) =>
  `${GITHUB_URL}/releases/download/v${version}/LCML-${version}.exe`
/** 经代理下载安装包。 */
export const proxyDownloadUrl = (version: string) => PROXY + downloadUrl(version)

async function fetchFrom(base: string, path: string, signal: AbortSignal) {
  const url = base + path
  const response = await fetch(url, { cache: 'no-cache', signal })
  if (!response.ok) throw new Error(`${url} 返回 ${response.status}`)
  return { text: await response.text(), url, base }
}

// 记住最快的来源，后面的文件直接用它，不必每次都同时请求
let fastest: string | undefined

/** 读取发布仓库里的文件，返回内容与实际地址（用来解析文中的相对路径）。 */
export async function fetchReleaseFile(path: string) {
  if (fastest) {
    // 最快的来源失效时，重新比一次
    const result = await fetchFrom(fastest, path, AbortSignal.timeout(TIMEOUT)).catch(() => null)
    if (result) return result
    fastest = undefined
  }

  const race = new AbortController()
  const signal = AbortSignal.any([race.signal, AbortSignal.timeout(TIMEOUT)])
  const result = await Promise.any(SOURCES.map((base) => fetchFrom(base, path, signal))).finally(
    () => race.abort(),
  )
  fastest = result.base
  return result
}

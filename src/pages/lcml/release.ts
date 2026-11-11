// LCML 公开发布仓库（不含源码）：安装包、反馈、更新日志与使用手册都在这里
export const GITHUB_URL = 'https://github.com/LRCZCM/LCML-release'
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/latest`
export const FEEDBACK_URL = `${GITHUB_URL}/issues/new/choose`

// GitHub 连不上时改走 jsDelivr 镜像（缓存约 12 小时）
const SOURCES = [
  'https://raw.githubusercontent.com/LRCZCM/LCML-release/main/',
  'https://cdn.jsdelivr.net/gh/LRCZCM/LCML-release@main/',
]
// 国内 GitHub 常常连不上又不立刻报错，超时就换下一个来源
const TIMEOUT = 6000

// 上次成功的来源排到最前，读多个文件时不必每次都先等 GitHub 超时
let preferred = SOURCES[0]

/** 读取发布仓库里的文件，返回内容与实际地址（用来解析文中的相对路径）。 */
export async function fetchReleaseFile(path: string) {
  for (const base of [preferred, ...SOURCES.filter((s) => s !== preferred)]) {
    const url = base + path
    // 网络错误时换下一个来源
    const response = await fetch(url, {
      cache: 'no-cache',
      signal: AbortSignal.timeout(TIMEOUT),
    }).catch(() => null)
    if (response?.ok) {
      preferred = base
      return { text: await response.text(), url }
    }
  }
  throw new Error(`${path} 读取失败`)
}

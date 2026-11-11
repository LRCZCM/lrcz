import { useCallback, useEffect, useState } from 'react'

const TYPES = ['增加', '更新', '修复', '移除'] as const
export type ChangeType = (typeof TYPES)[number]
export type Release = { version: string; items: { type: ChangeType | null; text: string }[] }

// 更新日志来自 LCML 公开发布仓库的 CHANGELOG.md；GitHub 连不上时改走 jsDelivr 镜像（缓存约 12 小时）
const SOURCES = [
  'https://raw.githubusercontent.com/LRCZCM/LCML-release/main/CHANGELOG.md',
  'https://cdn.jsdelivr.net/gh/LRCZCM/LCML-release@main/CHANGELOG.md',
]

// 格式：“## 版本号”开始一个版本，“- 类型：内容”是一条改动；空的“未发布”不显示
export function parseChangelog(markdown: string): Release[] {
  const releases: Release[] = []
  for (const line of markdown.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+)/)
    if (heading) releases.push({ version: heading[1].trim(), items: [] })
    const item = line.match(/^[-*]\s+(.+)/)
    if (item && releases.length) {
      const [, prefix, rest] = item[1].match(/^(.+?)：(.+)/) ?? []
      const type = TYPES.find((t) => t === prefix)
      releases.at(-1)!.items.push(type ? { type, text: rest } : { type: null, text: item[1] })
    }
  }
  return releases.filter((r) => r.items.length > 0 && r.version !== '未发布')
}

async function loadChangelog() {
  for (const url of SOURCES) {
    // 网络错误时换下一个来源
    const response = await fetch(url, { cache: 'no-cache' }).catch(() => null)
    if (response?.ok) return parseChangelog(await response.text())
  }
  throw new Error('更新日志读取失败')
}

type ChangelogState =
  { status: 'loading' } | { status: 'error' } | { status: 'done'; releases: Release[] }

export function useChangelog() {
  const [state, setState] = useState<ChangelogState>({ status: 'loading' })

  const fetchReleases = useCallback(() => {
    loadChangelog().then(
      (releases) => setState({ status: 'done', releases }),
      () => setState({ status: 'error' }),
    )
  }, [])

  useEffect(fetchReleases, [fetchReleases])

  const retry = () => {
    setState({ status: 'loading' })
    fetchReleases()
  }

  return { state, retry }
}

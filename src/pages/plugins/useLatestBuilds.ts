import { useEffect, useState } from 'react'
import { plugins, type PluginInfo } from 'virtual:plugins'

type Latest = Pick<PluginInfo, 'version' | 'download'>

/** 经本站 /api/plugins/ 读取 Jenkins 上该插件最近一次成功构建（服务器 OpenResty 只读转发，开发时由 vite 转发）。 */
async function fetchLatest(name: string): Promise<Latest> {
  const response = await fetch(`/api/plugins/${name}.json`)
  if (!response.ok) throw new Error(`读取 ${name} 最新构建失败：${response.status}`)
  const build = (await response.json()) as {
    displayName: string
    url: string
    artifacts: { relativePath: string }[]
  }
  const [jar] = build.artifacts
  if (!jar) throw new Error(`${name} 最新构建没有 jar`)
  return { version: build.displayName, download: `${build.url}artifact/${jar.relativePath}` }
}

// 打开插件页后才请求，列表与手册页共用一次结果；单个插件读不到时用构建网站时记下的版本
let request: Promise<Map<string, Latest>> | undefined

function loadAll() {
  request ??= Promise.all(
    plugins.map((p) =>
      fetchLatest(p.name).then(
        (latest) => [p.name, latest] as const,
        () => [p.name, p] as const,
      ),
    ),
  ).then((entries) => new Map(entries))
  return request
}

/** 插件最新的版本号与下载地址：先显示构建网站时的数据，读到 Jenkins 后换成最新的。 */
export function useLatestBuilds() {
  const [latest, setLatest] = useState<Map<string, Latest>>()
  useEffect(() => {
    let active = true
    void loadAll().then((map) => active && setLatest(map))
    return () => {
      active = false
    }
  }, [])
  return (plugin: PluginInfo): Latest => latest?.get(plugin.name) ?? plugin
}

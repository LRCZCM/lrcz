import { buttonVariants, Chip } from '@heroui/react'
import { ArrowUpRight, Code, Gamepad2, LifeBuoy, Rocket, Server } from 'lucide-react'
import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { plugins, type PluginInfo } from 'virtual:plugins'
import pluginsIcon from '@/assets/plugins-icon.svg'
import { site } from '@/app/site'
import { pageRoute, type ManualSource } from '@/components/manual/manual'
import { ManualView } from '@/components/manual/ManualView'
import { LIBRARY } from './PluginsPage'
import { useLatestBuilds } from './useLatestBuilds'

// 手册里链接到任一插件手册的文件（`../LcInputLib/config.md`）都转成该插件的页面
function route(url: URL) {
  const [, name, page] = url.pathname.match(/^\/plugins-manual\/(\w+)\/([\w-]+)\.md$/) ?? []
  return name ? pageRoute(`/plugins/${name.toLowerCase()}`, page) : null
}

function manualSource(plugin: PluginInfo): ManualSource {
  return {
    name: plugin.title,
    path: `/plugins/${plugin.id}`,
    // 构建时由 vite.config.ts 从 LcPlugins 下载到这里
    files: `/plugins-manual/${plugin.name}/`,
    route,
    groupIcons: { 开始: Rocket, 玩法: Gamepad2, 服主: Server, 帮助: LifeBuoy, 开发者: Code },
    startHint: '第一次用？从这里开始',
    searchHint: '输入关键词，比如“配置”“命令”',
    feedback: { label: site.email, href: `mailto:${site.email}` },
  }
}

/** 插件页即插件的使用手册：`/plugins/<插件>` 为手册首页，`/plugins/<插件>/<章节>` 为各章。 */
export function PluginPage() {
  const { id, chapter } = useParams()
  const plugin = plugins.find((p) => p.id === id)
  const source = useMemo(() => plugin && manualSource(plugin), [plugin])
  const latestOf = useLatestBuilds()
  if (!plugin || !source) return <Navigate to="/plugins" replace />
  const latest = latestOf(plugin)

  return (
    <ManualView
      // 换插件时整页重来，不沿用上一个插件的状态
      key={plugin.id}
      source={source}
      chapter={chapter}
      brand={
        <>
          <Link to="/plugins" className="flex items-center gap-2 font-semibold">
            <img src={pluginsIcon} alt="" className="size-[22px] rounded-[22%]" />
            插件
          </Link>
          <Link
            to={source.path}
            className="-ml-2 flex items-center gap-2 border-l border-separator pl-3 text-muted transition-colors hover:text-foreground max-md:hidden"
          >
            <img src={plugin.icon} alt="" className="size-[18px] rounded-[22%]" />
            {plugin.title}
          </Link>
        </>
      }
      actions={
        <a href={latest.download} className={buttonVariants({ size: 'sm' })}>
          下载
        </a>
      }
      intro={
        <div className="-mt-1 mb-2 flex flex-wrap items-center gap-1.5">
          <Chip size="sm" variant="soft" color={plugin.category === LIBRARY ? 'warning' : 'accent'}>
            {plugin.category}
          </Chip>
          <Chip size="sm" variant="soft">
            v{latest.version}
          </Chip>
          <Chip size="sm" variant="soft">
            Paper {plugin.paper}
          </Chip>
          <Chip size="sm" variant="soft">
            {plugin.depends.length ? `需要 ${plugin.depends.join('、')}` : '无需前置'}
          </Chip>
          <a
            href={plugin.builds}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex items-center gap-0.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            历史版本
            <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      }
    />
  )
}

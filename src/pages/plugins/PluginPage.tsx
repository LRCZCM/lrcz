import { buttonVariants, Chip } from '@heroui/react'
import { ArrowLeft } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router'
import { plugins } from 'virtual:plugins'
import { SiteFooter } from '@/components/SiteFooter'
import { LIBRARY } from './PluginsPage'
import { PluginsHeader } from './PluginsHeader'

/** 插件详情页（占位）：先显示图标、名称与一句话，完整介绍与使用手册待设计。 */
export function PluginPage() {
  const { id } = useParams()
  const plugin = plugins.find((p) => p.id === id)
  if (!plugin) return <Navigate to="/plugins" replace />

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <title>{`${plugin.title} · 来日创造`}</title>
      <PluginsHeader />
      <main className="flex flex-1 flex-col items-center px-4 pt-28 pb-32 text-center">
        <img
          src={plugin.icon}
          alt=""
          className="size-24 rounded-[22%] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]"
        />
        <h1 className="mt-7 text-[clamp(32px,5vw,48px)] font-bold tracking-tight">
          {plugin.title}
        </h1>
        <span className="mt-1 text-muted">
          {plugin.name} · v{plugin.version}
        </span>
        <p className="mt-4 max-w-[420px] text-[17px] leading-relaxed text-balance">
          {plugin.summary}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-1.5">
          <Chip size="sm" variant="soft" color={plugin.category === LIBRARY ? 'warning' : 'accent'}>
            {plugin.category}
          </Chip>
          <Chip size="sm" variant="soft">
            Paper {plugin.paper}
          </Chip>
        </div>
        <p className="mt-12 text-sm text-muted">详细介绍与使用手册即将上线</p>
        <Link to="/plugins" className={`mt-4 ${buttonVariants({ variant: 'tertiary' })}`}>
          <ArrowLeft className="size-4" />
          返回插件列表
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}

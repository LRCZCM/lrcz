import { buttonVariants, Chip, SearchField, Tabs } from '@heroui/react'
import { ArrowUpRight, Download } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { plugins } from 'virtual:plugins'
import pluginsIcon from '@/assets/plugins-icon.svg'
import { site } from '@/app/site'
import { SiteFooter } from '@/components/SiteFooter'
import { useLatestBuilds } from './useLatestBuilds'

const ALL = '全部'
export const LIBRARY = '前置库'

// 玩法插件在前，前置库排在后面
const sorted = plugins.toSorted(
  (a, b) => Number(a.category === LIBRARY) - Number(b.category === LIBRARY),
)
const categories = [ALL, ...new Set(sorted.map((p) => p.category))]

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  }
}

export function PluginsPage() {
  const [category, setCategory] = useState(ALL)
  const [query, setQuery] = useState('')
  const latestOf = useLatestBuilds()
  const keyword = query.trim().toLowerCase()
  const shown = sorted.filter(
    (p) =>
      (category === ALL || p.category === category) &&
      `${p.title}${p.name}${p.summary}`.toLowerCase().includes(keyword),
  )

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <title>插件 · 来日创造</title>
      <header className="sticky top-0 z-20 flex h-13 items-center gap-6 border-b border-separator bg-background/80 px-[max(16px,calc(50%-540px))] text-sm backdrop-blur-xl backdrop-saturate-150">
        <Link to="/" className="text-muted transition-colors hover:text-foreground">
          {site.nameZh}
        </Link>
        <span className="flex items-center gap-2 font-semibold">
          <img src={pluginsIcon} alt="" className="size-[22px] rounded-[22%]" />
          插件
        </span>
      </header>
      <main className="mx-auto w-full max-w-[760px] flex-1 px-4 pt-14 pb-32">
        <motion.div {...rise(0)} className="flex flex-wrap items-center justify-between gap-3">
          <Tabs selectedKey={category} onSelectionChange={(key) => setCategory(String(key))}>
            <Tabs.ListContainer>
              <Tabs.List aria-label="分类">
                {categories.map((c) => (
                  <Tabs.Tab key={c} id={c} className="whitespace-nowrap">
                    {c}
                    <Tabs.Indicator />
                  </Tabs.Tab>
                ))}
              </Tabs.List>
            </Tabs.ListContainer>
          </Tabs>
          <SearchField
            aria-label="搜索插件"
            value={query}
            onChange={setQuery}
            className="w-56 max-sm:w-full"
          >
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜索插件" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
        </motion.div>

        <motion.div {...rise(0.1)} className="mt-8">
          {shown.map((p) => {
            const latest = latestOf(p)
            return (
              // 整行可点进手册（标题链接铺满整行），下载与历史版本按钮浮在其上
              <div
                key={p.id}
                className="group relative grid grid-cols-[64px_1fr_auto] items-center gap-5 border-t border-separator py-7 last:border-b max-sm:grid-cols-[56px_1fr] max-sm:gap-4"
              >
                <img
                  src={p.icon}
                  alt=""
                  className="size-16 rounded-[22%] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] max-sm:size-14"
                />
                <div className="min-w-0">
                  <Link
                    to={`/plugins/${p.id}`}
                    className="flex flex-wrap items-baseline gap-x-2.5 after:absolute after:inset-0"
                  >
                    <b className="text-lg tracking-tight transition-colors group-hover:text-accent">
                      {p.title}
                    </b>
                    <span className="text-sm text-muted">{p.name}</span>
                  </Link>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{p.summary}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <Chip
                      size="sm"
                      variant="soft"
                      color={p.category === LIBRARY ? 'warning' : 'accent'}
                    >
                      {p.category}
                    </Chip>
                    {latest.version && (
                      <Chip size="sm" variant="soft">
                        v{latest.version}
                      </Chip>
                    )}
                    <Chip size="sm" variant="soft">
                      Paper {p.paper}
                    </Chip>
                    {p.depends.length > 0 && (
                      <Chip size="sm" variant="soft">
                        需要 {p.depends.join('、')}
                      </Chip>
                    )}
                  </div>
                </div>
                {latest.download && (
                  <div className="relative grid gap-2 max-sm:col-start-2 max-sm:flex">
                    <a
                      href={latest.download}
                      className={`${buttonVariants({ size: 'sm' })} sm:w-full`}
                    >
                      <Download className="size-4" />
                      下载最新版
                    </a>
                    <a
                      href={p.builds}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${buttonVariants({ size: 'sm', variant: 'tertiary' })} sm:w-full`}
                    >
                      历史版本
                      <ArrowUpRight className="size-4" />
                    </a>
                  </div>
                )}
              </div>
            )
          })}
          {shown.length === 0 && (
            <p className="border-t border-separator py-16 text-center text-muted">
              没有找到“{query.trim()}”相关的插件
            </p>
          )}
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}

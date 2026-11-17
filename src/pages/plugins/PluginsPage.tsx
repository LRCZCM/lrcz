import { Chip, SearchField, Tabs } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router'
import { plugins } from 'virtual:plugins'
import { SiteFooter } from '@/components/SiteFooter'
import { PluginsHeader } from './PluginsHeader'

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
  const keyword = query.trim().toLowerCase()
  const shown = sorted.filter(
    (p) =>
      (category === ALL || p.category === category) &&
      `${p.title}${p.name}${p.summary}`.toLowerCase().includes(keyword),
  )

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <title>插件 · 来日创造</title>
      <PluginsHeader />
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
          {shown.map((p) => (
            <Link
              key={p.id}
              to={`/plugins/${p.id}`}
              className="group grid grid-cols-[64px_1fr_auto] items-center gap-5 border-t border-separator py-7 last:border-b max-sm:grid-cols-[56px_1fr_auto] max-sm:gap-4"
            >
              <img
                src={p.icon}
                alt=""
                className="size-16 rounded-[22%] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)] max-sm:size-14"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <b className="text-lg tracking-tight">{p.title}</b>
                  <span className="text-sm text-muted">{p.name}</span>
                </div>
                <p className="mt-1 text-[15px] leading-relaxed text-muted">{p.summary}</p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <Chip
                    size="sm"
                    variant="soft"
                    color={p.category === LIBRARY ? 'warning' : 'accent'}
                  >
                    {p.category}
                  </Chip>
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
              <ChevronRight className="size-5 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          ))}
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

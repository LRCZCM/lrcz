import { Button, buttonVariants, Drawer, ScrollShadow, Skeleton } from '@heroui/react'
import { ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useParams } from 'react-router'
import lcmlIcon from '@/assets/lcml-icon.svg'
import { site } from '@/app/site'
import { SiteFooter } from '@/components/SiteFooter'
import { DOWNLOAD_URL, FEEDBACK_URL } from '../release'
import {
  chapterFile,
  INDEX_FILE,
  MANUAL_PATH,
  parseIndex,
  type ManualFile,
  type ManualIndex,
} from './manual'
import { ManualHome } from './ManualHome'
import { ManualNav } from './ManualNav'
import { ManualSearch } from './ManualSearch'
import { ManualToc, ManualTocBar } from './ManualToc'
import { Markdown } from './Markdown'
import { useManualFile } from './useManualFile'

const external = { target: '_blank', rel: 'noopener noreferrer' }

/** LCML 使用手册：`/lcml/manual` 为首页，`/lcml/manual/<章节>` 为各章，内容读自发布仓库。 */
export function ManualPage() {
  const { chapter } = useParams()
  const { pathname, hash, key } = useLocation()
  const reduceMotion = useReducedMotion()
  const indexFile = useManualFile(INDEX_FILE)
  const page = useManualFile(chapter ? chapterFile(chapter) : INDEX_FILE)
  // 记下抽屉是在哪个地址打开的，换页后自然关闭
  const [navOpenAt, setNavOpenAt] = useState<string>()

  const readme = indexFile.state.status === 'done' ? indexFile.state.file : undefined
  const index = useMemo(() => readme && parseIndex(readme), [readme])
  const current = index?.chapters.find((c) => c.id === chapter)
  const pageFile = page.state.status === 'done' ? page.state.file : undefined
  const ready = Boolean(index && pageFile)
  const headings = current && pageFile ? pageFile.headings.filter((h) => h.depth > 1) : []
  // 已显示出来的页面，用于区分“换页”与“本页内跳小节”
  const shownPath = useRef<string>(undefined)

  // 换页直接回到顶部或滚到地址里的 #小节；本页内跳小节平滑滚动。
  // 依赖 key 而不是 hash：再点同一个小节也要滚回去
  useEffect(() => {
    const target = ready && hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null
    const behavior = ready && shownPath.current === pathname && !reduceMotion ? 'smooth' : 'instant'
    if (ready) shownPath.current = pathname
    if (target) target.scrollIntoView({ behavior })
    else scrollTo({ top: 0, behavior })
  }, [pathname, hash, key, ready, reduceMotion])

  if (index && chapter && !current) return <Navigate to={MANUAL_PATH} replace />

  const failed = indexFile.state.status === 'error' || page.state.status === 'error'
  const retry = () => {
    if (indexFile.state.status === 'error') indexFile.retry()
    if (page.state.status === 'error') page.retry()
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <title>{current ? `${current.title} · LCML 使用手册` : 'LCML 使用手册 · 来日创造'}</title>
      <header className="sticky top-0 z-20 border-b border-separator bg-background/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-13 max-w-[1440px] items-center gap-5 px-4 text-sm md:px-6">
          {index && (
            <Drawer
              isOpen={navOpenAt === pathname}
              onOpenChange={(open) => setNavOpenAt(open ? pathname : undefined)}
            >
              <Button
                isIconOnly
                variant="ghost"
                size="sm"
                aria-label="章节"
                className="-ml-1.5 md:hidden"
              >
                <Menu className="size-5" />
              </Button>
              <Drawer.Backdrop>
                <Drawer.Content placement="left" className="w-[min(300px,84vw)]">
                  <Drawer.Dialog aria-label="章节">
                    <Drawer.Body className="py-5">
                      <ManualNav index={index} />
                    </Drawer.Body>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>
          )}
          <Link to="/" className="text-muted transition-colors hover:text-foreground max-md:hidden">
            {site.nameZh}
          </Link>
          <Link to="/lcml" className="flex items-center gap-2 font-semibold">
            <img src={lcmlIcon} alt="" className="size-[22px] rounded-[22%]" />
            LCML
          </Link>
          <Link
            to={MANUAL_PATH}
            className="-ml-2 border-l border-separator pl-3 text-muted transition-colors hover:text-foreground max-md:hidden"
          >
            使用手册
          </Link>
          <div className="ml-auto flex items-center gap-3">
            {index && <ManualSearch index={index} />}
            <a href={DOWNLOAD_URL} {...external} className={buttonVariants({ size: 'sm' })}>
              下载
            </a>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1440px] md:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[272px_minmax(0,1fr)_232px]">
        <aside className="sticky top-13 h-[calc(100svh-52px)] border-r border-separator max-md:hidden">
          <ScrollShadow size={32} className="h-full scrollbar-hover py-6 pr-4 pl-6">
            {index ? <ManualNav index={index} /> : <NavSkeleton />}
          </ScrollShadow>
        </aside>

        <main className="min-w-0 px-4 pt-7 pb-16 md:px-14 md:pt-12 md:pb-24">
          {chapter && !failed && (
            <div className="sticky top-13 z-10 -mx-4 -mt-7 mb-7 border-b border-separator bg-background/80 px-4 backdrop-blur-xl backdrop-saturate-150 md:-mx-14 md:-mt-12 md:mb-10 md:px-14 xl:hidden">
              <div className="mx-auto flex h-11 max-w-[760px] flex-col justify-center">
                {headings.length > 0 && <ManualTocBar key={pathname} headings={headings} />}
              </div>
            </div>
          )}
          <div className="mx-auto max-w-[760px]">
            {failed ? (
              <div className="flex flex-col items-center gap-4 py-20 text-center">
                <p className="text-muted">手册暂时读取失败，请检查网络后重试。</p>
                <Button variant="tertiary" onPress={retry}>
                  重试
                </Button>
              </div>
            ) : index && pageFile ? (
              <motion.article
                key={pathname}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                {current ? (
                  <ChapterView index={index} chapterId={current.id} file={pageFile} />
                ) : (
                  <ManualHome index={index} file={pageFile} />
                )}
              </motion.article>
            ) : (
              <ArticleSkeleton />
            )}
          </div>
        </main>

        <aside className="sticky top-13 h-[calc(100svh-52px)] max-xl:hidden">
          {headings.length > 0 && (
            <ScrollShadow size={32} className="h-full scrollbar-hover py-12 pr-6 pl-2">
              <ManualToc headings={headings} />
            </ScrollShadow>
          )}
        </aside>
      </div>
      <SiteFooter />
    </div>
  )
}

type ChapterViewProps = { index: ManualIndex; chapterId: string; file: ManualFile }

function ChapterView({ index, chapterId, file }: ChapterViewProps) {
  const i = index.chapters.findIndex((c) => c.id === chapterId)
  const prev = index.chapters[i - 1]
  const next = index.chapters[i + 1]
  const pagerClass =
    'group rounded-2xl border border-separator bg-surface px-5 py-4 transition-[translate,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md'

  return (
    <>
      <div className="mb-3 flex items-center gap-1.5 text-[13px] text-muted">
        <Link to={MANUAL_PATH} className="transition-colors hover:text-accent">
          使用手册
        </Link>
        <ChevronRight className="size-3.5 opacity-60" />
        {index.chapters[i].group}
      </div>
      <Markdown file={file} tokens={file.tokens} />

      <nav aria-label="翻页" className="mt-16 grid gap-3 sm:grid-cols-2">
        {prev && (
          <Link to={`${MANUAL_PATH}/${prev.id}`} className={pagerClass}>
            <small className="flex items-center gap-1 text-[13px] text-muted">
              <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              上一章
            </small>
            <b className="mt-1 block text-accent">{prev.title}</b>
          </Link>
        )}
        {next && (
          <Link
            to={`${MANUAL_PATH}/${next.id}`}
            className={`${pagerClass} text-right sm:col-start-2`}
          >
            <small className="flex items-center justify-end gap-1 text-[13px] text-muted">
              下一章
              <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </small>
            <b className="mt-1 block text-accent">{next.title}</b>
          </Link>
        )}
      </nav>
      <p className="mt-8 flex flex-wrap justify-between gap-4 border-t border-separator pt-5 text-[13px] text-muted">
        没找到答案？
        <a href={FEEDBACK_URL} {...external} className="text-accent hover:underline">
          在 Issues 提问
        </a>
      </p>
    </>
  )
}

function NavSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 12 }, (_, i) => (
        <Skeleton
          key={i}
          className="h-5 rounded-lg"
          style={{ width: `${55 + ((i * 17) % 40)}%` }}
        />
      ))}
    </div>
  )
}

function ArticleSkeleton() {
  return (
    <div className="grid gap-4">
      <Skeleton className="mb-4 h-10 w-2/5 rounded-xl" />
      <Skeleton className="h-4 rounded-lg" />
      <Skeleton className="h-4 rounded-lg" />
      <Skeleton className="h-4 w-3/5 rounded-lg" />
      <Skeleton className="mt-6 h-64 rounded-xl" />
    </div>
  )
}

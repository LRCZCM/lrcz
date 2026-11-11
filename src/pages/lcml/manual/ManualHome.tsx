import { Card, Skeleton } from '@heroui/react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { chapterFile, MANUAL_PATH, type Chapter, type ManualFile, type ManualIndex } from './manual'
import { Markdown } from './Markdown'
import { useManualFile } from './useManualFile'

type ManualHomeProps = { index: ManualIndex; file: ManualFile }

/** 手册首页：README 的内容，目录一节换成按分组排列的章节卡片。 */
export function ManualHome({ index, file }: ManualHomeProps) {
  const [first] = index.chapters
  return (
    <>
      <Markdown file={file} tokens={index.before} />
      <Link
        to={`${MANUAL_PATH}/${first.id}`}
        className="mt-7 mb-2 flex items-center gap-4 rounded-2xl bg-accent px-6 py-5 text-accent-foreground transition-transform hover:-translate-y-0.5"
      >
        <span>
          <b className="block text-lg">{first.title}</b>
          <small className="mt-0.5 block text-sm opacity-85">第一次用？几分钟就能进游戏</small>
        </span>
        <ArrowRight className="ml-auto size-5" />
      </Link>
      {index.groups.map((group) => (
        <section key={group.name}>
          <h2 className="mt-9 mb-3 text-[13px] font-semibold text-muted">{group.name}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.chapters.map((chapter) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                number={index.chapters.indexOf(chapter) + 1}
              />
            ))}
          </div>
        </section>
      ))}
      <Markdown file={file} tokens={index.after} />
    </>
  )
}

function ChapterCard({ chapter, number }: { chapter: Chapter; number: number }) {
  const { state } = useManualFile(chapterFile(chapter.id))
  return (
    <Link to={`${MANUAL_PATH}/${chapter.id}`} className="group block rounded-3xl">
      <Card className="h-full transition-[translate,box-shadow] group-hover:-translate-y-0.5 group-hover:shadow-md">
        <Card.Header>
          <Card.Title className="flex items-center gap-2.5 text-base font-semibold">
            <span className="font-mono text-xs text-muted">{String(number).padStart(2, '0')}</span>
            {chapter.title}
          </Card.Title>
          {/* 简介列出这一章的小节；读不到时留空，点进去还能重试 */}
          {state.status === 'loading' ? (
            <Skeleton className="h-[3em] rounded-lg" />
          ) : (
            <Card.Description className="line-clamp-2 min-h-[3em]">
              {state.status === 'done' &&
                state.file.headings
                  .filter((h) => h.depth === 2)
                  .map((h) => h.text)
                  .join(' · ')}
            </Card.Description>
          )}
        </Card.Header>
      </Card>
    </Link>
  )
}

import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { chapters } from './demo/chapters'
import { LauncherDemo } from './demo/LauncherDemo'

// 演示窗口 + 下方章节：自动循环，当前章节显示进度，点哪章从哪章开始
export function DemoSection() {
  const [start, setStart] = useState({ id: chapters[0].id, run: 0 })
  const [current, setCurrent] = useState(chapters[0].id)
  const listRef = useRef<HTMLDivElement>(null)

  // 窄屏下章节横向滚动，当前章节保持在可见区域中间
  useEffect(() => {
    const list = listRef.current!
    const item = list.querySelector<HTMLElement>(`[data-chapter="${current}"]`)!
    list.scrollTo({
      left: item.offsetLeft - (list.clientWidth - item.clientWidth) / 2,
      behavior: 'smooth',
    })
  }, [current])

  return (
    <div className="mx-auto max-w-[1080px] px-4">
      <LauncherDemo start={start} onChapter={setCurrent} />
      <div
        ref={listRef}
        className="relative -mx-4 mt-7 flex snap-x [scrollbar-width:none] gap-3 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-7 lg:overflow-visible lg:px-0"
      >
        {chapters.map((chapter) => {
          const on = chapter.id === current
          return (
            <button
              key={chapter.id}
              type="button"
              data-chapter={chapter.id}
              onClick={() => setStart((s) => ({ id: chapter.id, run: s.run + 1 }))}
              className="relative w-20 shrink-0 cursor-pointer snap-center border-t-2 border-separator pt-3.5 text-left lg:w-auto"
            >
              {on && (
                <motion.i
                  key={start.run}
                  className="absolute -top-0.5 left-0 h-0.5 bg-foreground"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: chapter.duration / 1000, ease: 'linear' }}
                />
              )}
              <b
                className={`block text-[15px] font-semibold transition-colors duration-300 ${on ? 'text-foreground' : 'text-muted'}`}
              >
                {chapter.title}
              </b>
            </button>
          )
        })}
      </div>
      <p className="mt-6 text-center text-xs leading-relaxed text-muted">
        以上动画为网页模拟的界面示意，并非软件实际画面，部分图标与细节会有出入。LCML 基于 JavaFX
        开发。
      </p>
    </div>
  )
}

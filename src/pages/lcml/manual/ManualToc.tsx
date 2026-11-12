import { Button, Dropdown } from '@heroui/react'
import { ArrowUp, ChevronDown, TextAlignStart } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import type { ManualHeading } from './manual'

// 标题滚到顶栏下方这个距离内，就算“正在读”
const ACTIVE_OFFSET = 120

/** 滚动时算出正在读的小节序号。 */
function useActiveHeading(headings: ManualHeading[]) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const update = () => {
      const atBottom = innerHeight + scrollY >= document.documentElement.scrollHeight - 4
      const passed = headings.findLastIndex(
        (h) => document.getElementById(h.id)!.getBoundingClientRect().top < ACTIVE_OFFSET,
      )
      setActive(atBottom ? headings.length - 1 : Math.max(passed, 0))
    }
    update()
    addEventListener('scroll', update, { passive: true })
    return () => removeEventListener('scroll', update)
  }, [headings])

  return active
}

function useScrollToTop() {
  const reduceMotion = useReducedMotion()
  return () => scrollTo({ top: 0, behavior: reduceMotion ? 'instant' : 'smooth' })
}

type ManualTocProps = { headings: ManualHeading[] }

/** 宽屏右侧的“本页目录”，蓝条随滚动滑到当前小节。 */
export function ManualToc({ headings }: ManualTocProps) {
  const active = useActiveHeading(headings)
  const scrollToTop = useScrollToTop()

  return (
    <div className="text-[13px]">
      <b className="mb-2.5 flex items-center gap-2 font-semibold">
        <TextAlignStart className="size-3.5" />
        本页目录
      </b>
      <nav aria-label="本页目录" className="border-l border-separator">
        {headings.map((h, i) => (
          <Link
            key={h.id}
            to={{ hash: h.id }}
            aria-current={i === active ? 'location' : undefined}
            className={`relative block py-1 pr-1 leading-snug transition-colors ${
              h.depth === 3 ? 'pl-6.5' : 'pl-3.5'
            } ${i === active ? 'font-medium text-accent' : 'text-muted hover:text-foreground'}`}
          >
            {i === active && (
              <motion.span
                layoutId="manual-toc-active"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                className="absolute inset-y-0.5 -left-px w-0.5 rounded-full bg-accent"
              />
            )}
            {h.text}
          </Link>
        ))}
      </nav>
      <Button variant="ghost" size="sm" className="mt-3 -ml-3 text-muted" onPress={scrollToTop}>
        <ArrowUp className="size-3.5" />
        回到顶部
      </Button>
    </div>
  )
}

/** 窄屏正文上方吸顶的一行：下拉“本页目录”显示正在读的小节，右边回到顶部。 */
export function ManualTocBar({ headings }: ManualTocProps) {
  const active = useActiveHeading(headings)
  const scrollToTop = useScrollToTop()
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false)

  return (
    <div className="flex items-center gap-2">
      <Dropdown isOpen={isOpen} onOpenChange={setOpen}>
        <Button variant="ghost" size="sm" className="-ml-3 min-w-0 text-muted">
          <TextAlignStart className="size-4 shrink-0" />
          <span className="shrink-0">本页目录</span>
          <ChevronDown
            className={`size-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="truncate font-medium text-foreground"
          >
            {headings[active].text}
          </motion.span>
        </Button>
        <Dropdown.Popover placement="bottom start" className="max-w-[min(360px,90vw)] min-w-56">
          <Dropdown.Menu aria-label="本页目录" onAction={(key) => navigate({ hash: String(key) })}>
            {headings.map((h, i) => (
              <Dropdown.Item
                key={h.id}
                id={h.id}
                textValue={h.text}
                className={`${h.depth === 3 ? 'pl-6' : ''} ${i === active ? 'font-medium text-accent' : ''}`}
              >
                {h.text}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown.Popover>
      </Dropdown>
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        aria-label="回到顶部"
        className="-mr-2 ml-auto text-muted"
        onPress={scrollToTop}
      >
        <ArrowUp className="size-4" />
      </Button>
    </div>
  )
}

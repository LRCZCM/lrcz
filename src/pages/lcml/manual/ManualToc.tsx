import { Button } from '@heroui/react'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import type { ManualHeading } from './manual'

// 标题滚到顶栏下方这个距离内，就算“正在读”
const ACTIVE_OFFSET = 120

type ManualTocProps = { headings: ManualHeading[] }

/** 右侧“本页目录”，滚动时高亮当前小节。 */
export function ManualToc({ headings }: ManualTocProps) {
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

  return (
    <div className="text-[13px]">
      <b className="mb-2.5 block font-semibold">本页目录</b>
      <nav aria-label="本页目录" className="border-l border-separator">
        {headings.map((h, i) => (
          <Link
            key={h.id}
            to={{ hash: h.id }}
            aria-current={i === active ? 'location' : undefined}
            className={`-ml-px block border-l-2 py-1 leading-snug transition-colors ${
              h.depth === 3 ? 'pl-6.5' : 'pl-3.5'
            } ${
              i === active
                ? 'border-accent font-medium text-accent'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            {h.text}
          </Link>
        ))}
      </nav>
      <Button
        variant="ghost"
        size="sm"
        className="mt-3 -ml-3 text-muted"
        onPress={() => scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <ArrowUp className="size-3.5" />
        回到顶部
      </Button>
    </div>
  )
}

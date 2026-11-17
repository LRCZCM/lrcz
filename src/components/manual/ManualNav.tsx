import { BookOpen } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useId, useRef } from 'react'
import { NavLink, useLocation } from 'react-router'
import { useManualSource, type ManualIndex } from './manual'

type ManualNavProps = { index: ManualIndex }

/** 左侧章节导航；桌面端在侧栏，手机端在抽屉里。当前章节的蓝条随换章滑动。 */
export function ManualNav({ index }: ManualNavProps) {
  const { pathname } = useLocation()
  const { path, groupIcons } = useManualSource()
  const ref = useRef<HTMLElement>(null)
  // 侧栏与抽屉各有一份导航，蓝条各滑各的
  const barId = useId()

  // 从别处跳到靠下的章节时，把它滚进侧栏可见范围
  useEffect(() => {
    ref.current!.querySelector('[aria-current="page"]')!.scrollIntoView({ block: 'nearest' })
  }, [pathname])

  return (
    <nav ref={ref} aria-label="章节" className="text-sm">
      <NavLink
        to={path}
        end
        className={({ isActive }) =>
          `flex scroll-my-12 items-center gap-2.5 rounded-lg px-2 py-1.5 font-semibold transition-colors hover:bg-default ${
            isActive ? 'text-accent' : 'text-foreground'
          }`
        }
      >
        <BookOpen className="size-4" />
        手册首页
      </NavLink>
      {index.groups.map((group) => {
        const Icon = groupIcons[group.name] ?? BookOpen
        return (
          <div key={group.name} className="mt-5">
            <b className="flex items-center gap-2.5 px-2 pb-1.5 text-xs font-semibold text-muted">
              <Icon className="size-4" />
              {group.name}
            </b>
            <div className="ml-4 border-l border-separator">
              {group.chapters.map((chapter) => (
                <NavLink
                  key={chapter.id}
                  to={`${path}/${chapter.id}`}
                  className={({ isActive }) =>
                    `group relative block scroll-my-12 py-[5px] pr-2 pl-4 leading-snug transition-colors ${
                      isActive ? 'font-medium text-accent' : 'text-muted hover:text-foreground'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId={barId}
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                          className="absolute inset-y-1 -left-px w-0.5 rounded-full bg-accent"
                        />
                      )}
                      <span className="block transition-transform duration-200 group-hover:translate-x-0.5">
                        {chapter.title}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        )
      })}
    </nav>
  )
}

import { NavLink } from 'react-router'
import { MANUAL_PATH, type ManualIndex } from './manual'

const linkClass =
  (idle: string) =>
  ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg px-2.5 py-1.5 text-sm leading-snug transition-colors hover:bg-default ${
      isActive ? 'bg-accent-soft font-semibold text-accent-soft-foreground' : idle
    }`
const homeClass = linkClass('font-semibold text-foreground')
const chapterClass = linkClass('text-muted hover:text-foreground')

type ManualNavProps = { index: ManualIndex }

/** 左侧章节导航；桌面端在侧栏，手机端在抽屉里。 */
export function ManualNav({ index }: ManualNavProps) {
  return (
    <nav aria-label="章节">
      <NavLink to={MANUAL_PATH} end className={homeClass}>
        手册首页
      </NavLink>
      {index.groups.map((group) => (
        <div key={group.name} className="mt-5">
          <b className="block px-2.5 pb-1.5 text-xs font-semibold text-muted/70">{group.name}</b>
          {group.chapters.map((chapter) => (
            <NavLink key={chapter.id} to={`${MANUAL_PATH}/${chapter.id}`} className={chapterClass}>
              {chapter.title}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}

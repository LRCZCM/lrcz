import { useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { site } from '@/app/site'

const year = new Date().getFullYear()
// 滚轮事件间隔超过这么久，算作新的一次滚动（触控板惯性的事件间隔远小于此）
const GESTURE_GAP = 300

const linkClass = 'transition-colors hover:text-foreground'

/** 页脚。滚轮或触控板一次滚动最多停在页脚上方，停一下再滚才露出页脚；触屏与键盘照常滚动。 */
export function SiteFooter() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    let lastWheel = -Infinity
    let startedAbove = false
    // 页脚顶边刚好贴住窗口底边时的滚动位置
    const boundary = () => ref.current!.getBoundingClientRect().top + scrollY - innerHeight
    const holding = () => startedAbove && performance.now() - lastWheel < GESTURE_GAP

    const onWheel = (e: WheelEvent) => {
      if (e.timeStamp - lastWheel > GESTURE_GAP) startedAbove = scrollY < boundary() - 1
      lastWheel = e.timeStamp
      if (e.deltaY <= 0 || e.ctrlKey || !startedAbove || scrollsInside(e.target)) return
      const stop = boundary()
      if (scrollY + wheelPixels(e) < stop) return
      e.preventDefault()
      scrollTo({ top: stop, behavior: reduceMotion ? 'instant' : 'smooth' })
    }
    // 浏览器的平滑滚动可能已冲过边界，拉回来
    const onScroll = () => {
      const stop = boundary()
      if (holding() && scrollY > stop) scrollTo({ top: stop, behavior: 'instant' })
    }

    addEventListener('wheel', onWheel, { passive: false })
    addEventListener('scroll', onScroll, { passive: true })
    return () => {
      removeEventListener('wheel', onWheel)
      removeEventListener('scroll', onScroll)
    }
  }, [reduceMotion])

  return (
    <footer
      ref={ref}
      className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-separator px-4 py-5 text-xs text-muted"
    >
      <span>
        © {year} {site.author}
      </span>
      <a href={`mailto:${site.email}`} className={linkClass}>
        {site.email}
      </a>
      <a href={site.icpUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {site.icp}
      </a>
    </footer>
  )
}

// 滚轮的 deltaY 可能以行或页为单位
function wheelPixels(e: WheelEvent) {
  return e.deltaMode === 1 ? e.deltaY * 40 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY
}

// 滚轮落在侧栏、弹窗列表等还能往下滚的区域里时，滚的是那个区域，不是页面；
// 弹窗打开时页面被锁住，也不处理
function scrollsInside(target: EventTarget | null) {
  if (getComputedStyle(document.documentElement).overflowY === 'hidden') return true
  let el = target instanceof Element ? target : null
  for (; el && el !== document.body; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el)
    const scrollable = overflowY === 'auto' || overflowY === 'scroll'
    if (scrollable && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true
  }
  return false
}

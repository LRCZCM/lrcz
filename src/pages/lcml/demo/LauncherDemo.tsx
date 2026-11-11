import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import dusk from '../assets/dusk.jpg'
import meadow from '../assets/meadow.jpg'
import night from '../assets/night.jpg'
import { chapters, type Director } from './chapters'
import { BottomBar, TitleBar } from './Chrome'
import { DownloadView } from './DownloadView'
import { Character, Home, Onboard, OfflineDialog } from './HomeViews'
import { InstancesView } from './InstancesView'
import { SettingsView, SkinsView } from './PanelViews'
import { baseState, STAGE_HEIGHT, STAGE_WIDTH, type DemoState } from './state'
import { themeTokens } from './tokens'

const wallpapers = { meadow, dusk, night }

type LauncherDemoProps = {
  // 从哪一章开始循环播放；换成新对象即重新开始
  start: { id: string }
  onChapter: (id: string) => void
}

// LCML 启动器界面的复原动画：按章节脚本自动操作，循环播放
export function LauncherDemo({ start, onChapter }: LauncherDemoProps) {
  const frameRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [state, setState] = useState<DemoState>(baseState)
  const [cursor, setCursor] = useState({ x: 760, y: 420 })
  const [clicks, setClicks] = useState(0)

  useEffect(() => {
    const frame = frameRef.current!
    const observer = new ResizeObserver(() => setScale(frame.clientWidth / STAGE_WIDTH))
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const stage = stageRef.current!
    const timers = new Set<number>()
    // 卸载或换章时清掉计时器，正在等待的脚本就此停住
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        const id = window.setTimeout(() => {
          timers.delete(id)
          resolve()
        }, ms)
        timers.add(id)
      })
    const director: Director = {
      set: (patch) =>
        setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) })),
      wait,
      place: (x, y) => setCursor({ x, y }),
      async click(target, moveMs = 750) {
        await wait(40)
        const el = stage.querySelector(`[data-demo="${target}"]`)!
        const r = el.getBoundingClientRect()
        const b = stage.getBoundingClientRect()
        const s = b.width / STAGE_WIDTH
        setCursor({ x: (r.left - b.left + r.width / 2) / s, y: (r.top - b.top + r.height / 2) / s })
        await wait(moveMs)
        setClicks((n) => n + 1)
        el.animate([{ scale: 1 }, { scale: 0.96 }, { scale: 1 }], { duration: 220 })
        await wait(160)
      },
    }
    const index = chapters.findIndex((c) => c.id === start.id)
    const order = [...chapters.slice(index), ...chapters.slice(0, index)]
    void (async () => {
      for (;;) {
        for (const chapter of order) {
          onChapter(chapter.id)
          const begin = performance.now()
          await chapter.run(director)
          await wait(Math.max(0, chapter.duration - (performance.now() - begin)))
        }
      }
    })()
    return () => timers.forEach((id) => window.clearTimeout(id))
  }, [start, onChapter])

  return (
    <div
      ref={frameRef}
      role="img"
      aria-label="LCML 启动器界面演示"
      className="relative aspect-[1100/660] w-full overflow-hidden rounded-[14px] bg-neutral-300 shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_30px_80px_-20px_rgba(0,0,0,0.35),0_12px_30px_-10px_rgba(0,0,0,0.2)] select-none max-sm:rounded-lg"
    >
      <div
        ref={stageRef}
        className="absolute top-0 left-0 origin-top-left overflow-hidden font-['Microsoft_YaHei_UI','Microsoft_YaHei','PingFang_SC',sans-serif] text-sm text-(--lm-text) transition-colors duration-500"
        style={{
          ...themeTokens[state.theme],
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {Object.entries(wallpapers).map(([theme, src]) => (
          <img
            key={theme}
            src={src}
            alt=""
            className={`absolute inset-0 size-full object-cover transition-opacity duration-[900ms] ${state.theme === theme ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        <TitleBar state={state} />
        <div className="absolute inset-x-0 top-10 bottom-[78px]">
          <Onboard shown={state.page === 'onboard'} />
          <Home shown={state.page === 'home'} />
          <Character state={state} />
          <InstancesView state={state} />
          <DownloadView state={state} />
          <SkinsView state={state} />
          <SettingsView state={state} />
        </div>
        <BottomBar state={state} />
        <OfflineDialog state={state} />
        <motion.div
          className="pointer-events-none absolute top-0 left-0 z-30 size-[22px] drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
          initial={false}
          animate={{ x: cursor.x - 4, y: cursor.y - 2 }}
          transition={{ duration: 0.7, ease: [0.45, 0, 0.2, 1] }}
        >
          {clicks > 0 && (
            <motion.span
              key={clicks}
              className="absolute -top-3.5 -left-3.5 size-[30px] rounded-full bg-[#3b82f6]/35"
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          )}
          <svg viewBox="0 0 22 22" className="relative size-[22px]">
            <path
              d="M4 2v17l4.5-4.2 3 6.7 2.7-1.2-2.9-6.6 6-.4z"
              fill="#111"
              stroke="#fff"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  )
}

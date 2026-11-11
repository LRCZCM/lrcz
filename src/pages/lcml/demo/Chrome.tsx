import {
  ArrowRightLeft,
  Box,
  Check,
  Download,
  House,
  Minus,
  Play,
  Shirt,
  Square,
  Wrench,
  X,
} from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import headMe from '../assets/head-me.png'
import type { DemoState, Page } from './state'
import { ic } from './tokens'
import { Panel } from './ui'

// 标题栏：左侧产品名，居中灵动岛，右侧窗口按钮
export function TitleBar({ state }: { state: DemoState }) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 flex h-10 items-center pl-[18px] text-[15px] font-bold">
      LCML
      <Island state={state} />
      <div className="ml-auto flex">
        {[Minus, Square, X].map((Icon, i) => (
          <span key={i} className="grid h-10 w-[46px] place-items-center">
            <Icon className="size-[15px]" strokeWidth={1.2} />
          </span>
        ))}
      </div>
    </div>
  )
}

function Island({ state }: { state: DemoState }) {
  const { launch, launchProgress, task } = state
  const game = launch === 'preparing' || launch === 'running'
  const shown = game || task !== null
  const label = game ? '26.3-Fabric' : (task?.label ?? '')
  const progress = game ? launchProgress : (task?.progress ?? 0)
  const value = launch === 'running' ? '运行中' : !game && task?.done ? '已完成' : `${progress}%`

  return (
    <div
      className={`absolute top-1.5 left-1/2 flex h-7 items-center gap-2 rounded-full bg-[#0b0b0c] pr-3 pl-2 text-xs font-normal whitespace-nowrap text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${shown ? '-translate-x-1/2 scale-100 opacity-100' : '-translate-x-1/2 scale-75 opacity-0'}`}
    >
      {launch === 'running' ? (
        <span className="mx-1 size-2 animate-pulse rounded-full bg-[#34d17a]" />
      ) : !game && task?.done ? (
        <Check className="size-4 text-[#34d17a]" strokeWidth={2.4} />
      ) : (
        <svg viewBox="0 0 20 20" className="size-4 -rotate-90">
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="rgba(255,255,255,.2)"
            strokeWidth="2.5"
          />
          <circle
            cx="10"
            cy="10"
            r="8"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="50.3"
            strokeDashoffset={50.3 * (1 - progress / 100)}
          />
        </svg>
      )}
      <span>{label}</span>
      <span className="text-white/60 tabular-nums">{value}</span>
    </div>
  )
}

const navItems = [
  { page: 'home', label: '主页', Icon: House, demo: 'nav-home' },
  { page: 'instances', label: '实例', Icon: Box, demo: 'nav-instances' },
  { page: 'download', label: '下载', Icon: Download, demo: 'nav-download' },
  { page: 'skins', label: '皮肤', Icon: Shirt, demo: 'nav-skins' },
  { page: 'tools', label: '工具', Icon: Wrench, demo: 'nav-tools' },
  { page: 'settings', label: '设置', Icon: ArrowRightLeft, demo: 'nav-settings' },
]

function navOf(page: Page) {
  return page === 'onboard' ? 'home' : page
}

// 底部栏：导航、当前账号、启动按钮
export function BottomBar({ state }: { state: DemoState }) {
  const active = navOf(state.page)
  const navRef = useRef<HTMLDivElement>(null)
  const [pill, setPill] = useState({ left: 0, width: 0 })

  // 选中块按选中项的布局位置滑动（不受外层缩放影响）
  useLayoutEffect(() => {
    const item = navRef.current!.querySelector<HTMLElement>(`[data-page="${active}"]`)!
    setPill({ left: item.offsetLeft, width: item.offsetWidth })
  }, [active])

  return (
    <Panel className="absolute inset-x-3 bottom-2.5 z-[3] flex h-[60px] items-center px-2">
      <div ref={navRef} className="relative flex gap-0.5">
        <span
          className="absolute h-10 rounded-full bg-(--lm-primary) transition-[left,width,background-color] duration-[400ms] ease-[cubic-bezier(0.32,0.72,0,1)]"
          style={pill}
        />
        {navItems.map(({ page, label, Icon, demo }) => (
          <span
            key={page}
            data-page={page}
            data-demo={demo}
            className={`relative flex h-10 items-center gap-[7px] rounded-full px-3.5 text-[13px] transition-colors duration-300 ${page === active ? 'text-(--lm-on-primary)' : 'text-(--lm-text2)'}`}
          >
            <Icon {...ic} />
            {label}
          </span>
        ))}
      </div>
      <div className="ml-auto flex h-11 items-center gap-2.5 rounded-[14px] pr-2.5 pl-1.5">
        <span className="size-8 overflow-hidden rounded-lg bg-(--lm-default)">
          <img
            src={headMe}
            alt=""
            className={`size-full transition-opacity duration-300 [image-rendering:pixelated] ${state.account ? 'opacity-100' : 'opacity-0'}`}
          />
        </span>
        <span className="leading-tight">
          <b className="block text-sm">{state.account ? 'LRCZCM' : '添加账号'}</b>
          <small className="text-xs text-(--lm-text2)">
            {state.account ? '离线账号' : '还没有账号'}
          </small>
        </span>
      </div>
      <LaunchButton state={state} />
    </Panel>
  )
}

function LaunchButton({ state }: { state: DemoState }) {
  const { launch, launchProgress } = state
  return (
    <span
      data-demo="launch"
      className={`relative ml-2.5 grid h-11 w-[180px] place-items-center overflow-hidden rounded-full transition-[background-color,opacity] duration-300 ${launch === 'running' ? 'bg-(--lm-success) text-white' : 'bg-(--lm-primary) text-(--lm-on-primary)'} ${launch === 'disabled' ? 'opacity-40' : ''}`}
    >
      {launch === 'preparing' && (
        <i
          className="absolute inset-y-0 left-0 bg-white/20"
          style={{ width: `${launchProgress}%` }}
        />
      )}
      <span className="relative flex items-center gap-2 text-[15px] leading-tight font-bold">
        {launch === 'preparing' ? (
          <span>
            准备中 {launchProgress}%
            <small className="block text-[11px] font-normal opacity-80">点击取消</small>
          </span>
        ) : launch === 'running' ? (
          <>
            <Square className="size-3.5" fill="currentColor" strokeWidth={0} />
            <span>
              运行中
              <small className="block text-[11px] font-normal opacity-80">点击结束游戏</small>
            </span>
          </>
        ) : (
          <>
            <Play className="size-3.5" fill="currentColor" strokeWidth={0} />
            启动游戏
          </>
        )}
      </span>
    </span>
  )
}

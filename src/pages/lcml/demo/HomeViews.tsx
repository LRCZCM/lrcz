import { ArrowRightLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import fabric from '../assets/fabric.png'
import meBig from '../assets/me-big.png'
import meadow from '../assets/meadow.jpg'
import zuriBig from '../assets/zuri-big.png'
import type { DemoState } from './state'
import { fade, ic } from './tokens'
import { Btn, Pixel } from './ui'

const steps = [
  {
    title: '添加账号',
    text: '正版账号能进正版服务器、使用皮肤；离线账号无需登录，适合单人游戏。',
  },
  { title: '准备一个实例', text: '使用已有的游戏版本，或新建实例、导入整合包。' },
  { title: '启动游戏', text: '前两步完成后，点右下角的启动游戏。' },
]

// 首次启动的引导卡片
export function Onboard({ shown }: { shown: boolean }) {
  return (
    <div
      className={`absolute bottom-10 left-11 w-[520px] rounded-3xl bg-(--lm-overlay) px-[22px] pt-6 pb-[18px] shadow-[0_8px_24px_rgba(0,0,0,0.12)] ${fade} ${shown ? '' : 'pointer-events-none translate-y-4 opacity-0'}`}
    >
      <h3 className="text-xl font-bold">开始使用 LCML</h3>
      <p className="mt-1.5 mb-3.5 text-xs text-(--lm-text2)">三步进入游戏，之后都能在设置里改。</p>
      {steps.map((step, i) => (
        <div
          key={step.title}
          className={`grid grid-cols-[26px_1fr] gap-x-3.5 gap-y-0.5 border-(--lm-sep) py-3 ${i ? 'border-t opacity-55' : ''}`}
        >
          <span
            className={`row-span-3 grid size-[26px] place-items-center rounded-full text-xs font-bold ${i ? 'bg-(--lm-default) text-(--lm-muted)' : 'bg-(--lm-primary) text-(--lm-on-primary)'}`}
          >
            {i + 1}
          </span>
          <b className="text-sm">{step.title}</b>
          <span className="text-xs text-(--lm-text2)">{step.text}</span>
          {i === 0 && (
            <span className="mt-2.5 flex gap-2">
              <Btn primary>正版登录</Btn>
              <Btn demo="add-offline">添加离线账号</Btn>
              <Btn>第三方登录</Btn>
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

const glow = '[text-shadow:0_0_24px_var(--lm-glow),0_1px_2px_var(--lm-glow)]'

// 主页：当前实例的大字名称、固定到主页的存档与服务器
export function Home({ shown }: { shown: boolean }) {
  return (
    <div
      className={`absolute bottom-[22px] left-11 ${fade} ${shown ? '' : 'pointer-events-none translate-y-5 opacity-0'}`}
    >
      <div className={`flex items-center gap-4 text-[56px] leading-[1.1] font-bold ${glow}`}>
        <Pixel src={fabric} size={52} />
        26.3-Fabric
      </div>
      <div className={`mt-2.5 flex items-center gap-3 text-sm ${glow}`}>
        正式版 · 基于 26.3
        <Btn>
          <ArrowRightLeft {...ic} />
          切换实例
        </Btn>
      </div>
      <div className="mt-[18px] flex gap-2.5">
        <PinCard
          image={<img src={meadow} alt="" className="size-[38px] rounded-lg object-cover" />}
          title="生存世界"
          text="进入世界"
        />
        <PinCard
          image={
            <span className="size-[38px] rounded-lg bg-linear-135 from-[#6b4bd8] to-[#2d1f63]" />
          }
          title="play.example.net"
          text="加入服务器"
        />
      </div>
    </div>
  )
}

function PinCard({ image, title, text }: { image: ReactNode; title: string; text: string }) {
  return (
    <div className="flex h-[54px] w-[210px] items-center gap-2.5 rounded-[20px] bg-(--lm-panel) px-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-colors duration-500">
      {image}
      <span className="leading-tight">
        <b className="block text-sm">{title}</b>
        <small className="text-xs text-(--lm-text2)">{text}</small>
      </span>
    </div>
  )
}

// 主页与皮肤页右侧的三维人物
export function Character({ state }: { state: DemoState }) {
  const hidden =
    !state.account ||
    state.page === 'settings' ||
    state.page === 'instances' ||
    state.page === 'download'
  const large = state.page === 'skins'
  return (
    <div
      className={`absolute bottom-2.5 w-40 drop-shadow-[0_18px_14px_rgba(0,0,0,0.25)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${large ? 'right-40 h-[360px]' : 'right-[150px] h-[300px]'} ${hidden ? 'translate-y-3 opacity-0' : ''}`}
    >
      {[meBig, zuriBig].map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`absolute right-0 bottom-0 h-full transition-opacity duration-300 ${(state.skin === 'zuri') === (i === 1) ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  )
}

// 添加离线账号对话框
export function OfflineDialog({ state }: { state: DemoState }) {
  const open = state.dialog
  return (
    <>
      <div
        className={`absolute inset-0 z-20 bg-black/40 transition-opacity duration-200 ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />
      <div
        className={`absolute top-1/2 left-1/2 z-20 w-[400px] -translate-x-1/2 rounded-3xl bg-(--lm-overlay) p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-[opacity,transform] duration-300 ${open ? '-translate-y-1/2 opacity-100' : 'pointer-events-none -translate-y-[46%] scale-[0.96] opacity-0'}`}
      >
        <h4 className="text-lg font-bold">添加离线账号</h4>
        <p className="mt-1 mb-[18px] text-xs text-(--lm-text2)">只能进入单人游戏和离线服务器</p>
        <label className="mt-3 mb-1.5 block text-[13px]">玩家名称</label>
        <div
          data-demo="player-name"
          className={`flex h-8 items-center rounded-xl bg-(--lm-default) px-3 text-[13px] ${state.nameFocused ? 'ring-2 ring-[#3b82f6]' : ''}`}
        >
          {state.playerName ||
            (!state.nameFocused && <span className="text-(--lm-muted)">例如 Steve</span>)}
          {state.nameFocused && <i className="ml-px h-4 w-px animate-pulse bg-current" />}
        </div>
        <label className="mt-3 mb-1.5 block text-[13px]">UUID</label>
        <div className="flex h-8 items-center rounded-xl bg-(--lm-default) px-3 text-[13px] text-(--lm-muted)">
          留空则按名称生成，与游戏离线模式一致
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Btn>取消</Btn>
          <Btn primary demo="offline-add">
            添加
          </Btn>
        </div>
      </div>
    </>
  )
}

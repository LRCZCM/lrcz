import {
  Box,
  Contrast,
  Download,
  Folder,
  Info,
  RotateCw,
  Search,
  Upload,
  User,
  X,
} from 'lucide-react'
import alex from '../assets/alex.png'
import ari from '../assets/ari.png'
import dusk from '../assets/dusk.jpg'
import efe from '../assets/efe.png'
import kai from '../assets/kai.png'
import meadow from '../assets/meadow.jpg'
import me from '../assets/me.png'
import night from '../assets/night.jpg'
import steve from '../assets/steve.png'
import sunny from '../assets/sunny.png'
import zuri from '../assets/zuri.png'
import type { DemoState, Theme } from './state'
import { fade, ic } from './tokens'
import { Btn, Card, Group, Panel, Seg } from './ui'

const defaultSkins = [
  ['zuri', 'Zuri', zuri],
  ['alex', 'Alex', alex],
  ['ari', 'Ari', ari],
  ['efe', 'Efe', efe],
  ['kai', 'Kai', kai],
  ['steve', 'Steve', steve],
  ['sunny', 'Sunny', sunny],
]

// 皮肤页：左侧皮肤面板，右侧人物随选中的皮肤变化
export function SkinsView({ state }: { state: DemoState }) {
  const shown = state.page === 'skins'
  return (
    <Panel
      className={`absolute top-2 bottom-0 left-3.5 w-[548px] overflow-hidden px-4 py-3.5 ${fade} ${shown ? '' : 'pointer-events-none -translate-x-6 opacity-0'}`}
    >
      <div className="flex items-center gap-2">
        <Seg items={['皮肤', '披风']} active={0} />
        <span className="ml-auto grid size-8 place-items-center">
          <RotateCw {...ic} />
        </span>
        <span className="grid size-8 place-items-center">
          <X {...ic} />
        </span>
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        <Seg items={['宽臂', '纤细']} active={0} />
        <span className="ml-auto flex gap-2">
          <Btn>
            <Upload {...ic} />
            添加皮肤
          </Btn>
          <Btn>
            <User {...ic} />
            从玩家名导入
          </Btn>
          <Btn>
            <Folder {...ic} />
            打开文件夹
          </Btn>
        </span>
      </div>
      <Group className="mt-3.5 mb-2">我的皮肤</Group>
      <div className="grid grid-cols-4 gap-2">
        <SkinTile id="me" name="LRCZCM" src={me} on={state.skin === 'me'} />
      </div>
      <Group className="mt-3.5 mb-2">默认皮肤</Group>
      <div className="grid grid-cols-4 gap-2">
        {defaultSkins.map(([id, name, src]) => (
          <SkinTile key={id} id={id} name={name} src={src} on={state.skin === id} />
        ))}
      </div>
    </Panel>
  )
}

function SkinTile({ id, name, src, on }: { id: string; name: string; src: string; on: boolean }) {
  return (
    <div
      data-demo={`skin-${id}`}
      className={`relative flex h-[114px] flex-col items-center justify-end gap-1.5 rounded-[20px] bg-(--lm-card) pb-2.5 text-[13px] shadow-[0_1px_3px_rgba(0,0,0,0.08)] outline-2 -outline-offset-2 transition-[outline-color] duration-200 ${on ? 'outline-(--lm-primary)' : 'outline-transparent'}`}
    >
      <em
        className={`absolute top-2 left-2 rounded-full bg-(--lm-success)/15 px-2 text-[11px] text-(--lm-success) not-italic transition-opacity duration-200 ${on ? 'opacity-100' : 'opacity-0'}`}
      >
        使用中
      </em>
      <img src={src} alt="" className="h-[66px]" />
      {name}
    </div>
  )
}

const presets: { id: Theme; name: string; hint: string; src: string }[] = [
  { id: 'meadow', name: '原野', hint: '春日樱树，白色面板', src: meadow },
  { id: 'dusk', name: '暮色', hint: '黄昏晚霞，暖色面板', src: dusk },
  { id: 'night', name: '夜幕', hint: '海上月夜，紫调面板', src: night },
]

const accents = ['#242424', '#3b82f6', '#a78bfa', '#ec4899', '#f08a3c', '#22a35a']
const tints = ['#d4d4d4', '#d9c6a5', '#a9c2a0', '#a6bccf', '#b9a6d1', '#e2b3c3']
const accentOf: Record<Theme, number> = { meadow: 0, dusk: 4, night: 2 }
const tintOf: Record<Theme, number> = { meadow: 0, dusk: 1, night: 4 }

// 设置页的“外观”分类
export function SettingsView({ state }: { state: DemoState }) {
  const shown = state.page === 'settings'
  const sections = [
    ['游戏', Box],
    ['下载', Download],
    ['外观', Contrast],
    ['关于', Info],
  ] as const
  return (
    <Panel
      className={`absolute top-2 right-3.5 bottom-0 left-3.5 flex overflow-hidden ${fade} ${shown ? '' : 'pointer-events-none -translate-x-6 opacity-0'}`}
    >
      <div className="flex w-[200px] flex-col gap-1 border-r border-(--lm-sep) p-2.5">
        <div className="mb-1.5 flex h-[30px] items-center gap-1.5 rounded-xl bg-(--lm-field) px-2.5 text-xs text-(--lm-muted) shadow-[inset_0_0_0_1px_var(--lm-edge)]">
          <Search className="size-3.5" strokeWidth={1.6} />
          搜索设置
        </div>
        {sections.map(([label, Icon]) => (
          <span
            key={label}
            className={`flex h-[34px] items-center gap-2 rounded-[14px] px-3 ${label === '外观' ? 'bg-(--lm-default)' : 'text-(--lm-text2)'}`}
          >
            <Icon {...ic} />
            {label}
          </span>
        ))}
      </div>
      <div className="max-w-[760px] flex-1 px-[22px] py-[18px]">
        <h4 className="text-lg font-bold">外观</h4>
        <Group className="mt-3 mb-2">预设</Group>
        <div className="flex gap-2">
          {presets.map((p) => (
            <div
              key={p.id}
              data-demo={`preset-${p.id}`}
              className={`flex-1 rounded-[20px] bg-(--lm-card) p-1.5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] outline-2 -outline-offset-2 transition-[outline-color] duration-300 ${state.theme === p.id ? 'outline-(--lm-primary)' : 'outline-transparent'}`}
            >
              <img src={p.src} alt="" className="h-[92px] w-full rounded-[14px] object-cover" />
              <b className="mx-1.5 mt-2 block text-sm">{p.name}</b>
              <small className="mx-1.5 mb-1 block text-xs text-(--lm-text2)">{p.hint}</small>
            </div>
          ))}
        </div>
        <Card className="mt-2">
          <Row title="颜色模式">
            <Seg items={['跟随系统', '浅色', '深色']} active={state.theme === 'meadow' ? 0 : 2} />
          </Row>
          <Row title="主题色" divided>
            <Dots colors={accents} active={accentOf[state.theme]} />
          </Row>
          <Row title="面板颜色" divided>
            <Dots colors={tints} active={tintOf[state.theme]} />
          </Row>
          <Row title="背景" divided>
            <Seg items={['图片', '亚克力', '云母', '纯色']} active={0} />
          </Row>
        </Card>
      </div>
    </Panel>
  )
}

function Row({
  title,
  divided,
  children,
}: {
  title: string
  divided?: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`flex min-h-14 items-center justify-between px-5 ${divided ? 'border-t border-(--lm-sep)' : ''}`}
    >
      <span className="text-sm">{title}</span>
      {children}
    </div>
  )
}

function Dots({ colors, active }: { colors: string[]; active: number }) {
  return (
    <span className="flex gap-2">
      {colors.map((c, i) => (
        <i
          key={c}
          className={`size-5 rounded-full transition-shadow duration-300 ${i === active ? 'shadow-[0_0_0_2px_var(--lm-overlay),0_0_0_4px_var(--lm-primary)]' : ''}`}
          style={{ background: c }}
        />
      ))}
    </span>
  )
}

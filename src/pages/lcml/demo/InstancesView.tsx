import {
  Archive,
  ArrowUpDown,
  ChevronDown,
  Download,
  Ellipsis,
  FileText,
  Folder,
  List,
  Pin,
  Play,
  Plus,
  RotateCw,
  Trash2,
} from 'lucide-react'
import { motion } from 'motion/react'
import fabric from '../assets/fabric.png'
import grass from '../assets/grass.png'
import meadow from '../assets/meadow.jpg'
import type { DemoState, InstanceTab } from './state'
import { fade, ic } from './tokens'
import { Btn, Card, Field, Group, IconBtn, Panel, Pixel, Seg, Switch, Tile } from './ui'

const instances = [
  { group: '测试（1）' },
  { name: '1.12.2', icon: grass, note: '正式版' },
  { group: '未分组（5）' },
  { name: '26.3-Fabric', icon: fabric, note: '正式版 · 基于 26.3', selected: true },
  { name: '1.21.11', icon: grass, note: '正式版' },
  { name: '26.1', icon: grass, note: '正式版' },
  { name: '26.1-Fabric', icon: fabric, note: '正式版 · 基于 26.1' },
  { name: '1.20.1', icon: grass, note: '正式版' },
]

const tabs: { id: InstanceTab; label: string }[] = [
  { id: 'overview', label: '概览' },
  { id: 'mods', label: '模组 7' },
  { id: 'resourcepacks', label: '资源包' },
  { id: 'shaderpacks', label: '光影包 1' },
  { id: 'worlds', label: '存档 1' },
  { id: 'servers', label: '服务器 1' },
  { id: 'screenshots', label: '截图 1' },
  { id: 'schematics', label: '投影' },
  { id: 'settings', label: '设置' },
]

// 实例页：左侧实例列表，右侧当前实例的标签页
export function InstancesView({ state }: { state: DemoState }) {
  const shown = state.page === 'instances'
  const tab = state.instanceTab
  return (
    <div
      className={`absolute inset-0 ${fade} ${shown ? '' : 'pointer-events-none -translate-x-6 opacity-0'}`}
    >
      <Panel className="absolute top-2 bottom-0 left-3.5 flex w-[248px] flex-col gap-2 overflow-hidden p-2.5">
        <div className="flex h-9 items-center gap-2 rounded-[14px] bg-(--lm-default) px-3 text-[13px]">
          <Folder {...ic} />
          .minecraft · 6 个实例
          <ChevronDown {...ic} className="ml-auto size-4" />
        </div>
        <div className="flex gap-1.5">
          <Field className="min-w-0 flex-1 text-(--lm-muted)">搜索实例</Field>
          <IconBtn>
            <ArrowUpDown {...ic} />
          </IconBtn>
          <IconBtn>
            <Download {...ic} />
          </IconBtn>
          <IconBtn>
            <Plus {...ic} />
          </IconBtn>
        </div>
        {instances.map((item) =>
          'group' in item ? (
            <Group key={item.group} className="mt-1.5 flex items-center gap-1 px-1">
              <ChevronDown className="size-3.5" strokeWidth={2} />
              {item.group}
            </Group>
          ) : (
            <div
              key={item.name}
              className={`flex h-14 shrink-0 items-center gap-3 rounded-[14px] px-2.5 ${item.selected ? 'bg-(--lm-default)' : ''}`}
            >
              <Pixel src={item.icon} size={32} />
              <span className="leading-tight">
                <b className="block text-[15px]">{item.name}</b>
                <small className="text-xs text-(--lm-text2)">{item.note}</small>
              </span>
            </div>
          ),
        )}
      </Panel>
      <Panel className="absolute top-2 right-3.5 bottom-0 left-[270px] overflow-hidden px-4 pt-4">
        <div className="flex items-center gap-3">
          <Pixel src={fabric} size={44} />
          <span className="leading-tight">
            <b className="block text-xl">26.3-Fabric</b>
            <small className="text-xs text-(--lm-text2)">正式版 · 基于 26.3</small>
          </span>
          <span className="ml-auto flex gap-2">
            <Btn>
              <Folder {...ic} />
              打开文件夹
            </Btn>
            <Btn>
              <FileText {...ic} />
              游戏日志
            </Btn>
            <IconBtn>
              <Ellipsis {...ic} />
            </IconBtn>
          </span>
        </div>
        <div className="mt-3">
          <Seg
            items={tabs.map((t) => t.label)}
            active={tabs.findIndex((t) => t.id === tab)}
            demo={(i) => `tab-${tabs[i].id}`}
          />
        </div>
        <div className="mt-3">
          {tab === 'overview' && <Overview />}
          {tab === 'mods' && <Mods disabled={state.disabledMods} />}
          {tab === 'worlds' && <Worlds backups={state.backups} />}
          {tab === 'servers' && <Servers />}
          {tab === 'settings' && <Settings autoMemory={state.autoMemory} />}
        </div>
      </Panel>
    </div>
  )
}

const stats = [
  { label: '模组', value: '7 个', note: '没有可更新' },
  { label: '存档', value: '1 个', note: '1 个备份' },
  { label: '游玩时长', value: '12 小时', note: '今天 20:50' },
  { label: '内存', value: '8000 MB', note: '本实例设置' },
]

function Overview() {
  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((s) => (
          <Card key={s.label} className="px-3.5 py-3 leading-snug">
            <span className="text-xs text-(--lm-text2)">{s.label}</span>
            <b className="block text-lg">{s.value}</b>
            <span className="text-xs text-(--lm-text2)">{s.note}</span>
          </Card>
        ))}
      </div>
      <Group className="mt-[18px] flex justify-between">
        主页显示<span className="font-normal">已固定 2 / 3</span>
      </Group>
      <Card className="mt-2">
        <EntryRow
          icon={<img src={meadow} alt="" className="size-10 rounded-lg object-cover" />}
          title="生存世界"
          text="存档"
          action="进入"
        />
        <EntryRow
          icon={<Tile text="P" color="#5b3fc4" />}
          title="play.example.net"
          text="服务器"
          action="加入"
          divided
        />
      </Card>
    </>
  )
}

type EntryRowProps = {
  icon: React.ReactNode
  title: string
  text: string
  action: string
  divided?: boolean
}

function EntryRow({ icon, title, text, action, divided }: EntryRowProps) {
  return (
    <div
      className={`flex h-16 items-center gap-3.5 px-4 ${divided ? 'border-t border-(--lm-sep)' : ''}`}
    >
      {icon}
      <span className="leading-tight">
        <b className="block text-sm">{title}</b>
        <small className="text-xs text-(--lm-text2)">{text}</small>
      </span>
      <span className="ml-auto flex gap-2">
        <IconBtn>
          <Pin {...ic} />
        </IconBtn>
        <Btn>
          <Play className="size-3" fill="currentColor" strokeWidth={0} />
          {action}
        </Btn>
      </span>
    </div>
  )
}

const mods = [
  {
    id: 'entityculling',
    name: 'EntityCulling',
    meta: '1.11.3 · entityculling-fabric-1.11.3-mc26.3.jar · Modrinth',
    color: '#59616d',
  },
  {
    id: 'fabric-api',
    name: 'Fabric API',
    meta: '0.165.2+26.3 · fabric-api-0.165.2+26.3.jar · Modrinth',
    color: '',
  },
  {
    id: 'iris',
    name: 'Iris',
    meta: '1.11.7+mc26.3 · iris.jar · Modrinth · 已锁定更新',
    color: '#8b5cf6',
  },
  {
    id: 'lithium',
    name: 'Lithium',
    meta: '0.18.1+mc26.3 · lithium-fabric-0.18.1+mc26.3.jar · Modrinth',
    color: '#d99a2b',
  },
  {
    id: 'modmenu',
    name: 'Mod Menu',
    meta: '16.0.0 · modmenu-16.0.0.jar · Modrinth',
    color: '#3b82f6',
  },
  {
    id: 'reeses',
    name: "Reese's Sodium Options",
    meta: '2.2.5+mc26.3 · reeses-sodium-options-fabric-2.2.5+mc26.3.jar · Modrinth',
    color: '#4338ca',
  },
  {
    id: 'sodium',
    name: 'Sodium',
    meta: '0.9.2+mc26.3 · sodium-fabric-0.9.2+mc26.3.jar · Modrinth',
    color: '#3fa86b',
  },
]

function Mods({ disabled }: { disabled: string[] }) {
  return (
    <>
      <div className="flex gap-2">
        <Field className="flex-1 text-(--lm-muted)">搜索模组</Field>
        <Btn>
          <Plus {...ic} />
          添加模组
        </Btn>
        <Btn>
          <Folder {...ic} />
          打开文件夹
        </Btn>
        <IconBtn>
          <List {...ic} />
        </IconBtn>
        <IconBtn>
          <RotateCw {...ic} />
        </IconBtn>
      </div>
      <Card className="mt-2.5">
        {mods.map((mod, i) => {
          const off = disabled.includes(mod.id)
          return (
            <div
              key={mod.id}
              className={`flex h-16 items-center gap-3.5 px-4 ${i ? 'border-t border-(--lm-sep)' : ''}`}
            >
              <span className={`transition-opacity duration-300 ${off ? 'opacity-45' : ''}`}>
                {mod.color ? (
                  <Tile text={mod.name[0]} color={mod.color} />
                ) : (
                  <Pixel src={fabric} size={40} />
                )}
              </span>
              <span
                className={`min-w-0 flex-1 leading-tight transition-opacity duration-300 ${off ? 'opacity-45' : ''}`}
              >
                <b className="block text-sm">{mod.name}</b>
                <small className="block truncate text-xs text-(--lm-text2)">{mod.meta}</small>
              </span>
              <IconBtn>
                <Ellipsis {...ic} />
              </IconBtn>
              <IconBtn>
                <Trash2 {...ic} />
              </IconBtn>
              <Switch on={!off} demo={`mod-switch-${mod.id}`} />
            </div>
          )
        })}
      </Card>
    </>
  )
}

function Worlds({ backups }: { backups: number }) {
  const list = [
    { name: '2026-11-11_21-04-37_生存世界.zip', size: '21.6 MB' },
    { name: '2026-11-10_20-52-18_生存世界.zip', size: '21.4 MB' },
  ].slice(2 - backups)
  return (
    <>
      <div className="flex gap-2">
        <Btn>
          <Download {...ic} />
          导入世界
        </Btn>
        <Btn>
          <Folder {...ic} />
          打开文件夹
        </Btn>
        <IconBtn>
          <RotateCw {...ic} />
        </IconBtn>
      </div>
      <Card className="mt-2.5 flex h-[72px] items-center gap-3.5 px-4">
        <img src={meadow} alt="" className="size-10 rounded-lg object-cover" />
        <span className="leading-tight">
          <b className="block text-sm">生存世界</b>
          <small className="text-xs text-(--lm-text2)">
            生存 · 最后游玩 今天 20:50 · 种子 -1584976911832232915
          </small>
        </span>
        <span className="ml-auto flex gap-2">
          <IconBtn>
            <Pin {...ic} />
          </IconBtn>
          <Btn demo="world-backup">
            <Archive {...ic} />
            备份
          </Btn>
          <Btn>
            <Play className="size-3" fill="currentColor" strokeWidth={0} />
            进入
          </Btn>
          <IconBtn>
            <Ellipsis {...ic} />
          </IconBtn>
        </span>
      </Card>
      <Group className="mt-[18px]">备份</Group>
      <Card className="mt-2">
        {list.map((b, i) => (
          <motion.div
            key={b.name}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`flex h-16 items-center gap-3.5 px-4 ${i ? 'border-t border-(--lm-sep)' : ''}`}
          >
            <span className="grid size-10 place-items-center rounded-lg bg-(--lm-default)">
              <Archive {...ic} />
            </span>
            <span className="leading-tight">
              <b className="block text-sm">{b.name}</b>
              <small className="text-xs text-(--lm-text2)">{b.size}</small>
            </span>
            <span className="ml-auto flex gap-2">
              <Btn>恢复</Btn>
              <IconBtn>
                <Trash2 {...ic} />
              </IconBtn>
            </span>
          </motion.div>
        ))}
      </Card>
    </>
  )
}

function Servers() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Btn>
          <Plus {...ic} />
          添加服务器
        </Btn>
        <IconBtn>
          <RotateCw {...ic} />
        </IconBtn>
        <span className="ml-auto text-xs text-(--lm-text2)">与游戏内多人游戏列表同步</span>
      </div>
      <Card className="mt-2.5 flex h-[72px] items-center gap-3.5 px-4">
        <Tile text="P" color="#5b3fc4" />
        <span className="leading-tight">
          <b className="block text-sm">play.example.net</b>
          <small className="text-xs text-(--lm-text2)">
            play.example.net · 在线 1024 / 5000 · 32 ms
          </small>
        </span>
        <span className="ml-auto flex gap-2">
          <IconBtn>
            <Pin {...ic} />
          </IconBtn>
          <Btn>
            <Play className="size-3" fill="currentColor" strokeWidth={0} />
            加入
          </Btn>
          <IconBtn>
            <Ellipsis {...ic} />
          </IconBtn>
        </span>
      </Card>
    </>
  )
}

function Settings({ autoMemory }: { autoMemory: boolean }) {
  const preset = (
    <span className="rounded-full bg-(--lm-default) px-2 py-0.5 text-[11px] text-(--lm-text2)">
      预设
    </span>
  )
  return (
    <>
      <p className="text-xs text-(--lm-text2)">
        直接修改即为本实例单独设置；标“全局”的项沿用设置页的全局设置，选了预设时标“预设”的项沿用预设。
      </p>
      <Card className="mt-2">
        <SettingRow title="加载器" hint="Minecraft 26.3 · Fabric 0.20.1">
          <Btn>更改</Btn>
        </SettingRow>
        <SettingRow title="设置预设" hint="未单独设置的项先取预设，再取全局设置" divided>
          <SelectBox value="通用" />
        </SettingRow>
      </Card>
      <Card className="mt-2">
        <SettingRow title="版本隔离" hint="每个实例独立存放存档、设置与模组">
          {preset}
          <Switch on />
        </SettingRow>
        <SettingRow title="最大内存" hint={autoMemory ? '按可用内存与模组数自动分配' : ''} divided>
          {preset}
          <Seg
            items={['自动', '手动']}
            active={autoMemory ? 0 : 1}
            demo={(i) => (i ? undefined : 'memory-auto')}
          />
          <Field
            className={`w-[150px] justify-between transition-opacity duration-300 ${autoMemory ? 'opacity-50' : ''}`}
          >
            {autoMemory ? '4352' : '8000'}
            <span className="text-(--lm-text2)">MB</span>
          </Field>
        </SettingRow>
        <SettingRow title="Java" hint="自动时按游戏版本选择 Java" divided>
          {preset}
          <SelectBox value="自动" />
        </SettingRow>
      </Card>
    </>
  )
}

type SettingRowProps = { title: string; hint: string; divided?: boolean; children: React.ReactNode }

function SettingRow({ title, hint, divided, children }: SettingRowProps) {
  return (
    <div
      className={`flex min-h-14 items-center gap-2.5 px-5 py-2 ${divided ? 'border-t border-(--lm-sep)' : ''}`}
    >
      <span className="mr-auto leading-tight">
        <span className="block text-sm">{title}</span>
        {hint && <small className="text-xs text-(--lm-text2)">{hint}</small>}
      </span>
      {children}
    </div>
  )
}

function SelectBox({ value }: { value: string }) {
  return (
    <Field className="w-[280px] justify-between">
      {value}
      <ChevronDown {...ic} />
    </Field>
  )
}

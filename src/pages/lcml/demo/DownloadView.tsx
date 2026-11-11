import {
  Archive,
  ArrowLeft,
  Box,
  ChevronDown,
  ChevronUp,
  Database,
  Download,
  Folder,
  Image as ImageIcon,
  List,
  Map as MapIcon,
  Plus,
  Puzzle,
  Star,
  Sun,
} from 'lucide-react'
import { motion } from 'motion/react'
import anvil from '../assets/anvil.png'
import fabric from '../assets/fabric.png'
import grassPath from '../assets/grass-path.png'
import grass from '../assets/grass.png'
import neoforge from '../assets/neoforge.png'
import quilt from '../assets/quilt.png'
import type { DemoState } from './state'
import { fade, ic } from './tokens'
import { Btn, Card, Field, Group, IconBtn, Panel, Pixel, Seg, Tile } from './ui'

const categories = [
  { group: '游戏' },
  { id: 'version', label: '新建实例', Icon: Box },
  { group: '资源' },
  { id: 'modpack', label: '整合包', Icon: Archive },
  { id: 'mod', label: '模组', Icon: Puzzle },
  { id: 'shader', label: '光影包', Icon: Sun },
  { id: 'resourcepack', label: '资源包', Icon: ImageIcon },
  { id: 'datapack', label: '数据包', Icon: Database },
  { id: 'world', label: '地图', Icon: MapIcon },
  { id: 'favorites', label: '收藏', Icon: Star },
]

// 下载页：左侧分类，右侧为新建实例或资源搜索
export function DownloadView({ state }: { state: DemoState }) {
  const shown = state.page === 'download'
  return (
    <div
      className={`absolute inset-0 ${fade} ${shown ? '' : 'pointer-events-none -translate-x-6 opacity-0'}`}
    >
      <Panel className="absolute top-2 bottom-0 left-3.5 flex w-[168px] flex-col gap-1 p-2.5">
        {categories.map((c) =>
          'group' in c ? (
            <Group key={c.group} className="mt-1.5 px-3">
              {c.group}
            </Group>
          ) : (
            <span
              key={c.id}
              data-demo={`category-${c.id}`}
              className={`flex h-[34px] items-center gap-2 rounded-[14px] px-3 transition-colors duration-200 ${state.category === c.id ? 'bg-(--lm-default)' : 'text-(--lm-text2)'}`}
            >
              <c.Icon {...ic} />
              {c.label}
            </span>
          ),
        )}
        <span className="mt-auto flex h-[34px] items-center gap-2 px-3 text-(--lm-text2)">
          <List {...ic} />
          任务
        </span>
      </Panel>
      {state.category === 'version' ? <Versions state={state} /> : <Resources state={state} />}
    </div>
  )
}

const versions = [
  ['26.3', '2026-09-15'],
  ['26.2', '2026-06-16'],
  ['26.1.2', '2026-04-09'],
  ['26.1.1', '2026-04-01'],
  ['26.1', '2026-03-24'],
  ['1.21.11', '2025-12-09'],
  ['1.21.10', '2025-10-07'],
  ['1.21.9', '2025-09-30'],
  ['1.21.8', '2025-07-17'],
]

const loaders = [
  { id: 'forge', name: 'Forge', icon: anvil },
  { id: 'neoforge', name: 'NeoForge', icon: neoforge },
  { id: 'fabric', name: 'Fabric', icon: fabric },
  { id: 'quilt', name: 'Quilt', icon: quilt },
  { id: 'optifine', name: 'OptiFine', icon: grassPath },
]

const fabricVersions = [
  ['0.18.1', '2026-10-28'],
  ['0.18.0', '2026-09-30'],
  ['0.17.3', '2026-08-12'],
]

function Versions({ state }: { state: DemoState }) {
  return (
    <>
      <Panel className="absolute top-2 bottom-0 left-[190px] flex w-[248px] flex-col gap-2 overflow-hidden p-2.5">
        <Seg items={['正式版', '快照', '远古版本']} active={0} />
        <Field className="text-(--lm-muted)">搜索版本</Field>
        {versions.map(([v, date]) => (
          <div
            key={v}
            data-demo={`version-${v}`}
            className={`flex h-[46px] shrink-0 items-center gap-3 rounded-[14px] px-2.5 transition-colors duration-200 ${state.gameVersion === v ? 'bg-(--lm-default)' : ''}`}
          >
            <Pixel src={grass} size={24} />
            <span className="leading-tight">
              <b className="block text-sm">{v}</b>
              <small className="text-xs text-(--lm-text2)">{date}</small>
            </span>
          </div>
        ))}
      </Panel>
      <Panel className="absolute top-2 right-3.5 bottom-0 left-[446px] overflow-hidden p-4">
        {state.gameVersion ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start">
              <span className="leading-snug">
                <b className="block text-xl">{state.gameVersion}</b>
                <small className="text-xs text-(--lm-text2)">
                  正式版 · {versions.find(([v]) => v === state.gameVersion)![1]}
                </small>
              </span>
              <Btn primary demo="version-install" className="ml-auto">
                <Download {...ic} />
                安装
              </Btn>
            </div>
            <Group className="mt-4 mb-2">加载器</Group>
            <Card className="overflow-hidden">
              {loaders.map((l, i) => {
                const open = l.id === 'fabric' && state.fabricOpen
                const status =
                  l.id === 'fabric' && state.fabricVersion ? state.fabricVersion : '不安装'
                return (
                  <div key={l.id} className={i ? 'border-t border-(--lm-sep)' : ''}>
                    <div
                      data-demo={`loader-${l.id}`}
                      className="flex h-[50px] items-center gap-3 px-4"
                    >
                      <Pixel src={l.icon} size={24} />
                      <b className="w-24 text-sm">{l.name}</b>
                      <span className="text-[13px] text-(--lm-text2)">{status}</span>
                      {open ? (
                        <ChevronUp {...ic} className="ml-auto size-4" />
                      ) : (
                        <ChevronDown {...ic} className="ml-auto size-4" />
                      )}
                    </div>
                    <motion.div
                      initial={false}
                      animate={{ height: open ? 'auto' : 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-3">
                        <span className="text-xs text-(--lm-text2)">
                          共 {fabricVersions.length} 个版本
                        </span>
                        {fabricVersions.map(([v, date]) => (
                          <div
                            key={v}
                            data-demo={`fabric-${v}`}
                            className="flex h-9 items-center gap-3 rounded-2xl px-3"
                          >
                            <Radio on={state.fabricVersion === v} />
                            <span className="text-[13px]">{v}</span>
                            <span className="ml-auto text-xs text-(--lm-text2)">{date}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                )
              })}
            </Card>
            <span className="mt-3 flex items-center justify-end gap-1.5 text-[13px]">
              <Folder {...ic} />
              使用本地安装器
            </span>
          </motion.div>
        ) : (
          <div className="grid h-full place-items-center text-sm text-(--lm-text2)">
            选择左侧的游戏版本
          </div>
        )}
      </Panel>
    </>
  )
}

function Radio({ on }: { on: boolean }) {
  return (
    <span
      className={`grid size-4 place-items-center rounded-full transition-colors duration-200 ${on ? 'bg-(--lm-primary)' : 'shadow-[inset_0_0_0_1.5px_var(--lm-muted)]'}`}
    >
      <span
        className={`size-1.5 rounded-full bg-(--lm-on-primary) transition-transform duration-200 ${on ? 'scale-100' : 'scale-0'}`}
      />
    </span>
  )
}

const results = [
  {
    id: 'sodium',
    title: '钠（Sodium）',
    text: '现代化的渲染引擎，大幅提升帧率并减少卡顿',
    meta: '作者 CaffeineMC · 1.1 亿 次下载 · 3 天前更新',
    color: '#3fa86b',
  },
  {
    id: 'reeses',
    title: "钠选项（Reese's Sodium Options）",
    text: '为钠提供更好用的视频设置界面',
    meta: '作者 FlashyReese · 3200 万 次下载 · 5 天前更新',
    color: '#4338ca',
  },
  {
    id: 'extra',
    title: '钠额外（Sodium Extra）',
    text: '为钠补充更多画面与性能选项',
    meta: '作者 FlashyReese · 2900 万 次下载 · 6 天前更新',
    color: '#2f7d6d',
  },
]

const sodiumVersions = [
  ['mc26.3-0.9.2-fabric', '2026-11-08'],
  ['mc26.3-0.9.1-fabric', '2026-10-20'],
  ['mc26.3-0.9.0-fabric', '2026-09-29'],
]

function Resources({ state }: { state: DemoState }) {
  return (
    <Panel className="absolute top-2 right-3.5 bottom-0 left-[190px] overflow-hidden p-4">
      <div
        className={`absolute inset-4 ${fade} ${state.detail ? 'pointer-events-none -translate-x-6 opacity-0' : ''}`}
      >
        <div className="flex gap-2">
          <Field className={`flex-1 ${state.queryFocused ? 'shadow-[0_0_0_2px_#3b82f6]' : ''}`}>
            <span data-demo="resource-search" className="flex flex-1 items-center">
              {state.query || (
                <span className="text-(--lm-muted)">搜索模组，可输入中文名或粘贴项目链接</span>
              )}
              {state.queryFocused && <i className="ml-px h-4 w-px animate-pulse bg-current" />}
            </span>
          </Field>
          <Field className="w-36 justify-between">
            26.3
            <ChevronDown {...ic} />
          </Field>
          <Field className="w-36 justify-between">
            Fabric
            <ChevronDown {...ic} />
          </Field>
        </div>
        {state.results === 'loading' && (
          <div className="mt-20 flex flex-col items-center gap-2 text-[13px] text-(--lm-text2)">
            <Pixel src={grass} size={40} className="animate-bounce" />
            正在搜索
          </div>
        )}
        {state.results === 'shown' && (
          <div className="mt-3 flex flex-col gap-2">
            {results.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
              >
                <Card className="flex h-[76px] items-center gap-3.5 px-4">
                  <span data-demo={`result-${r.id}`}>
                    <Tile text={r.title[0]} color={r.color} size={48} />
                  </span>
                  <span className="leading-snug">
                    <b className="block text-sm">{r.title}</b>
                    <span className="block text-[13px]">{r.text}</span>
                    <small className="text-xs text-(--lm-text2)">{r.meta}</small>
                  </span>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <div
        className={`absolute inset-4 flex flex-col ${fade} ${state.detail ? '' : 'pointer-events-none translate-x-6 opacity-0'}`}
      >
        <div className="flex items-center gap-3">
          <ArrowLeft {...ic} />
          <b className="text-lg">钠（Sodium）</b>
          <span className="ml-auto flex gap-2">
            <Btn>
              <Star {...ic} />
              收藏
            </Btn>
            <Btn>在 Modrinth 查看</Btn>
          </span>
        </div>
        <Card className="mt-3 flex items-center gap-4 p-4">
          <Tile text="钠" color="#3fa86b" size={64} />
          <span className="leading-snug">
            <b className="block text-xl">钠（Sodium）</b>
            <span className="block text-[13px]">现代化的渲染引擎，大幅提升帧率并减少卡顿</span>
            <small className="text-xs text-(--lm-text2)">
              1.16.5 – 26.3 · 1.1 亿 次下载 · 3 天前更新
            </small>
          </span>
        </Card>
        <div className="mt-3">
          <Seg items={['版本', '简介', '更新日志']} active={0} />
        </div>
        <Card className="mt-3 overflow-hidden">
          <div className="flex h-11 items-center gap-2 px-4">
            <b className="text-sm">26.3</b>
            <span className="text-xs text-(--lm-text2)">共 {sodiumVersions.length} 个版本</span>
            <ChevronUp {...ic} className="ml-auto size-4" />
          </div>
          {sodiumVersions.map(([v, date], i) => (
            <div key={v} className="flex h-10 items-center gap-3 border-t border-(--lm-sep) px-4">
              <Radio on={i === 0} />
              <span className="text-[13px]">{v}</span>
              <span className="ml-auto text-xs text-(--lm-text2)">{date}</span>
            </div>
          ))}
        </Card>
        <div className="mt-auto flex items-center gap-2">
          <b className="mr-auto text-sm">{sodiumVersions[0][0]}</b>
          <span className="text-[13px]">安装到</span>
          <Field className="w-56 justify-between">
            26.3-Fabric
            <ChevronDown {...ic} />
          </Field>
          <IconBtn>
            <Plus {...ic} />
          </IconBtn>
          <Btn primary demo="resource-install">
            <Download {...ic} />
            安装
          </Btn>
        </div>
      </div>
    </Panel>
  )
}

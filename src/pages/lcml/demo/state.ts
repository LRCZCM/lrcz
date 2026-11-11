// 启动器演示的界面状态。演示窗口固定为启动器默认的 1100×660，再整体缩放到容器宽度。
export const STAGE_WIDTH = 1100
export const STAGE_HEIGHT = 660

export type Page = 'onboard' | 'home' | 'instances' | 'download' | 'skins' | 'settings'
export type Theme = 'meadow' | 'dusk' | 'night'
export type InstanceTab =
  | 'overview'
  | 'mods'
  | 'resourcepacks'
  | 'shaderpacks'
  | 'worlds'
  | 'servers'
  | 'screenshots'
  | 'schematics'
  | 'settings'
export type DownloadCategory = 'version' | 'mod'

export type Task = { label: string; progress: number; done: boolean }

export type DemoState = {
  page: Page
  theme: Theme
  account: boolean
  dialog: boolean
  playerName: string
  nameFocused: boolean
  launch: 'disabled' | 'idle' | 'preparing' | 'running'
  launchProgress: number
  task: Task | null
  skin: 'me' | 'zuri'
  instanceTab: InstanceTab
  disabledMods: string[]
  backups: number
  autoMemory: boolean
  category: DownloadCategory
  gameVersion: string | null
  fabricOpen: boolean
  fabricVersion: string | null
  query: string
  queryFocused: boolean
  results: 'none' | 'loading' | 'shown'
  detail: boolean
}

// 每章开始时都从这个状态出发：已登录、主页、原野外观
export const baseState: DemoState = {
  page: 'home',
  theme: 'meadow',
  account: true,
  dialog: false,
  playerName: '',
  nameFocused: false,
  launch: 'idle',
  launchProgress: 0,
  task: null,
  skin: 'me',
  instanceTab: 'overview',
  disabledMods: [],
  backups: 1,
  autoMemory: false,
  category: 'version',
  gameVersion: null,
  fabricOpen: false,
  fabricVersion: null,
  query: '',
  queryFocused: false,
  results: 'none',
  detail: false,
}

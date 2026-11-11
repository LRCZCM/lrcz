import { baseState, type DemoState } from './state'

// 演示脚本通过它操作界面：改状态、等待、把光标移到 data-demo 标记的元素上点击
export type Director = {
  set: (patch: Partial<DemoState> | ((state: DemoState) => Partial<DemoState>)) => void
  wait: (ms: number) => Promise<void>
  place: (x: number, y: number) => void
  click: (target: string, moveMs?: number) => Promise<void>
}

export type Chapter = {
  id: string
  title: string
  // 章节总时长，页面据此画进度条；脚本提前结束时补足等待
  duration: number
  run: (d: Director) => Promise<void>
}

async function typeText(d: Director, field: 'playerName' | 'query', text: string) {
  for (let i = 1; i <= text.length; i++) {
    const value = text.slice(0, i)
    d.set(field === 'query' ? { query: value } : { playerName: value })
    await d.wait(130)
  }
}

async function runTask(d: Director, label: string, steps: number, stepMs: number) {
  for (let i = 0; i <= steps; i++) {
    d.set({ task: { label, progress: Math.round((i / steps) * 100), done: false } })
    await d.wait(stepMs)
  }
  d.set({ task: { label, progress: 100, done: true } })
}

export const chapters: Chapter[] = [
  {
    id: 'login',
    title: '登录',
    duration: 9000,
    async run(d) {
      d.set({ ...baseState, page: 'onboard', account: false, launch: 'disabled' })
      d.place(700, 420)
      await d.wait(700)
      await d.click('add-offline')
      d.set({ dialog: true })
      await d.wait(600)
      await d.click('player-name', 650)
      d.set({ nameFocused: true })
      await typeText(d, 'playerName', 'LRCZCM')
      await d.wait(350)
      await d.click('offline-add', 650)
      d.set({ dialog: false, account: true })
      await d.wait(700)
      d.set({ page: 'home', launch: 'idle' })
    },
  },
  {
    id: 'launch',
    title: '启动',
    duration: 10000,
    async run(d) {
      d.set(baseState)
      d.place(620, 300)
      await d.wait(600)
      await d.click('launch', 900)
      d.set({ launch: 'preparing' })
      for (let p = 0; p <= 100; p += 4) {
        d.set({ launchProgress: p })
        await d.wait(110)
      }
      d.set({ launch: 'running', launchProgress: 0 })
      d.place(560, 260)
      await d.wait(3000)
      await d.click('launch', 900)
      d.set({ launch: 'idle' })
    },
  },
  {
    id: 'instance',
    title: '实例',
    duration: 16500,
    async run(d) {
      d.set(baseState)
      d.place(560, 300)
      await d.wait(500)
      await d.click('nav-instances')
      d.set({ page: 'instances' })
      await d.wait(1500)
      await d.click('tab-mods')
      d.set({ instanceTab: 'mods' })
      await d.wait(900)
      await d.click('mod-switch-entityculling')
      d.set({ disabledMods: ['entityculling'] })
      await d.wait(900)
      await d.click('tab-worlds')
      d.set({ instanceTab: 'worlds' })
      await d.wait(800)
      await d.click('world-backup')
      await runTask(d, '备份存档 生存世界', 10, 90)
      d.set({ backups: 2 })
      await d.wait(1000)
      d.set({ task: null })
      await d.click('tab-servers')
      d.set({ instanceTab: 'servers' })
      await d.wait(1300)
      await d.click('tab-settings')
      d.set({ instanceTab: 'settings' })
      await d.wait(800)
      await d.click('memory-auto')
      d.set({ autoMemory: true })
    },
  },
  {
    id: 'create',
    title: '新建',
    duration: 13500,
    async run(d) {
      d.set(baseState)
      d.place(560, 300)
      await d.wait(500)
      await d.click('nav-download')
      d.set({ page: 'download', category: 'version' })
      await d.wait(1000)
      await d.click('version-1.21.11')
      d.set({ gameVersion: '1.21.11' })
      await d.wait(900)
      await d.click('loader-fabric')
      d.set({ fabricOpen: true })
      await d.wait(900)
      await d.click('fabric-0.18.1', 650)
      d.set({ fabricVersion: '0.18.1' })
      await d.wait(600)
      await d.click('version-install')
      await runTask(d, '安装 1.21.11-Fabric', 25, 120)
      await d.wait(1200)
    },
  },
  {
    id: 'resource',
    title: '资源',
    duration: 14000,
    async run(d) {
      d.set({ ...baseState, page: 'download', category: 'version' })
      d.place(560, 300)
      await d.wait(500)
      await d.click('category-mod')
      d.set({ category: 'mod' })
      await d.wait(700)
      await d.click('resource-search')
      d.set({ queryFocused: true })
      await typeText(d, 'query', '钠')
      d.set({ results: 'loading' })
      await d.wait(900)
      d.set({ results: 'shown', queryFocused: false })
      await d.wait(1000)
      await d.click('result-sodium')
      d.set({ detail: true })
      await d.wait(1300)
      await d.click('resource-install')
      await runTask(d, '安装 钠 到 26.3-Fabric', 14, 110)
      await d.wait(1200)
    },
  },
  {
    id: 'skin',
    title: '皮肤',
    duration: 8500,
    async run(d) {
      d.set(baseState)
      d.place(560, 300)
      await d.wait(500)
      await d.click('nav-skins')
      d.set({ page: 'skins' })
      await d.wait(900)
      await d.click('skin-zuri')
      d.set({ skin: 'zuri' })
      await d.wait(1500)
      await d.click('skin-me')
      d.set({ skin: 'me' })
    },
  },
  {
    id: 'theme',
    title: '外观',
    duration: 10500,
    async run(d) {
      d.set(baseState)
      d.place(560, 300)
      await d.wait(500)
      await d.click('nav-settings')
      d.set({ page: 'settings' })
      await d.wait(800)
      for (const theme of ['dusk', 'night', 'meadow'] as const) {
        await d.click(`preset-${theme}`)
        d.set({ theme })
        await d.wait(theme === 'meadow' ? 400 : 1300)
      }
      await d.click('nav-home')
      d.set({ page: 'home' })
    },
  },
]

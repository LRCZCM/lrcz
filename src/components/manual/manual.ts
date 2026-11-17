import type { LucideIcon } from 'lucide-react'
import { marked, type MarkedToken, type Token, type Tokens } from 'marked'
import { createContext, use } from 'react'

export type ManualHeading = { id: string; depth: number; text: string; token: Tokens.Heading }
export type ManualFile = { url: string; tokens: MarkedToken[]; headings: ManualHeading[] }
export type Chapter = { id: string; title: string; group: string }
export type ManualIndex = {
  chapters: Chapter[]
  groups: { name: string; chapters: Chapter[] }[]
  /** README 去掉“目录”一节后，目录前后的内容 */
  before: MarkedToken[]
  after: MarkedToken[]
}
export type SearchSection = { chapter: Chapter; heading: ManualHeading; text: string }

/** 一本手册：放在哪个地址、文件在哪、怎么分组。LCML 使用手册与各插件手册共用同一套页面。 */
export type ManualSource = {
  /** 手册名，用于网页标题与面包屑，如“LCML 使用手册”“工具皮带” */
  name: string
  /** 手册首页的站内路由，各章为 `${path}/<章节>` */
  path: string
  /** 手册文件所在的本站目录（以 / 结尾），构建时下载到这里 */
  files: string
  /** 手册文件地址转为站内路由，用于文中链接（可跨手册）；不是手册页面的返回 null */
  route: (url: URL) => string | null
  /** README 的目录里没写“### 分组名”时用这套分组 */
  defaultGroups?: Record<string, string[]>
  /** 左侧导航各分组的图标，认不出的分组用书本 */
  groupIcons: Record<string, LucideIcon>
  /** 首页“第一章”大入口下的小字 */
  startHint: string
  /** 搜索框空着时的提示 */
  searchHint: string
  /** 章节底部“没找到答案？”后的链接 */
  feedback: { label: string; href: string }
}

export const ManualSourceContext = createContext<ManualSource>(null!)
export const useManualSource = () => use(ManualSourceContext)

export const INDEX_FILE = 'README.md'

/** marked 不加扩展时只产出 MarkedToken，在这里收窄一次类型。 */
export const asMarked = (tokens: Token[]) => tokens as MarkedToken[]

/** 标签内的纯文字，用于标题锚点、目录与搜索。 */
export function plainText(tokens: Token[]): string {
  return asMarked(tokens)
    .map((token) => {
      switch (token.type) {
        case 'list':
          return token.items.map((item) => plainText(item.tokens)).join(' ')
        case 'table':
          return [...token.header, ...token.rows.flat()].map((c) => plainText(c.tokens)).join(' ')
        case 'image':
        case 'space':
        case 'hr':
        case 'br':
        case 'checkbox':
        case 'def':
          return ' '
        default:
          return 'tokens' in token && token.tokens ? plainText(token.tokens) : token.text
      }
    })
    .join('')
}

/** 与 GitHub 相同的标题锚点规则，文中的 `xxx.md#标题` 链接才能对上。 */
function slugger() {
  const used = new Map<string, number>()
  return (text: string) => {
    const slug = text
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s_-]/gu, '')
      .replace(/\s/g, '-')
    const count = used.get(slug) ?? 0
    used.set(slug, count + 1)
    return count ? `${slug}-${count}` : slug
  }
}

function parseFile(text: string, url: string): ManualFile {
  const tokens = asMarked(marked.lexer(text))
  const slug = slugger()
  const headings = tokens
    .filter((token) => token.type === 'heading')
    .map((token) => {
      const text = plainText(token.tokens).trim()
      return { id: slug(text), depth: token.depth, text, token }
    })
  return { url, tokens, headings }
}

async function fetchManualFile(path: string) {
  // 重新部署后要读到新内容，每次向服务器确认是否有更新
  const response = await fetch(path, { cache: 'no-cache' })
  if (!response.ok) throw new Error(`${response.url} 返回 ${response.status}`)
  return parseFile(await response.text(), response.url)
}

// 手册各章只读一次：页面、首页卡片与搜索共用；失败的不缓存，下次重新读
const files = new Map<string, Promise<ManualFile>>()

/** 读取本站上的一个手册文件，path 如 `/lcml-manual/README.md`。 */
export function loadManualFile(path: string) {
  let file = files.get(path)
  if (!file) {
    file = fetchManualFile(path)
    file.catch(() => files.delete(path))
    files.set(path, file)
  }
  return file
}

export const chapterFile = (id: string) => `${id}.md`

/** 从 README 的“## 目录”读出章节顺序与分组。 */
export function parseIndex(
  { tokens }: ManualFile,
  defaultGroups?: Record<string, string[]>,
): ManualIndex {
  const start = tokens.findIndex(
    (t) => t.type === 'heading' && t.depth === 2 && plainText(t.tokens).trim() === '目录',
  )
  const next = tokens.findIndex((t, i) => i > start && t.type === 'heading' && t.depth <= 2)
  // 目录可能是 README 的最后一节
  const end = next < 0 ? tokens.length : next
  const toc = tokens.slice(start + 1, end)

  const chapters: Chapter[] = []
  let group = ''
  for (const token of toc) {
    if (token.type === 'heading') group = plainText(token.tokens).trim()
    if (token.type !== 'list') continue
    for (const item of token.items) {
      const [, title, id] = item.text.match(/\[(.+?)\]\((?:\.\/)?([\w-]+)\.md\)/) ?? []
      if (id) chapters.push({ id, title, group })
    }
  }
  if (!toc.some((t) => t.type === 'heading')) {
    const fallback = Object.entries(defaultGroups ?? {})
    for (const c of chapters)
      c.group = fallback.find(([, ids]) => ids.includes(c.id))?.[0] ?? '其他'
  }

  const groups = [...new Set(chapters.map((c) => c.group))].map((name) => ({
    name,
    chapters: chapters.filter((c) => c.group === name),
  }))
  return { chapters, groups, before: tokens.slice(0, start), after: tokens.slice(end) }
}

/** 把一章按标题切成小节，供全文搜索。 */
export function searchSections(chapter: Chapter, { tokens, headings }: ManualFile) {
  const sections: SearchSection[] = []
  for (const token of tokens) {
    const heading = headings.find((h) => h.token === token)
    if (heading) sections.push({ chapter, heading, text: '' })
    else if (sections.length) sections[sections.length - 1].text += plainText([token]).trim() + ' '
  }
  return sections
}

/** 手册内的链接（`xxx.md#标题`、`../别的手册/xxx.md`、`#标题`）转为站内路由；不是手册页面的返回 null。 */
export function manualRoute(href: string, file: ManualFile, source: ManualSource) {
  const target = new URL(href, file.url)
  if (target.origin !== location.origin) return null
  const route = source.route(target)
  return route && route + target.hash
}

/** 手册文件名（`README` 或章节名）对应的站内路由。 */
export const pageRoute = (path: string, name: string) =>
  name === 'README' ? path : `${path}/${name}`

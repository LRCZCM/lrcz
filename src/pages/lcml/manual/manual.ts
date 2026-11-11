import { marked, type MarkedToken, type Token, type Tokens } from 'marked'
import { fetchReleaseFile } from '../release'

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

export const MANUAL_PATH = '/lcml/manual'
export const INDEX_FILE = 'README.md'

// README 的目录里没写“### 分组名”时用这套分组；写了就以 README 为准
const DEFAULT_GROUPS: Record<string, string[]> = {
  开始: ['getting-started', 'interface', 'home'],
  账号与皮肤: ['accounts', 'skin'],
  下载: ['download-game', 'download-resources', 'modpacks'],
  实例: [
    'instances',
    'instance-content',
    'worlds-servers',
    'launch-options',
    'java',
    'backup-history',
  ],
  排错与工具: ['logs-diagnosis', 'tools'],
  设置与帮助: ['settings', 'faq'],
}

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

// 手册各章只读一次：页面、首页卡片与搜索共用；失败的不缓存，下次重新读
const files = new Map<string, Promise<ManualFile>>()

export function loadManualFile(name: string) {
  let file = files.get(name)
  if (!file) {
    file = fetchReleaseFile(`docs/manual/${name}`).then(({ text, url }) => parseFile(text, url))
    file.catch(() => files.delete(name))
    files.set(name, file)
  }
  return file
}

export const chapterFile = (id: string) => `${id}.md`

/** 从 README 的“## 目录”读出章节顺序与分组。 */
export function parseIndex({ tokens }: ManualFile): ManualIndex {
  const start = tokens.findIndex(
    (t) => t.type === 'heading' && t.depth === 2 && plainText(t.tokens).trim() === '目录',
  )
  const end = tokens.findIndex((t, i) => i > start && t.type === 'heading' && t.depth <= 2)
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
    const fallback = Object.entries(DEFAULT_GROUPS)
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

/** 手册内的链接（`xxx.md#标题`、`#标题`）转为站内路由；不是手册页面的返回 null。 */
export function manualRoute(href: string, file: ManualFile) {
  const target = new URL(href, file.url)
  const dir = new URL('.', file.url).href
  const path = target.href.split('#')[0]
  const [, name] = path.startsWith(dir)
    ? (path.slice(dir.length).match(/^([\w-]+)\.md$/) ?? [])
    : []
  if (!name) return null
  return `${MANUAL_PATH}${name === 'README' ? '' : `/${name}`}${target.hash}`
}

import { Autocomplete, Button, Header, Kbd, ListBox, Modal, SearchField } from '@heroui/react'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  chapterFile,
  loadManualFile,
  MANUAL_PATH,
  searchSections,
  type ManualIndex,
  type SearchSection,
} from './manual'

const MAX_RESULTS = 30
const SNIPPET_BEFORE = 16
const SNIPPET_LENGTH = 80

const IS_MAC = /Mac|iPhone|iPad/.test(navigator.userAgent)

// shortcut: 每次搜索遍历全部小节（目前约 150 个），手册明显变大后再换成预建索引。
function search(sections: SearchSection[], query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const inTitle = (s: SearchSection) => s.heading.text.toLowerCase().includes(q)
  return sections
    .filter((s) => inTitle(s) || s.text.toLowerCase().includes(q))
    .sort((a, b) => Number(inTitle(b)) - Number(inTitle(a)) || a.heading.depth - b.heading.depth)
    .slice(0, MAX_RESULTS)
}

// 同一章的结果排在一起，按章节分组显示
function groupByChapter(results: SearchSection[]) {
  const groups = new Map<string, SearchSection[]>()
  for (const r of results) groups.set(r.chapter.title, [...(groups.get(r.chapter.title) ?? []), r])
  return [...groups]
}

function Highlight({ text, query }: { text: string; query: string }) {
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase())
  if (i < 0) return text
  const end = i + query.trim().length
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-sm bg-warning-soft text-inherit">{text.slice(i, end)}</mark>
      {text.slice(end)}
    </>
  )
}

function snippet(text: string, query: string) {
  const start = Math.max(0, text.toLowerCase().indexOf(query.trim().toLowerCase()) - SNIPPET_BEFORE)
  return (start ? '…' : '') + text.slice(start, start + SNIPPET_LENGTH)
}

function sectionRoute({ chapter, heading }: SearchSection) {
  return `${MANUAL_PATH}/${chapter.id}${heading.depth === 1 ? '' : `#${heading.id}`}`
}

type ManualSearchProps = { index: ManualIndex }

/** 顶栏的搜索按钮与搜索弹窗；第一次打开时读取全部章节。 */
export function ManualSearch({ index }: ManualSearchProps) {
  const navigate = useNavigate()
  const [isOpen, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [sections, setSections] = useState<SearchSection[]>()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!isOpen || sections) return
    // 个别章节读不到时，先搜已读到的
    Promise.allSettled(
      index.chapters.map((c) =>
        loadManualFile(chapterFile(c.id)).then((f) => searchSections(c, f)),
      ),
    ).then((all) => setSections(all.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))))
  }, [isOpen, sections, index])

  const results = useMemo(() => groupByChapter(search(sections ?? [], query)), [sections, query])

  const openChange = (open: boolean) => {
    setOpen(open)
    if (!open) setQuery('')
  }

  const hint = !query.trim()
    ? '输入关键词，比如“内存”“光影”“崩溃”'
    : !sections
      ? '正在读取手册…'
      : `没有找到“${query.trim()}”`

  return (
    <Modal isOpen={isOpen} onOpenChange={openChange}>
      <Button
        variant="tertiary"
        size="sm"
        aria-label="搜索手册"
        className="w-60 justify-start text-muted max-md:w-auto"
      >
        <Search className="size-4" />
        <span className="max-md:hidden">搜索手册</span>
        <Kbd className="ml-auto max-md:hidden">
          {IS_MAC ? <Kbd.Abbr keyValue="command" /> : <Kbd.Content>Ctrl</Kbd.Content>}
          <Kbd.Content>K</Kbd.Content>
        </Kbd>
      </Button>
      <Modal.Backdrop>
        <Modal.Container placement="top" size="lg">
          <Modal.Dialog aria-label="搜索手册" className="p-0">
            <Autocomplete.Filter inputValue={query} onInputChange={setQuery}>
              <SearchField
                aria-label="搜索手册"
                autoFocus
                className="border-b border-separator p-3"
              >
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="搜索功能、设置、问题…" />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              <ListBox
                aria-label="搜索结果"
                className="max-h-[56vh] overflow-y-auto p-2"
                onAction={(key) => {
                  openChange(false)
                  navigate(String(key))
                }}
                renderEmptyState={() => (
                  <p className="px-4 py-7 text-center text-sm text-muted">{hint}</p>
                )}
              >
                {results.map(([chapter, items]) => (
                  <ListBox.Section key={chapter}>
                    <Header className="px-2.5 pt-2.5 pb-1 text-xs font-semibold text-muted">
                      {chapter}
                    </Header>
                    {items.map((s) => (
                      <ListBox.Item
                        key={sectionRoute(s)}
                        id={sectionRoute(s)}
                        textValue={s.heading.text}
                      >
                        <span className="flex min-w-0 flex-col">
                          <span className="text-sm font-semibold">
                            <Highlight text={s.heading.text} query={query} />
                          </span>
                          <span className="truncate text-[13px] text-muted">
                            <Highlight text={snippet(s.text, query)} query={query} />
                          </span>
                        </span>
                      </ListBox.Item>
                    ))}
                  </ListBox.Section>
                ))}
              </ListBox>
            </Autocomplete.Filter>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  )
}

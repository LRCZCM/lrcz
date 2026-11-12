import { Button, Modal, Skeleton, Table, Typography } from '@heroui/react'
import { ArrowUpRight, ImageOff, RotateCw } from 'lucide-react'
import type { MarkedToken, Token, Tokens } from 'marked'
import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router'
import { asMarked, manualRoute, plainText, type ManualFile } from './manual'

// 整窗截图宽 1280，占满正文；弹窗等局部截图按同一比例缩小，不被放大发糊
const FULL_SHOT_WIDTH = 1280

type Shot = { src: string; caption: string }
type MarkdownContext = { file: ManualFile; ids: Map<Token, string>; zoom: (shot: Shot) => void }
const Context = createContext<MarkdownContext>(null!)

type MarkdownProps = { file: ManualFile; tokens: MarkedToken[] }

/** 把 marked 解析出的手册内容渲染成页面；不渲染文中的 HTML。 */
export function Markdown({ file, tokens }: MarkdownProps) {
  // 关闭后保留上一张图，退场动画期间图片不消失
  const [shot, setShot] = useState<Shot>()
  const [isZoomed, setZoomed] = useState(false)
  const context = useMemo(
    () => ({
      file,
      ids: new Map<Token, string>(file.headings.map((h) => [h.token, h.id])),
      zoom: (next: Shot) => {
        setShot(next)
        setZoomed(true)
      },
    }),
    [file],
  )

  return (
    <Context value={context}>
      <div className="text-base leading-[1.85] text-foreground/85 [&>h1+h2]:mt-8 [&>h1+h2]:border-0 [&>h1+h2]:pt-0 [&>h1+p]:text-lg [&>h1+p]:text-muted">
        <Blocks tokens={tokens} />
      </div>
      {/* 弹窗只包住图片，点图片或四周空白都能关闭 */}
      <Modal isOpen={isZoomed} onOpenChange={setZoomed}>
        <Modal.Backdrop variant="blur">
          <Modal.Container className="justify-center sm:p-8">
            <Modal.Dialog
              aria-label={shot?.caption || '查看大图'}
              className="flex w-auto max-w-none flex-col items-center gap-3 overflow-visible rounded-none bg-transparent p-0 shadow-none"
            >
              <Modal.CloseTrigger className="static size-9 self-end rounded-full bg-background/90 shadow-md [&_svg]:size-4.5" />
              <img
                src={shot?.src}
                alt={shot?.caption}
                onClick={() => setZoomed(false)}
                className="max-h-[calc(100svh-10rem)] max-w-full cursor-zoom-out rounded-xl shadow-2xl"
              />
              {shot?.caption && (
                <p className="rounded-full bg-background/90 px-3.5 py-1 text-[13px] text-foreground shadow-md">
                  {shot.caption}
                </p>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </Context>
  )
}

function Blocks({ tokens, nested = false }: { tokens: Token[]; nested?: boolean }) {
  return asMarked(tokens).map((token, i) => <Block key={i} token={token} nested={nested} />)
}

function Block({ token, nested }: { token: MarkedToken; nested: boolean }) {
  switch (token.type) {
    case 'heading':
      return <Heading token={token} />
    case 'paragraph': {
      const [only, ...others] = asMarked(token.tokens)
      if (only.type === 'image' && !others.length) return <Figure token={only} />
      return (
        <p className="mb-4">
          <Inlines tokens={token.tokens} />
        </p>
      )
    }
    // 紧凑列表项里的文字
    case 'text':
      return token.tokens ? <Inlines tokens={token.tokens} /> : token.text
    case 'list':
      return <List token={token} nested={nested} />
    case 'table':
      return <MarkdownTable token={token} />
    case 'blockquote':
      return (
        <blockquote className="my-5 rounded-xl bg-accent-soft px-4 py-3 [&>p:last-child]:mb-0">
          <Blocks tokens={token.tokens} />
        </blockquote>
      )
    case 'code':
      return (
        <pre className="my-5 overflow-x-auto rounded-xl bg-default px-4 py-3.5 font-mono text-sm leading-relaxed">
          {token.text}
        </pre>
      )
    case 'hr':
      return <hr className="my-10 border-separator" />
    default:
      return null
  }
}

function Heading({ token }: { token: Tokens.Heading }) {
  const id = use(Context).ids.get(token)
  const children = <Inlines tokens={token.tokens} />
  if (token.depth === 1) {
    return (
      <h1 className="mb-5 text-[clamp(30px,4vw,40px)] leading-tight font-bold tracking-tight text-foreground">
        {children}
      </h1>
    )
  }
  const H = token.depth === 2 ? 'h2' : 'h3'
  return (
    <H
      id={id}
      className={`group relative scroll-mt-28 font-semibold text-foreground xl:scroll-mt-20 ${
        H === 'h2'
          ? 'mt-14 mb-4 border-t border-separator pt-7 text-2xl leading-snug tracking-tight'
          : 'mt-9 mb-2.5 text-lg'
      }`}
    >
      <Link
        to={{ hash: id }}
        aria-hidden
        tabIndex={-1}
        className="absolute -left-[1.1em] font-normal text-muted opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent max-md:hidden"
      >
        #
      </Link>
      {children}
    </H>
  )
}

function Figure({ token }: { token: Tokens.Image }) {
  const { file, zoom } = use(Context)
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading')
  const [width, setWidth] = useState<number>()
  const src = new URL(token.href, file.url).href
  const frame =
    'rounded-xl border border-separator shadow-[0_1px_2px_rgb(0_0_0/0.04),0_8px_24px_-12px_rgb(0_0_0/0.12)]'

  return (
    <figure className="my-7">
      <div
        style={{ width: width && `${Math.min(100, (width / FULL_SHOT_WIDTH) * 100)}%` }}
        className="relative mx-auto"
      >
        {/* 尺寸未知，先按整窗截图的比例占位 */}
        {status === 'loading' && <Skeleton className="aspect-[16/10] rounded-xl" />}
        {status === 'error' ? (
          <div
            className={`grid aspect-[16/10] place-content-center justify-items-center gap-3 bg-default text-sm text-muted ${frame}`}
          >
            <ImageOff className="size-6" />
            截图加载失败
            <Button variant="tertiary" size="sm" onPress={() => setStatus('loading')}>
              <RotateCw className="size-3.5" />
              重试
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => zoom({ src, caption: token.text })}
            aria-label={`查看大图：${token.text}`}
            disabled={status === 'loading'}
            className={`block w-full cursor-zoom-in overflow-hidden transition-[opacity,translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_2px_4px_rgb(0_0_0/0.04),0_16px_32px_-12px_rgb(0_0_0/0.2)] ${frame} ${
              status === 'loading' ? 'absolute inset-0 opacity-0' : ''
            }`}
          >
            <img
              src={src}
              alt={token.text}
              loading="lazy"
              onLoad={(e) => {
                setWidth(e.currentTarget.naturalWidth)
                setStatus('done')
              }}
              onError={() => setStatus('error')}
              className="block size-full bg-default"
            />
          </button>
        )}
      </div>
      {token.text && (
        <figcaption className="mt-2.5 text-center text-[13px] text-muted">{token.text}</figcaption>
      )}
    </figure>
  )
}

// 拆出“**名词**：解释”形式的列表项，不是这种形式时返回 null
function splitTerm(item: Tokens.ListItem) {
  const [first, ...rest] = asMarked(item.tokens)
  if (first.type !== 'text' || !first.tokens) return null
  const [term, ...description] = asMarked(first.tokens)
  if (term.type !== 'strong' || !description[0]?.raw.startsWith('：')) return null
  return { term, description, rest }
}

function List({ token, nested }: { token: Tokens.List; nested: boolean }) {
  // 正文顶层的有序列表画成步骤
  if (token.ordered && !nested) {
    return (
      <ol className="mb-4">
        {token.items.map((item, i) => (
          <li key={i} className="relative pb-4 pl-11">
            <span className="absolute top-0.5 left-0 grid size-7 place-items-center rounded-full bg-accent-soft text-[13px] font-bold text-accent-soft-foreground">
              {Number(token.start || 1) + i}
            </span>
            {i < token.items.length - 1 && (
              <span className="absolute top-9 bottom-1.5 left-[13.5px] w-px bg-separator" />
            )}
            <Blocks tokens={item.tokens} nested />
          </li>
        ))}
      </ol>
    )
  }

  // 每项都是“**名词**：解释”的列表画成术语表
  const terms = token.items.map(splitTerm)
  if (terms.length > 1 && terms.every((t) => t !== null)) {
    return (
      <dl className="mb-5 border-t border-separator">
        {terms.map(({ term, description, rest }, i) => {
          return (
            <div
              key={i}
              className="grid gap-0.5 border-b border-separator py-3 md:grid-cols-[9.5em_1fr] md:gap-4"
            >
              <dt className="font-semibold text-foreground">
                <Inlines tokens={term.tokens} />
              </dt>
              <dd>
                <Inlines tokens={description} trimColon />
                <Blocks tokens={rest} nested />
              </dd>
            </div>
          )
        })}
      </dl>
    )
  }

  const L = token.ordered ? 'ol' : 'ul'
  return (
    <L
      className={`${token.ordered ? 'list-decimal' : 'list-disc'} pl-6 marker:text-muted ${nested ? 'mt-1.5' : 'mb-4'}`}
    >
      {token.items.map((item, i) => (
        <li key={i} className="my-1.5 pl-1">
          <Blocks tokens={item.tokens} nested />
        </li>
      ))}
    </L>
  )
}

function MarkdownTable({ token }: { token: Tokens.Table }) {
  return (
    <Table className="my-5">
      <Table.ScrollContainer>
        <Table.Content aria-label={plainText(token.header[0].tokens)}>
          <Table.Header>
            {token.header.map((cell, i) => (
              <Table.Column key={i} isRowHeader={i === 0}>
                <Inlines tokens={cell.tokens} />
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {token.rows.map((row, i) => (
              <Table.Row key={i}>
                {row.map((cell, j) => (
                  <Table.Cell key={j} className={j === 0 ? 'font-semibold whitespace-nowrap' : ''}>
                    <Inlines tokens={cell.tokens} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}

function Inlines({ tokens, trimColon = false }: { tokens: Token[]; trimColon?: boolean }) {
  return asMarked(tokens).map((token, i) => (
    <Inline key={i} token={token} trimColon={trimColon && i === 0} />
  ))
}

function Inline({ token, trimColon }: { token: MarkedToken; trimColon: boolean }): ReactNode {
  switch (token.type) {
    case 'text':
      return token.tokens ? (
        <Inlines tokens={token.tokens} />
      ) : trimColon ? (
        token.text.replace(/^：/, '')
      ) : (
        token.text
      )
    case 'escape':
      return token.text
    case 'strong':
      return (
        <strong className="font-semibold text-foreground">
          <Inlines tokens={token.tokens} />
        </strong>
      )
    case 'em':
      return (
        <em>
          <Inlines tokens={token.tokens} />
        </em>
      )
    case 'del':
      return (
        <del>
          <Inlines tokens={token.tokens} />
        </del>
      )
    case 'codespan':
      return <Typography.Code className="text-[0.88em]">{token.text}</Typography.Code>
    case 'br':
      return <br />
    case 'link':
      return <MarkdownLink token={token} />
    case 'image':
      return <InlineImage token={token} />
    // 文中的 HTML 当作普通文字显示，不执行
    case 'html':
      return token.text
    default:
      return null
  }
}

function InlineImage({ token }: { token: Tokens.Image }) {
  const { file } = use(Context)
  return (
    <img src={new URL(token.href, file.url).href} alt={token.text} className="inline max-w-full" />
  )
}

const linkClass =
  'text-accent underline decoration-accent/30 underline-offset-[3px] transition-[text-decoration-color] hover:decoration-accent'

function MarkdownLink({ token }: { token: Tokens.Link }) {
  const { file } = use(Context)
  const children = <Inlines tokens={token.tokens} />
  const route = manualRoute(token.href, file)
  if (route) {
    return (
      <Link to={route} className={linkClass}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={new URL(token.href, file.url).href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkClass}
    >
      {children}
      <ArrowUpRight className="mb-0.5 ml-0.5 inline size-3.5" />
    </a>
  )
}

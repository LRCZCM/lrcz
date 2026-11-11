import type { ReactNode } from 'react'

type BtnProps = { children: ReactNode; primary?: boolean; demo?: string; className?: string }

export function Btn({ children, primary, demo, className = '' }: BtnProps) {
  return (
    <span
      data-demo={demo}
      className={`inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[13px] whitespace-nowrap ${primary ? 'bg-(--lm-primary) text-(--lm-on-primary)' : 'bg-(--lm-default)'} ${className}`}
    >
      {children}
    </span>
  )
}

export function IconBtn({ children, demo }: { children: ReactNode; demo?: string }) {
  return (
    <span
      data-demo={demo}
      className="grid size-8 shrink-0 place-items-center rounded-full bg-(--lm-default)"
    >
      {children}
    </span>
  )
}

type SegProps = { items: string[]; active: number; demo?: (index: number) => string | undefined }

export function Seg({ items, active, demo }: SegProps) {
  return (
    <span className="inline-flex shrink-0 rounded-full bg-(--lm-default) p-[3px] text-[13px]">
      {items.map((item, i) => (
        <span
          key={item}
          data-demo={demo?.(i)}
          className={`grid h-[26px] place-items-center rounded-full px-3.5 whitespace-nowrap transition-colors duration-200 ${i === active ? 'bg-(--lm-seg) shadow-sm' : 'text-(--lm-text2)'}`}
        >
          {item}
        </span>
      ))}
    </span>
  )
}

export function Switch({ on, demo }: { on: boolean; demo?: string }) {
  return (
    <span
      data-demo={demo}
      className={`relative h-5 w-10 shrink-0 rounded-full transition-colors duration-200 ${on ? 'bg-(--lm-primary)' : 'bg-(--lm-default) shadow-[inset_0_0_0_1px_var(--lm-edge)]'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-4 w-[22px] rounded-full bg-white shadow transition-transform duration-200 ${on ? 'translate-x-[14px]' : ''}`}
      />
    </span>
  )
}

export function Panel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-3xl bg-(--lm-panel) shadow-[0_2px_10px_rgba(0,0,0,0.1)] backdrop-blur-2xl backdrop-saturate-150 transition-colors duration-500 ${className}`}
    >
      {children}
    </div>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl bg-(--lm-card) shadow-[0_1px_3px_rgba(0,0,0,0.08)] ${className}`}>
      {children}
    </div>
  )
}

export function Group({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`text-xs font-bold text-(--lm-muted) ${className}`}>{children}</div>
}

export function Field({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`flex h-8 shrink-0 items-center rounded-xl bg-(--lm-field) px-3 text-[13px] shadow-[inset_0_0_0_1px_var(--lm-edge)] ${className}`}
    >
      {children}
    </div>
  )
}

// 模组、服务器等资源的图标：不使用第三方项目的标志，用色块加首字母代替
export function Tile({ text, color, size = 40 }: { text: string; color: string; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-lg font-bold text-white"
      style={{ width: size, height: size, background: color, fontSize: size * 0.42 }}
    >
      {text}
    </span>
  )
}

export function Pixel({
  src,
  size,
  className = '',
}: {
  src: string
  size: number
  className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      className={`shrink-0 [image-rendering:pixelated] ${className}`}
      style={{ width: size, height: size }}
    />
  )
}

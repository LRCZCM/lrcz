import { buttonVariants } from '@heroui/react'
import { Mail } from 'lucide-react'
import { motion } from 'motion/react'
import { site } from '@/app/site'
import { SiteFooter } from '@/components/SiteFooter'
import { BrandMark } from './BrandMark'
import { ProductMenu } from './ProductMenu'

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  }
}

export function HomePage() {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* 底部多留 8vh，让整块内容落在视觉中心（略高于几何中心） */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16 pb-[calc(4rem+8vh)] text-center">
        <h1 className="flex items-center gap-[0.18em] text-[clamp(48px,10vw,120px)] leading-none font-semibold tracking-tight">
          <BrandMark className="h-[1.15em] w-auto shrink-0 overflow-visible" />
          <motion.span {...rise(0.6)}>{site.nameZh}</motion.span>
        </h1>
        <motion.p
          {...rise(0.75)}
          className="mt-5 pl-[0.5em] text-[15px] tracking-[0.5em] text-muted"
        >
          {site.nameEn}
        </motion.p>
        <motion.div {...rise(0.9)} className="mt-12 flex flex-wrap justify-center gap-3">
          <ProductMenu />
          <a
            href={`mailto:${site.email}`}
            className={buttonVariants({ size: 'lg', variant: 'tertiary' })}
          >
            <Mail className="size-4" />
            {site.email}
          </a>
        </motion.div>
      </main>
      <SiteFooter />
    </div>
  )
}

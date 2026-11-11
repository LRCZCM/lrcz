import { buttonVariants, Card } from '@heroui/react'
import { Activity, ArrowUpRight, Box, Download, Layers, RefreshCw, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router'
import lcmlIcon from '@/assets/lcml-icon.svg'
import { site } from '@/app/site'
import { SiteFooter } from '@/components/SiteFooter'
import { ChangelogSection } from './ChangelogSection'
import { DemoSection } from './DemoSection'
import { useChangelog } from './useChangelog'

// 安装包与反馈都在公开发布仓库（不含源码）
const GITHUB_URL = 'https://github.com/LRCZCM/LCML-release'
const DOWNLOAD_URL = 'https://github.com/LRCZCM/LCML-release/releases/latest'
const FEEDBACK_URL = 'https://github.com/LRCZCM/LCML-release/issues/new/choose'

const features = [
  { Icon: Layers, title: '五种加载器', text: '原版、Fabric、Quilt、Forge、NeoForge' },
  { Icon: Search, title: '资源一站搜', text: 'Modrinth 与 CurseForge 的模组、光影、资源包' },
  { Icon: Box, title: '整合包', text: '导入、导出、原地更新' },
  { Icon: Activity, title: '崩溃分析', text: '自动找原因，给出处理建议' },
  { Icon: Download, title: '下载不怕断', text: '暂停续传，缺 Java 自动装' },
  { Icon: RefreshCw, title: '自动更新', text: '一个 exe，免安装，新版自动下载' },
]

const ease = [0.22, 1, 0.36, 1] as const

function rise(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1, ease, delay },
  }
}

const external = { target: '_blank', rel: 'noopener noreferrer' }

export function LcmlPage() {
  const changelog = useChangelog()
  const latest = changelog.state.status === 'done' ? changelog.state.releases[0].version : null

  return (
    <div className="min-h-svh bg-background text-foreground">
      <title>LCML · 来日创造</title>
      <header className="sticky top-0 z-20 flex h-13 items-center gap-6 border-b border-separator bg-background/80 px-[max(16px,calc(50%-540px))] text-sm backdrop-blur-xl backdrop-saturate-150">
        <Link to="/" className="text-muted transition-colors hover:text-foreground">
          {site.nameZh}
        </Link>
        <span className="flex items-center gap-2 font-semibold">
          <img src={lcmlIcon} alt="" className="size-[22px] rounded-[22%]" />
          LCML
        </span>
        <nav className="ml-auto flex items-center gap-6 text-muted">
          <a href="#features" className="transition-colors hover:text-foreground max-sm:hidden">
            功能
          </a>
          <a href="#changelog" className="transition-colors hover:text-foreground max-sm:hidden">
            更新日志
          </a>
          <a
            href={FEEDBACK_URL}
            {...external}
            className="transition-colors hover:text-foreground max-sm:hidden"
          >
            反馈
          </a>
          <a href={DOWNLOAD_URL} {...external} className={buttonVariants({ size: 'sm' })}>
            下载
          </a>
        </nav>
      </header>

      <section className="px-4 pt-28 pb-14 text-center">
        <h1 className="flex items-center justify-center gap-[0.2em] text-[clamp(56px,11vw,112px)] leading-none font-bold tracking-tight">
          <motion.img
            {...rise(0)}
            src={lcmlIcon}
            alt=""
            className="size-[0.95em] rounded-[24%] shadow-[0_0.18em_0.36em_-0.1em_rgba(0,0,0,0.35)]"
          />
          <motion.span {...rise(0.1)}>LCML</motion.span>
        </h1>
        <motion.p {...rise(0.2)} className="mt-5 text-[clamp(19px,2.6vw,26px)] text-muted">
          Minecraft 启动器。简单，好看，够快。
        </motion.p>
        <motion.div {...rise(0.3)} className="mt-9 flex flex-col items-center gap-3.5">
          <span className="flex flex-wrap justify-center gap-3">
            <a href={DOWNLOAD_URL} {...external} className={buttonVariants({ size: 'lg' })}>
              <Download className="size-4" />
              下载 Windows 版
            </a>
            <a
              href={GITHUB_URL}
              {...external}
              className={buttonVariants({ size: 'lg', variant: 'tertiary' })}
            >
              GitHub
              <ArrowUpRight className="size-4" />
            </a>
          </span>
          <small className="text-[13px] text-muted">
            {latest && `${latest} · `}Windows 10 / 11 · 免安装
          </small>
        </motion.div>
      </section>

      <motion.div {...rise(0.45)}>
        <DemoSection />
      </motion.div>

      <section id="features" className="mx-auto max-w-[1080px] scroll-mt-14 px-4 pt-32">
        <h2 className="text-center text-[clamp(32px,5vw,48px)] font-bold tracking-tight">
          该有的，都有。
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {features.map(({ Icon, title, text }) => (
            <Card key={title} className="p-7">
              <Icon className="size-6" />
              <b className="mt-4 block text-[17px]">{title}</b>
              <span className="mt-1.5 block text-sm leading-relaxed text-muted">{text}</span>
            </Card>
          ))}
        </div>
      </section>

      <section id="changelog" className="scroll-mt-14 px-4 pt-32">
        <h2 className="text-center text-[clamp(32px,5vw,48px)] font-bold tracking-tight">
          更新日志
        </h2>
        <ChangelogSection {...changelog} />
      </section>

      <section className="px-4 pt-36 pb-32 text-center">
        <img src={lcmlIcon} alt="" className="mx-auto size-[72px] rounded-[24%]" />
        <h2 className="mt-5 text-[clamp(32px,5vw,48px)] font-bold tracking-tight">现在就开始。</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={DOWNLOAD_URL} {...external} className={buttonVariants({ size: 'lg' })}>
            <Download className="size-4" />
            下载 LCML
          </a>
          <a
            href={FEEDBACK_URL}
            {...external}
            className={buttonVariants({ size: 'lg', variant: 'tertiary' })}
          >
            反馈问题
          </a>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

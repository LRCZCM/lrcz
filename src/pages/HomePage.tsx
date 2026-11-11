import { Button } from '@heroui/react'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

// 初始化占位页：验证 HeroUI、Tailwind、Lucide、Motion 已接通，开始做真实页面时替换。
export function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <motion.section
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <h1 className="text-2xl font-semibold">LRCZ</h1>
        <Button variant="primary">
          <Sparkles className="size-4" />
          开始
        </Button>
      </motion.section>
    </main>
  )
}

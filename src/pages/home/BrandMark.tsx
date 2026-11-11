import { motion } from 'motion/react'

const ease = [0.22, 1, 0.36, 1] as const

type BrandMarkProps = { className?: string }

// 品牌标志：橙色“太阳”方块落到已造好的方块上，寓意“来日创造”。
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg viewBox="56 20 144 216" aria-hidden className={className}>
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease }}
      >
        <path d="M128 116 176.5 144 128 172 79.5 144Z" fill="#4A5A80" />
        <path d="M79.5 144 128 172V228L79.5 200Z" fill="#34406A" />
        <path d="M128 172 176.5 144V200L128 228Z" fill="#263052" />
      </motion.g>
      <motion.path
        d="M128 126 166 144 128 162 90 144Z"
        fill="#000"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.16 }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
      />
      <motion.g
        initial={{ opacity: 0, y: -90, rotate: -24 }}
        animate={{ opacity: 1, y: 0, rotate: -10 }}
        transition={{ duration: 1.4, ease, delay: 0.2 }}
      >
        <path d="M128 28 176.5 56 128 84 79.5 56Z" fill="#FFC07A" />
        <path d="M79.5 56 128 84V140L79.5 112Z" fill="#FF8A3D" />
        <path d="M128 84 176.5 56V112L128 140Z" fill="#E0662A" />
      </motion.g>
    </svg>
  )
}

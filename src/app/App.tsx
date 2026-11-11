import { MotionConfig } from 'motion/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { HomePage } from '@/pages/home/HomePage'
import { LcmlPage } from '@/pages/lcml/LcmlPage'

export function App() {
  // 系统开启“减少动效”时，Motion 去掉位移与缩放，只保留淡入。
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/lcml" element={<LcmlPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  )
}

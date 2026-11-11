import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/index.css'
import { App } from '@/app/App'

// 颜色模式跟随系统：HeroUI 的深色主题由根元素的 dark 类开启。
const darkQuery = matchMedia('(prefers-color-scheme: dark)')
const applyColorScheme = () => document.documentElement.classList.toggle('dark', darkQuery.matches)
applyColorScheme()
darkQuery.addEventListener('change', applyColorScheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

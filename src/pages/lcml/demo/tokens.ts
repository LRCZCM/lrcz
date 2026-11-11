import type { CSSProperties } from 'react'
import type { Theme } from './state'

type Tokens = CSSProperties & Record<`--lm-${string}`, string>

const light: Tokens = {
  '--lm-text': '#242424',
  '--lm-text2': '#6b6b6b',
  '--lm-muted': '#898989',
  '--lm-primary': '#242424',
  '--lm-on-primary': '#ffffff',
  '--lm-default': '#ebebec',
  '--lm-panel': 'rgba(255,255,255,0.72)',
  '--lm-card': 'rgba(255,255,255,0.9)',
  '--lm-overlay': '#ffffff',
  '--lm-sep': '#e9e9eb',
  '--lm-seg': '#ffffff',
  '--lm-field': '#ffffff',
  '--lm-edge': 'rgba(0,0,0,0.12)',
  '--lm-success': '#2e8b57',
  '--lm-glow': 'rgba(255,255,255,0.75)',
}
const dark: Tokens = {
  ...light,
  '--lm-text': '#ececec',
  '--lm-text2': '#a8a8a8',
  '--lm-muted': '#808080',
  '--lm-default': '#2b2b2e',
  '--lm-card': 'rgba(255,255,255,0.06)',
  '--lm-overlay': '#2c2c2e',
  '--lm-sep': 'rgba(255,255,255,0.07)',
  '--lm-seg': '#4a4a50',
  '--lm-field': 'rgba(255,255,255,0.08)',
  '--lm-edge': 'rgba(255,255,255,0.08)',
  '--lm-success': '#3fb871',
  '--lm-glow': 'rgba(0,0,0,0.45)',
}

// 启动器自己的配色（取自 LCML 的 tokens.css 与三套外观预设），与本站主题无关
export const themeTokens: Record<Theme, Tokens> = {
  meadow: light,
  dusk: {
    ...dark,
    '--lm-primary': '#f08a3c',
    '--lm-on-primary': '#1d1209',
    '--lm-panel': 'rgba(58,46,36,0.7)',
  },
  night: {
    ...dark,
    '--lm-primary': '#a78bfa',
    '--lm-on-primary': '#160f2a',
    '--lm-panel': 'rgba(46,38,58,0.65)',
  },
}

// 启动器的线性图标：16px、线宽 1.6
export const ic = { className: 'size-4 shrink-0', strokeWidth: 1.6 }

export const fade =
  'transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none'

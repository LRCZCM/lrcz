import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const MANUAL_REPO = 'LRCZCM/LCML-release'
const MANUAL_DIR = 'docs/manual/'
// 与 src/pages/lcml/manual/manual.ts 的 MANUAL_FILES 对应
const MANUAL_OUT = 'public/lcml-manual'

/** 启动开发服务器与构建时，把使用手册（含截图）从发布仓库下载到 public/，随网站一起发布。 */
function lcmlManual(): Plugin {
  // 手册改放私有仓库时，设置只读令牌 MANUAL_TOKEN；只在本机构建时使用，不会进入网页
  const token = process.env.MANUAL_TOKEN
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined
  const get = async (url: string) => {
    const response = await fetch(url, { headers })
    if (!response.ok) throw new Error(`下载使用手册失败：${url} 返回 ${response.status}`)
    return response
  }

  return {
    name: 'lcml-manual',
    async buildStart() {
      const api = `https://api.github.com/repos/${MANUAL_REPO}/git/trees/main?recursive=1`
      const { tree } = (await (await get(api)).json()) as { tree: { path: string; type: string }[] }
      const files = tree.filter((t) => t.type === 'blob' && t.path.startsWith(MANUAL_DIR))
      await rm(MANUAL_OUT, { recursive: true, force: true })
      await Promise.all(
        files.map(async ({ path }) => {
          const out = join(MANUAL_OUT, path.slice(MANUAL_DIR.length))
          const raw = `https://raw.githubusercontent.com/${MANUAL_REPO}/main/${path}`
          await mkdir(dirname(out), { recursive: true })
          await writeFile(out, Buffer.from(await (await get(raw)).arrayBuffer()))
        }),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), lcmlManual()],
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})

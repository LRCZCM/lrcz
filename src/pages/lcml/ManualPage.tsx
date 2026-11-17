import { buttonVariants } from '@heroui/react'
import { Boxes, Download, LifeBuoy, Rocket, Settings, UserRound, Wrench } from 'lucide-react'
import { Link, useParams } from 'react-router'
import lcmlIcon from '@/assets/lcml-icon.svg'
import { pageRoute, type ManualSource } from '@/components/manual/manual'
import { ManualView } from '@/components/manual/ManualView'
import { DOWNLOAD_URL, FEEDBACK_URL } from './release'

const MANUAL_PATH = '/lcml/manual'
// 构建时由 vite.config.ts 从发布仓库下载到这里，随网站一起发布
const MANUAL_FILES = '/lcml-manual/'

const source: ManualSource = {
  name: 'LCML 使用手册',
  path: MANUAL_PATH,
  files: MANUAL_FILES,
  route: (url) => {
    const [, name] = url.pathname.match(/^\/lcml-manual\/([\w-]+)\.md$/) ?? []
    return name ? pageRoute(MANUAL_PATH, name) : null
  },
  // README 的目录里没写“### 分组名”时用这套分组；写了就以 README 为准
  defaultGroups: {
    开始: ['getting-started', 'interface', 'home'],
    账号与皮肤: ['accounts', 'skin'],
    下载: ['download-game', 'download-resources', 'modpacks'],
    实例: [
      'instances',
      'instance-content',
      'worlds-servers',
      'launch-options',
      'java',
      'backup-history',
    ],
    排错与工具: ['logs-diagnosis', 'tools'],
    设置与帮助: ['settings', 'faq'],
  },
  groupIcons: {
    开始: Rocket,
    账号与皮肤: UserRound,
    下载: Download,
    实例: Boxes,
    排错与工具: Wrench,
    设置与帮助: Settings,
    其他: LifeBuoy,
  },
  startHint: '第一次用？几分钟就能进游戏',
  searchHint: '输入关键词，比如“内存”“光影”“崩溃”',
  feedback: { label: '在 Issues 提问', href: FEEDBACK_URL },
}

/** LCML 使用手册：`/lcml/manual` 为首页，`/lcml/manual/<章节>` 为各章，内容读自发布仓库。 */
export function ManualPage() {
  const { chapter } = useParams()
  return (
    <ManualView
      source={source}
      chapter={chapter}
      brand={
        <>
          <Link to="/lcml" className="flex items-center gap-2 font-semibold">
            <img src={lcmlIcon} alt="" className="size-[22px] rounded-[22%]" />
            LCML
          </Link>
          <Link
            to={MANUAL_PATH}
            className="-ml-2 border-l border-separator pl-3 text-muted transition-colors hover:text-foreground max-md:hidden"
          >
            使用手册
          </Link>
        </>
      }
      actions={
        <a
          href={DOWNLOAD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ size: 'sm' })}
        >
          下载
        </a>
      }
    />
  )
}

import { Link } from 'react-router'
import pluginsIcon from '@/assets/plugins-icon.svg'
import { site } from '@/app/site'

/** 插件列表与插件详情共用的吸顶顶栏，写法同 LCML 产品页。 */
export function PluginsHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-13 items-center gap-6 border-b border-separator bg-background/80 px-[max(16px,calc(50%-540px))] text-sm backdrop-blur-xl backdrop-saturate-150">
      <Link to="/" className="text-muted transition-colors hover:text-foreground">
        {site.nameZh}
      </Link>
      <Link to="/plugins" className="flex items-center gap-2 font-semibold">
        <img src={pluginsIcon} alt="" className="size-[22px] rounded-[22%]" />
        插件
      </Link>
    </header>
  )
}

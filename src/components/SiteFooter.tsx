import { site } from '@/app/site'

const year = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-separator px-4 py-5 text-xs text-muted">
      <span>
        © {year} {site.author}
      </span>
      <a
        href={site.icpUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="transition-colors hover:text-foreground"
      >
        {site.icp}
      </a>
    </footer>
  )
}

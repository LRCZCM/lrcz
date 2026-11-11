import { Button, Chip, Skeleton } from '@heroui/react'
import { useState } from 'react'
import type { ChangeType, useChangelog } from './useChangelog'

const chipColor: Record<ChangeType, 'success' | 'accent' | 'warning' | 'danger'> = {
  增加: 'success',
  更新: 'accent',
  修复: 'warning',
  移除: 'danger',
}

// 默认显示最近 3 个版本，其余点“显示全部”展开
const FOLDED = 3

type ChangelogSectionProps = ReturnType<typeof useChangelog>

export function ChangelogSection({ state, retry }: ChangelogSectionProps) {
  const [all, setAll] = useState(false)

  if (state.status === 'loading') {
    return (
      <div className="mx-auto mt-12 max-w-[720px]">
        {[3, 5].map((lines) => (
          <div
            key={lines}
            className="grid gap-3 border-t border-separator py-7 md:grid-cols-[160px_1fr]"
          >
            <Skeleton className="h-5 w-28 rounded-lg" />
            <div className="grid gap-3">
              {Array.from({ length: lines }, (_, i) => (
                <Skeleton key={i} className="h-5 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="mt-12 flex flex-col items-center gap-4 text-center">
        <p className="text-muted">暂时读取不到更新日志，请检查网络后重试。</p>
        <Button variant="tertiary" onPress={retry}>
          重试
        </Button>
      </div>
    )
  }

  const releases = all ? state.releases : state.releases.slice(0, FOLDED)
  return (
    <div className="mx-auto mt-12 max-w-[720px]">
      {releases.map((release, i) => (
        <div
          key={release.version}
          className="grid items-start gap-3 border-t border-separator py-7 md:grid-cols-[160px_1fr]"
        >
          <h3 className="flex items-center gap-2 text-[17px] font-semibold tabular-nums">
            {release.version}
            {i === 0 && (
              <Chip size="sm" variant="primary">
                最新
              </Chip>
            )}
          </h3>
          <ul className="grid gap-2.5">
            {release.items.map((item) => (
              <li key={item.text} className="flex gap-2.5 text-[15px] leading-relaxed">
                {item.type && (
                  <Chip
                    size="sm"
                    variant="soft"
                    color={chipColor[item.type]}
                    className="mt-0.5 shrink-0 self-start"
                  >
                    {item.type}
                  </Chip>
                )}
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {!all && state.releases.length > FOLDED && (
        <div className="flex justify-center pt-2">
          <Button variant="tertiary" size="sm" onPress={() => setAll(true)}>
            显示全部
          </Button>
        </div>
      )}
    </div>
  )
}

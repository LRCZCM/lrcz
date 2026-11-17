import { useEffect, useState } from 'react'
import { loadManualFile, useManualSource, type ManualFile } from './manual'

type Result = { name: string; attempt: number } & ({ file: ManualFile } | { failed: true })

export type ManualFileState =
  { status: 'loading' } | { status: 'error' } | { status: 'done'; file: ManualFile }

/** 读取当前手册里的一个文件；切换文件时立即回到加载状态，晚到的旧结果不会覆盖新的。 */
export function useManualFile(fileName: string) {
  // 不同手册的同名文件（如各插件的 README.md）要区分开
  const name = useManualSource().files + fileName
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<Result>()

  useEffect(() => {
    let active = true
    loadManualFile(name).then(
      (file) => active && setResult({ name, attempt, file }),
      () => active && setResult({ name, attempt, failed: true }),
    )
    return () => {
      active = false
    }
  }, [name, attempt])

  const state: ManualFileState =
    result?.name !== name || result.attempt !== attempt
      ? { status: 'loading' }
      : 'file' in result
        ? { status: 'done', file: result.file }
        : { status: 'error' }

  return { state, retry: () => setAttempt((n) => n + 1) }
}

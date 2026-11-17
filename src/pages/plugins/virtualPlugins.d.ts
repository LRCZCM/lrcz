// 插件列表由 vite.config.ts 的 lcPlugins 插件在启动开发服务器与构建时从 LcPlugins 仓库生成
declare module 'virtual:plugins' {
  export type PluginInfo = {
    /** 路由用的标识，插件名的小写，如 lctoolbelt */
    id: string
    /** 插件名，如 LcToolBelt */
    name: string
    /** 中文名 */
    title: string
    /** 一句话介绍 */
    summary: string
    /** 分类，如“玩法”“前置库” */
    category: string
    /** 封面截图与图标的本站地址 */
    cover: string
    icon: string
    version: string
    /** 支持的 Paper 版本，如 26.1–26.3 */
    paper: string
    /** 前置插件名 */
    depends: string[]
  }
  export const plugins: PluginInfo[]
}

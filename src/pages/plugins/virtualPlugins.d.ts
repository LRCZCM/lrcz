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
    /** 版本号，即构建网站时 Jenkins 最近一次成功构建的名称；页面打开后由 useLatestBuilds 换成最新的。
     * 不允许下载或还没有 Jenkins 任务、成功构建时与 download 一起缺失 */
    version?: string
    /** 该版本 jar 的下载地址 */
    download?: string
    /** Jenkins 上该插件全部构建的页面，用作历史版本；只有 plugin.json 的 download_plugin 为 true 时才有 */
    builds?: string
    /** 支持的 Paper 版本，如 26.1–26.3 */
    paper: string
    /** 前置插件名 */
    depends: string[]
  }
  export const plugins: PluginInfo[]
}

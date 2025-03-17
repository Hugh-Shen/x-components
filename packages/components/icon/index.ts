import { App } from 'vue'
import Icon from './src/icon.vue'
import { iconProps } from './src/icon'
// 从 types.ts 导入所有类型
import type { IconOptions, XIconInstance } from './types'

// 导出组件
export { Icon }

// 导出类型
export type { IconOptions, XIconInstance }
export { iconProps }

// 默认导出
export default {
  install(app: App) {
    app.component('x-icon', Icon)
  }
}
import { App } from 'vue'
import Icon from './src/icon.vue'
import { iconProps } from './src/icon'
import type { IconOptions } from './src/icon'
// 导入类型定义
import type { XIconInstance } from './types'

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
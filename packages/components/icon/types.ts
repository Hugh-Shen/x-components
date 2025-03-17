import Icon from './src/icon.vue'
import type { IconOptions as OriginalIconOptions } from './src/icon'

// 重新导出原始类型
export type IconOptions = OriginalIconOptions

// 导出组件实例类型
export type XIconInstance = InstanceType<typeof Icon>

// 全局组件类型声明
declare module 'vue' {
  export interface GlobalComponents {
    'x-icon': typeof Icon
  }
}
import Icon from './src/icon.vue'
import type { IconOptions } from './src/icon'

// 确保组件名称与注册名称一致（kebab-case）
declare module 'vue' {
  export interface GlobalComponents {
    'x-icon': typeof Icon
  }
}

// 导出组件实例类型
export type XIconInstance = InstanceType<typeof Icon>

// 导出组件 props 类型，方便用户使用
export { IconOptions }
import Icon from './icon'

export { Icon }


import type { App } from 'vue'

// 安装所有组件
export default {
  install(app: App) {
    // 注册所有组件
    app.component('x-icon', Icon) // 确保直接使用组件实例
  }
}


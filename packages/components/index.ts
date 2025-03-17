// 在使用 import.meta.glob 这个 Vite 特有的 API，它在编译时会被转换为具体的导入语句，但在 TypeScript 编译过程中可能无法正确处理。
import type { App, Component } from 'vue'
// 手动导入所有组件
import Icon from './icon'
// 未来添加更多组件时在这里导入
// import Button from './button'
// import Input from './input'

// 导出所有组件，保持类型信息
export { Icon }
// export { Button }
// export { Input }

// 组件映射表，组件名称 -> 组件实例
const components: Record<string, Component> = {
  'x-icon': Icon,
  // 'x-button': Button,
  // 'x-input': Input,
}

// 安装所有组件
export default {
  install(app: App) {
    // 注册所有组件
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
  }
}


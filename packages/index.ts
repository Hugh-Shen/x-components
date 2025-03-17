// 导入 Vue 相关
import { App } from 'vue'
import * as components from './components'

// 定义版本号
const version = '1.0.0' // 直接在文件中定义版本号

// 导出所有组件
export * from './components'

// 导出版本号
export { version }

// 默认导出
export default {
  version,
  install(app: App) {
    // 注册所有组件
    Object.entries(components).forEach(([name, component]) => {
      app.component(name, component)
    })
    
    return app
  }
}
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// // 在开发环境中使用源码
// import XComponents from '../../packages/index'
// // 导入样式
// import '../../packages/them-chalk/src/index.scss'

// 或者使用构建产物（取消注释以下代码）
import XComponents from '../../dist/es/index.js'
import '../../dist/them-chalk/index.css'

const app = createApp(App)

// 使用整个组件库
app.use(XComponents)

app.mount('#app')

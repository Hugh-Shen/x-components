import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import Icon from '@xc/components/icon'
import '@xc/them-chalk/src/index.scss'

const app = createApp(App)

const plugins = [Icon]

plugins.forEach(plugin => app.use(plugin))


app.mount('#app')

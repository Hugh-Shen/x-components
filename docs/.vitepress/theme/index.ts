import defaultTheme from 'vitepress/theme'

import Icon from '@xc/components/icon'
import '@xc/them-chalk/src/icon.scss'

export default {
  ...defaultTheme,
  enhanceApp({ app }) {
    app.use(Icon)
  }
}
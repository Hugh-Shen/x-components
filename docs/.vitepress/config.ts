import { defineConfig } from 'vitepress'
import DefineOptions from 'unplugin-vue-define-options/vite'


export default defineConfig({
  title: 'xc-ui',
  description: 'this is a framework for vue3, hope you like it',
  srcDir: 'src',
  vite: {
    plugins: [
      DefineOptions()
    ]
  },
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/xc-ui/xc-ui' }
    ],
    sidebar: [
      {
        text: '指南',
        items: [
          { text: '快速开始', link: '/' }
        ]
      },
      {
        text: '基础组件',
        items: [
          { text: 'icon', link: '/components/icon' }
        ]
      }
    ]
  }
})

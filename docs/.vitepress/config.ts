import { defineConfig } from 'vitepress'


export default defineConfig({
  title: 'xc-ui',
  description: 'this is a framework for vue3, hope you like it',
  srcDir: 'src',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'GitHub', link: 'https://github.com/xc-ui/xc-ui' }
    ],
    sidebar: [
      {
        text: 'guide',
        items: [
          { text: 'use', link: '/' }
        ]
      }
    ]
  }
})

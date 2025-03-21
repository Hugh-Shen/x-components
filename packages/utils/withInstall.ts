import type { App, Plugin } from 'vue'

// 为组件添加 install 方法
export const withInstall = <T, E extends Record<string, any>>(main: T, extra?: E) => {
  (main as any).install = (app: App): void => {
    for (const comp of [main, ...Object.values(extra || {})]) {
      app.component(comp.name, comp)
    }
  }

  if (extra) {
    for (const [key, comp] of Object.entries(extra)) {
      ;(main as any)[key] = comp
    }
  }

  return main as T & Plugin & E
}
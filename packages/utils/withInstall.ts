import type { Plugin, App } from 'vue'

type SFCwithInstall<T> = T & Plugin

export const withInstall = <T>(component: T) => {
  (component as SFCwithInstall<T>).install = (app: any) => {
    const { name } = component as { name: string }
    app.component(name, component)
  }
  return component as SFCwithInstall<T>
}
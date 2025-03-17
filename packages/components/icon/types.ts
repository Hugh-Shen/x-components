import XIcon from './src/icon.vue'

declare module 'vue' {
  export interface GlobalComponents {
    XIcon: typeof XIcon
  }
}
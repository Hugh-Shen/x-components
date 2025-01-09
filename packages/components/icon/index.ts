import Icon from './src/icon.vue'
import { withInstall } from '@xc/utils/withInstall'


export default withInstall(Icon)

export * from './src/icon'

declare module 'vue' {
  export interface GlobalComponents {
    xIcon: typeof Icon
  }
}
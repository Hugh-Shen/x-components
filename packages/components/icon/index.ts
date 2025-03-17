import XIcon from './src/icon.vue'
import { withInstall } from '@xc/utils/withInstall'

// 导入类型定义
import './types'

// 导入样式
import '../../them-chalk/src/icon.scss'

export { XIcon }

export default withInstall(XIcon)

export * from './src/icon'
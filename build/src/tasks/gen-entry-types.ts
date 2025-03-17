import path from 'path'
import fs from 'fs/promises'
import { buildOutput, pkgRoot } from '../utils/paths'

// 生成入口类型定义文件
export const generateDts = async () => {
  const entryTypes = `
import { App } from 'vue'

declare const XComponents: {
  install: (app: App) => void
}

export default XComponents

// 导出所有组件
export * from './components'
`

  await fs.writeFile(path.resolve(buildOutput, 'index.d.ts'), entryTypes)
  
  // 确保 ES 模块也有类型声明
  await fs.copyFile(
    path.resolve(buildOutput, 'index.d.ts'),
    path.resolve(buildOutput, 'es/index.d.ts')
  )
  
  // 确保 CJS 模块也有类型声明
  await fs.copyFile(
    path.resolve(buildOutput, 'index.d.ts'),
    path.resolve(buildOutput, 'lib/index.d.ts')
  )
}
import fs from 'fs'
import path from 'path'
import { compRoot } from './paths'

/**
 * 获取所有组件名称
 * @returns 组件名称数组
 */
export const getComponents = async () => {
  // 读取 components 目录下的所有文件夹
  const dirs = fs.readdirSync(compRoot, { withFileTypes: true })
    .filter(dir => dir.isDirectory())
    .map(dir => dir.name)
  
  // 过滤掉不是组件的目录（例如 utils, hooks 等）
  const components = dirs.filter(dir => {
    // 检查目录中是否有 index.ts 文件
    const indexPath = path.resolve(compRoot, dir, 'index.ts')
    return fs.existsSync(indexPath)
  })
  
  return components
}
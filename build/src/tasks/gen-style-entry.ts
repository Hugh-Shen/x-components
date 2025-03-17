import path from 'path'
import fs from 'fs/promises'
import { buildOutput, esOutput, libOutput, compRoot } from '../utils/paths'
import { getComponents } from '../utils/components'

// 生成样式入口文件
export const generateStyleEntry = async () => {
  try {
    // 获取所有组件
    const components = await getComponents()
    
    // 创建样式映射文件，用于按需导入
    const styleMapping = `
// 样式映射，用于按需导入
const styleMapping = {
  ${components.map(comp => `'${comp}': '../them-chalk/${comp}.css'`).join(',\n  ')}
}

export const loadComponentStyle = (componentName) => {
  const stylePath = styleMapping[componentName]
  if (stylePath) {
    // 动态导入样式的辅助函数
    return stylePath
  }
  return null
}

// 默认导出全量样式路径
export default '../them-chalk/index.css'
`

    // 写入样式映射文件 - 修改为 esm 目录
    await fs.writeFile(
      path.resolve(esOutput, 'style-entry.js'),
      styleMapping
    )
    
    await fs.writeFile(
      path.resolve(libOutput, 'style-entry.js'),
      styleMapping.replace(/export default/g, 'module.exports =')
    )
    
    console.log('样式入口文件生成成功')
  } catch (error) {
    console.error('生成样式入口文件失败:', error)
  }
}
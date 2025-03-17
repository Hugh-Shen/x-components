import path from 'path'
import { series, parallel } from 'gulp'
import { run } from './utils/process'
import { withTaskName, pathRewriter } from './utils/gulp'
import { buildOutput, xComponentsRoot } from './utils/paths'
import { buildConfig } from './build-info'
import type { TaskFunction } from 'gulp'
import type { Module } from './build-info'

// 清理构建目录
export const cleanTask = withTaskName('clean', async () => {
  const { rimraf } = await import('rimraf')
  // 完全清空构建目录，然后重新创建
  await rimraf(buildOutput)
  // 确保目录存在
  fs.mkdirSync(buildOutput, { recursive: true })
})

// 构建样式
export const buildStyle = withTaskName('buildStyle', async () => {
  // 使用现有的 theme-chalk 目录
  const { compileThemeChalk, copyThemeChalkSource, copyThemeChalkFont } = require('./tasks/build-styles')
  await compileThemeChalk() // 编译 SCSS 文件为 CSS
  await copyThemeChalkSource() // 复制源 SCSS 文件以支持主题定制
  await copyThemeChalkFont() // 复制字体文件
})

// 构建每个组件
const buildEachComponent = async (module: Module) => {
  const { buildFullComponent, buildComponent } = require('./tasks/build-components')
  await buildFullComponent(buildConfig, module)
  await buildComponent(buildConfig, module)
}

// 构建所有组件
export const buildComponents = withTaskName('buildComponents', async () => {
  await buildEachComponent('esm')
  await buildEachComponent('cjs')
})

// 生成类型定义
export const genTypes = withTaskName('genTypes', async () => {
  try {
    // 确保输出目录存在
    fs.mkdirSync(path.resolve(buildOutput, 'types'), { recursive: true })
    
    // 使用 vue-tsc 生成类型声明文件
    await run('vue-tsc', [
      '--skipLibCheck',
      '--declaration',
      '--emitDeclarationOnly',
      '--outDir', path.resolve(buildOutput, 'types'),  // 明确指定输出目录为 dist/types
      '--project',
      path.resolve(xComponentsRoot, 'tsconfig.json')
    ])
    
    // 检查类型是否生成成功
    const typesDir = path.resolve(buildOutput, 'types')
    if (!fs.existsSync(typesDir)) {
      console.warn(`警告: 类型生成可能失败，目录不存在: ${typesDir}`)
    } else {
      console.log(`类型定义文件成功生成到: ${typesDir}`)
    }
  } catch (error) {
    console.warn('类型生成出错，但构建将继续进行:', error)
  }
})

// 复制类型定义文件
export const copyTypes = withTaskName('copyTypes', async () => {
  try {
    const src = path.resolve(buildOutput, 'types')
    const copy = async (module: Module) => {
      const output = path.resolve(buildOutput, module)
      // 检查源目录是否存在
      if (fs.existsSync(src)) {
        // 使用我们自定义的 run 函数，它会在 Windows 上正确处理 cp 命令
        await run('cp', ['-r', src, output])
      } else {
        console.warn(`警告: 类型定义目录不存在: ${src}`)
        console.error(`错误: 无法找到类型定义文件，请确保 vue-tsc 命令成功执行`)
      }
    }
    
    await Promise.all([copy('esm'), copy('cjs')])
  } catch (error) {
    console.warn('复制类型定义文件出错，但构建将继续进行:', error)
  }
})

// 复制全局类型定义
export const copyGlobalTypes = withTaskName('copyGlobalTypes', async () => {
  try {
    const src = path.resolve(xComponentsRoot, 'typings', 'global.d.ts')
    // 检查文件是否存在
    if (fs.existsSync(src)) {
      await run('cp', [src, path.resolve(buildOutput, 'global.d.ts')])
    } else {
      console.warn(`警告: 全局类型定义文件不存在: ${src}`)
      // 创建一个空的全局类型定义文件
      fs.mkdirSync(path.dirname(path.resolve(buildOutput, 'global.d.ts')), { recursive: true })
      fs.writeFileSync(path.resolve(buildOutput, 'global.d.ts'), '// 全局类型定义\n')
    }
  } catch (error) {
    console.warn('复制全局类型定义文件出错，但构建将继续进行:', error)
    // 不抛出错误，允许构建继续
  }
})

// 生成入口文件
export const genEntryTypes = withTaskName('genEntryTypes', async () => {
  const { generateDts } = require('./tasks/gen-entry-types')
  await generateDts()
})

// 构建入口文件
export const buildEntry = withTaskName('buildEntry', async () => {
  const { buildFullEntry } = require('./tasks/build-entry')
  await buildFullEntry(buildConfig)
})

// 构建类型定义
export const buildTypes: TaskFunction = series(
  genTypes,
  copyTypes,
  genEntryTypes,
  copyGlobalTypes
)

// 生成样式入口
export const genStyleEntry = withTaskName('genStyleEntry', async () => {
  const { generateStyleEntry } = require('./tasks/gen-style-entry')
  await generateStyleEntry()
})

// 生成 package.json
export const genPackageJson = withTaskName('genPackageJson', async () => {
  const { generatePackageJson } = require('./tasks/gen-package') // 修改为正确的文件名
  await generatePackageJson()
})

// 清理多余的文件和目录
export const cleanExtraFiles = withTaskName('cleanExtraFiles', async () => {
  const { rimraf } = await import('rimraf')
  // 删除不需要的目录，但保留类型定义
  await rimraf(path.resolve(buildOutput, 'packages'))
  await rimraf(path.resolve(buildOutput, 'play'))
  // 不要删除 types 目录，直到确认类型已经被复制到正确位置
  // await rimraf(path.resolve(buildOutput, 'types'))
  await rimraf(path.resolve(buildOutput, 'build'))
  
  // 不使用通配符，只删除主要目录中的临时文件
  try {
    // 使用 glob 模块查找文件
    const glob = require('fast-glob')
    const mapFiles = await glob('**/*.map', { cwd: buildOutput })
    const logFiles = await glob('**/*.log', { cwd: buildOutput })
    
    // 删除找到的文件
    for (const file of [...mapFiles, ...logFiles]) {
      await rimraf(path.join(buildOutput, file))
    }
  } catch (error) {
    console.warn('清理临时文件出错，但构建将继续进行:', error)
  }
})

// 复制工具函数
export const copyUtilsTask = withTaskName('copyUtils', async () => {
  const { copyUtils } = require('./tasks/copy-utils')
  await copyUtils()
})

// 主构建任务
export default series(
  cleanTask,
  parallel(
    buildComponents,
    buildStyle,
    buildEntry,
    buildTypes,
    copyUtilsTask // 添加复制工具函数的任务
  ),
  genStyleEntry,
  genPackageJson,
  cleanExtraFiles
)

// 需要导入 fs 模块
import fs from 'fs'
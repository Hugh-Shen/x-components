import { resolve } from 'path'

// 项目根目录
export const projRoot = resolve(__dirname, '..', '..', '..')
// 组件库根目录
export const xComponentsRoot = projRoot
// 包目录
export const pkgRoot = resolve(projRoot, 'packages')
// 组件目录
export const compRoot = resolve(pkgRoot, 'components')
// 主题样式目录
export const themeRoot = resolve(pkgRoot, 'them-chalk') // 修改为 them-chalk 而不是 theme-chalk
// 输出目录
export const buildOutput = resolve(projRoot, 'dist')
// ES模块输出目录
export const esOutput = resolve(buildOutput, 'es')
// CommonJS输出目录
export const libOutput = resolve(buildOutput, 'lib')
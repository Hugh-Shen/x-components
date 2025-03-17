import path from 'path'
import { src, dest } from 'gulp'
import { pkgRoot, esOutput, libOutput } from '../utils/paths'

// 复制工具函数到构建目录
export const copyUtils = () => {
  return new Promise((resolve) => {
    src(path.resolve(pkgRoot, 'utils/**/*.ts'))
      // 使用 esOutput 变量确保一致性
      .pipe(dest(path.resolve(esOutput, 'utils')))
      .pipe(dest(path.resolve(libOutput, 'utils')))
      .on('end', resolve)
  })
}
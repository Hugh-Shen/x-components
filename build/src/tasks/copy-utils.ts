import path from 'path'
import fs from 'fs/promises'
import { src, dest } from 'gulp'
import { buildOutput, pkgRoot } from '../utils/paths'

// 复制工具函数到构建目录
export const copyUtils = () => {
  return new Promise((resolve) => {
    src(path.resolve(pkgRoot, 'utils/**/*.ts'))
      .pipe(dest(path.resolve(buildOutput, 'es/utils')))
      .pipe(dest(path.resolve(buildOutput, 'lib/utils')))
      .on('end', resolve)
  })
}
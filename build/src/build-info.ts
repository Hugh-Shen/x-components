import path from 'path'
import { pkgRoot, buildOutput } from './utils/paths'

export type Module = 'esm' | 'cjs'

export interface BuildInfo {
  module: 'ESNext' | 'CommonJS'
  format: 'esm' | 'cjs'
  output: {
    name: string
    path: string
  }
  bundle: {
    path: string
  }
}

export const modules: Module[] = ['esm', 'cjs']

// 修改构建配置
export const buildConfig: Record<Module, BuildInfo> = {
  esm: {
    format: 'esm',
    output: {
      path: path.resolve(buildOutput, 'esm'),
      name: 'esm',
    },
    bundle: {
      path: 'esm',
    },
    module: 'ESNext'
  },
  cjs: {
    format: 'cjs',
    output: {
      path: path.resolve(buildOutput, 'lib'),
      name: 'lib',
    },
    bundle: {
      path: 'lib',
    },
    module: 'CommonJS' // 修正为 CommonJS
  },
}

// 扩展排除文件列表
export const excludeFiles = [
  'node_modules', 
  'dist', 
  'build',  // 确保 build 目录被排除
  'play', 
  'docs', 
  '.vitepress', 
  'typings'
]
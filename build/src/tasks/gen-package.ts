import path from 'path'
import fs from 'fs/promises'
import { buildOutput, pkgRoot } from '../utils/paths'

// 生成用于发布的 package.json
export const generatePackageJson = async () => {
  try {
    // 读取原始 package.json
    const pkgPath = path.resolve(pkgRoot, 'package.json')
    let pkg = {}
    
    try {
      const pkgContent = await fs.readFile(pkgPath, 'utf-8')
      pkg = JSON.parse(pkgContent)
    } catch (err) {
      console.warn('无法读取原始 package.json，将使用默认值')
    }

    // 创建用于发布的 package.json
    const distPkg = {
      name: 'x-components',
      version: (pkg as { version?: string })?.version || '1.0.0',
      description: 'A Vue 3 UI Component Library',
      main: 'lib/index.js',
      module: 'es/index.js',
      types: 'index.d.ts',
      style: 'them-chalk/index.css',
      exports: {
        '.': {
          types: './index.d.ts',
          import: './es/index.js',
          require: './lib/index.js'
        },
        './es': './es/index.js',
        './lib': './lib/index.js',
        './es/*': './es/*',
        './lib/*': './lib/*',
        './them-chalk': './them-chalk/index.css',
        './them-chalk/*': './them-chalk/*',
        './package.json': './package.json'
      },
      files: [
        'es',
        'lib',
        'them-chalk',
        'index.d.ts',
        'global.d.ts'
      ],
      keywords: [
        'vue',
        'vue3',
        'components',
        'ui'
      ],
      peerDependencies: {
        'vue': '^3.0.0'
      },
      sideEffects: [
        'them-chalk/**/*.css',
        'es/**/style/*',
        'lib/**/style/*'
      ]
    }

    // 写入 package.json
    await fs.writeFile(
      path.resolve(buildOutput, 'package.json'),
      JSON.stringify(distPkg, null, 2)
    )
    
    console.log('成功生成 package.json')
  } catch (error) {
    console.error('生成 package.json 失败:', error)
  }
}
import path from 'path'
import { rollup } from 'rollup'
import vue from '@vitejs/plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import esbuild from 'rollup-plugin-esbuild'
import glob from 'fast-glob'
import { compRoot, buildOutput, pkgRoot } from '../utils/paths'
import { excludeFiles } from '../build-info'
import type { OutputOptions } from 'rollup'
import type { Module, BuildInfo } from '../build-info'

// 获取组件列表
const getComponents = async () => {
  const components = await glob('*', {
    cwd: compRoot,
    onlyDirectories: true,
    ignore: excludeFiles,
  })
  return components
}

// 构建单个组件
export const buildComponent = async (buildConfig: Record<Module, BuildInfo>, module: Module) => {
  const config = buildConfig[module]
  const components = await getComponents()

  for (const component of components) {
    const input = path.resolve(compRoot, component, 'index.ts')
    const bundle = await rollup({
      input,
      plugins: [
        vue(),
        // 修改样式处理插件
        {
          name: 'style-handler',
          transform(code, id) {
            // 处理所有 .scss 和 .css 文件
            if (id.endsWith('.scss') || id.endsWith('.css')) {
              return {
                code: 'export default ""',
                map: null
              }
            }
            return null
          },
          resolveId(source) {
            // 处理样式文件的导入
            if (source.includes(':\\') && (source.endsWith('.scss') || source.endsWith('.css'))) {
              // 对于按需导入，使用组件对应的 CSS 文件
              const componentName = source.split('\\').pop()?.replace('.scss', '') || '';
              return { id: `../../them-chalk/${componentName}.css`, external: true };
            }
            
            // 处理其他样式文件的导入
            if (source.endsWith('.scss') || source.endsWith('.css')) {
              return { id: source, external: true }
            }
            return null
          }
        },
        nodeResolve({
          extensions: ['.mjs', '.js', '.json', '.ts'],
        }),
        commonjs(),
        esbuild({
          sourceMap: false,
          target: 'es2018',
          loaders: {
            '.vue': 'ts',
          },
        }),
      ],
      external: (id) => /^vue/.test(id) || /^@xc/.test(id) || /\.scss$/.test(id) || /\.css$/.test(id),
      treeshake: false,
    })

    const options: OutputOptions = {
      format: config.format,
      // 直接输出到 es/components 或 lib/components 目录
      dir: path.resolve(config.output.path, 'components', component),
      exports: module === 'cjs' ? 'named' : undefined,
      preserveModules: true,
      preserveModulesRoot: path.resolve(compRoot, component),
      sourcemap: false,
      entryFileNames: `[name].${config.format === 'esm' ? 'mjs' : 'js'}`,
    }

    await bundle.write(options)
  }
}

// 构建完整组件
export const buildFullComponent = async (buildConfig: Record<Module, BuildInfo>, module: Module) => {
  const config = buildConfig[module]
  const input = path.resolve(pkgRoot, 'components', 'index.ts')

  const bundle = await rollup({
    input,
    plugins: [
      vue(),
      // 添加样式处理插件
      {
        name: 'style-handler',
        transform(code, id) {
          // 处理所有 .scss 和 .css 文件
          if (id.endsWith('.scss') || id.endsWith('.css')) {
            return {
              code: 'export default ""',
              map: null
            }
          }
          return null
        },
        resolveId(source) {
          // 处理所有样式文件的导入
          if (source.endsWith('.scss') || source.endsWith('.css')) {
            return { id: source, external: true }
          }
          // 修复样式文件路径问题
          if (source.includes(':\\') && (source.endsWith('.scss') || source.endsWith('.css'))) {
            // 将绝对路径转换为相对路径
            const themChalkPath = '../../packages/them-chalk/src/';
            const fileName = source.split('\\').pop();
            return { id: `${themChalkPath}${fileName}`, external: true };
          }
          return null
        }
      },
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: false,
        target: 'es2018',
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: (id) => /^vue/.test(id) || /^@xc/.test(id) || /\.scss$/.test(id) || /\.css$/.test(id),
    treeshake: false,
  })

  await bundle.write({
    format: config.format,
    // 直接输出到 es 或 lib 目录
    file: path.resolve(config.output.path, 'index.js'),
    exports: module === 'cjs' ? 'named' : undefined,
    sourcemap: false,
  })
}
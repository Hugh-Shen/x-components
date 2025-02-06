import path from 'path'
import { outDir } from './paths'

export const buildConfig = {
  esm: {
    module: 'esnext',
    format: 'esm',
    output: {
      name: 'es',
      path: path.resolve(outDir, 'es')
    },
    bundle: {
      path: 'x-plus/es'
    }
  },
  cjs: {
    module: 'commonjs',
    format: 'cjs',
    output: {
      name: 'lib',
      path: path.resolve(outDir, 'lib')
    },
    bundle: {
      path: 'x-plus/lib'
    }
  }
}
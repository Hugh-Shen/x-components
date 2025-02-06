import { series, parallel, src, dest } from 'gulp'
import path from 'path'
import ts from 'gulp-typescript'
import { rootPath } from './utils/paths'
import { buildConfig } from './utils/config'
import { withTashName } from './index'


const gereratePackage = (dirname: string, config: any) => {
  const tsConfig = path.resolve(rootPath, 'tsconfig.json')
  const inputs = ['**/*.ts', '!gulpfile.ts', '!node_modules']
  const output = path.resolve(dirname, config.output.name)

  return src(inputs).pipe(ts.createProject(
    tsConfig,
    {
      declaration: true,
      strict: true,
      module: config.module,
    }
  )()).pipe(dest(output))
}
const copyPackages = (dirname: string, config: any, name: string) => {
  const output = path.resolve(dirname, config.output.name)

  return src(`${output}/**`).pipe(dest(`${config.output.path}/${name}`))
}

export const buildPackages = (dirname: string, name: string) => {
  const task = Object.entries(buildConfig).map(([module, config]) => {
    return series(
      withTashName(`build: ${name}`, () => gereratePackage(dirname, config)),
      withTashName(`copy: ${name}`, () => copyPackages(dirname, config, name))
    )
  })

  return parallel(...task)
}
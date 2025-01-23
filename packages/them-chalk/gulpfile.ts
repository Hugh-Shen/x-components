import { series, src, dest } from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpCleanCss from 'gulp-clean-css'
import { existsSync, mkdirSync, promises } from 'fs'
import { rootPath, rootResolvePath } from '@xc/utils/paths'
import path from 'path'

const resolvePath = (dir: string) => path.resolve(__dirname, dir)


const compile = () => {
  const sass = gulpSass(dartSass)

  return src(resolvePath('./src/*.scss'))
  .pipe(sass.sync())
  .pipe(gulpAutoprefixer())
  .pipe(gulpCleanCss())
  .pipe(dest('./dist/css'))
}

const copyFiles = () => {
  return src(resolvePath('./dist/**'))
  .pipe(dest(rootResolvePath('./dist/them-chalk')))
}

export default series(
  compile,
  copyFiles
)
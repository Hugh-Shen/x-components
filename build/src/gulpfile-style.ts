import path from 'path'
import { series, src, dest } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import { themeRoot, buildOutput } from './utils/paths'

const sass = gulpSass(dartSass)

// 编译样式
function compile() {
  return src(path.resolve(themeRoot, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(dest(path.resolve(buildOutput, 'them-chalk'))) // 修改为 them-chalk
}

// 复制字体文件
function copyFont() {
  return src(path.resolve(themeRoot, 'src/fonts/**'))
    .pipe(dest(path.resolve(buildOutput, 'them-chalk/fonts'))) // 修改为 them-chalk
}

// 复制样式源文件
function copyScss() {
  return src(path.resolve(themeRoot, 'src/**/*.scss'))
    .pipe(dest(path.resolve(buildOutput, 'them-chalk/src'))) // 修改为 them-chalk
}

// 构建主题样式
export const buildThemeChalk = series(compile, copyFont, copyScss)

export default buildThemeChalk
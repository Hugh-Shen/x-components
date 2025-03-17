import path from 'path'
import { src, dest } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'

// 本地路径解析函数
const resolvePath = (p: string) => path.resolve(__dirname, p)

// 初始化 sass
const sass = gulpSass(dartSass)

// 编译样式
function compile() {
  return src(path.resolve(__dirname, 'src/*.scss'))
    .pipe(sass.sync())
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(dest(resolvePath('./dist/them-chalk')))
}

// 复制字体文件
function copyFont() {
  return src(path.resolve(__dirname, 'src/fonts/**'))
    .pipe(dest(resolvePath('./dist/them-chalk/fonts')))
}

// 复制样式源文件
function copyScss() {
  return src(path.resolve(__dirname, 'src/**/*.scss'))
    .pipe(dest(resolvePath('./dist/them-chalk/src')))
}

// 导出任务
export const buildThemeChalk = series(compile, copyFont, copyScss)
export default buildThemeChalk

// 需要导入 series 函数
import { series } from 'gulp'
import path from 'path'
import { src, dest } from 'gulp'
import gulpSass from 'gulp-sass'
import dartSass from 'sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import { themeRoot, buildOutput } from '../utils/paths'
import rename from 'gulp-rename'; // 确保已导入重命名插件

const sass = gulpSass(dartSass)

// 编译 them-chalk 中的 SCSS 文件为 CSS
export const compileThemeChalk = () => {
  return new Promise((resolve) => {
    // 编译所有 SCSS 文件，包括单个组件样式和全量样式
    src(path.resolve(themeRoot, 'src/**/*.scss'))
      .pipe(sass.sync())
      .pipe(autoprefixer({ cascade: false }))
      .pipe(cleanCSS())
      .pipe(rename({ extname: '.css' })) // 正确使用重命名插件
      .pipe(dest(path.resolve(buildOutput, 'them-chalk')))
      .on('end', resolve);
  });
};

// 复制 them-chalk 源文件，以支持用户自定义主题
export const copyThemeChalkSource = () => {
  return new Promise((resolve) => {
    src(path.resolve(themeRoot, 'src/**'))
      // 输出到 them-chalk/src 目录
      .pipe(dest(path.resolve(buildOutput, 'them-chalk/src')))
      .on('end', resolve)
  })
}

// 复制字体文件
export const copyThemeChalkFont = () => {
  return new Promise((resolve) => {
    src(path.resolve(themeRoot, 'src/fonts/**'))
      // 输出到 them-chalk/fonts 目录
      .pipe(dest(path.resolve(buildOutput, 'them-chalk/fonts')))
      .on('end', resolve)
  })
}
import { series, src, dest } from 'gulp'
import dartSass from 'sass'
import gulpSass from 'gulp-sass'
import gulpAutoprefixer from 'gulp-autoprefixer'
import gulpCleanCss from 'gulp-clean-css'
import path from 'path'


const compile = () => {
  const sass = gulpSass(dartSass)

  src(path.resolve(__dirname, './src/*.scss'))
  .pipe(sass.sync())
  .pipe(gulpAutoprefixer())
  .pipe(gulpCleanCss())
  .pipe(dest('./dist/css'))
}

export default series(
  compile
)
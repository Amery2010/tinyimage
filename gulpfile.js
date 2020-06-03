const gulp = require('gulp')
const rollup = require('rollup')
const sass = require('gulp-sass')

gulp.task('script', () => {
  return rollup.rollup({
    input: './build/renderer.js',
  }).then(bundle => {
    return bundle.write({
      file: './build/bundle.js',
      format: 'umd',
      sourcemap: true,
    })
  })
})

gulp.task('style', () => {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/styles'))
})

gulp.task('static', () => {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./build'))
})

gulp.task('build', gulp.series(gulp.parallel('script', 'style'), 'static'))

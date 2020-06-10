const gulp = require('gulp')
const rollup = require('rollup')
const rollupTypescript = require('@rollup/plugin-typescript')
const rollupCommonjs = require('@rollup/plugin-commonjs')
const sass = require('gulp-sass')

gulp.task('script', () => {
  return rollup.rollup({
    input: './src/renderer.ts',
    plugins: [
      rollupTypescript(),
      rollupCommonjs({ extensions: ['.js', '.ts'] }),
    ]
  }).then(bundle => {
    return bundle.write({
      dir: 'build',
      format: 'umd',
      name: 'bundle',
      sourcemap: true,
    })
  })
})

gulp.task('style', () => {
  return gulp.src('./src/ui/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/styles'))
})

gulp.task('static', () => {
  return gulp.src('./static/**/*')
    .pipe(gulp.dest('./build'))
})

gulp.task('build', gulp.series(gulp.parallel('script', 'style'), 'static'))

const path = require('path');
const gulp = require('gulp');
const sass = require('gulp-sass');

const cssPath = path.resolve(__dirname, 'src/assets/css');
const scssPath = path.resolve(__dirname, 'scss');

gulp.task('sass', function () {
  gulp.src(scssPath + '/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssPath));
});

gulp.task('sass:watch', function () {
  gulp.start('sass');
  gulp.watch(scssPath + '/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);
gulp.task('watch', ['sass:watch']);
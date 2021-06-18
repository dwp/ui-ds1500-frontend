const gulp = require('gulp');
const { watch } = gulp
const rename = require('gulp-rename');
const jsonmin = require('gulp-jsonmin');
const npath = require('path');
const runSequence = require('run-sequence');
const sass = require('gulp-dart-sass');
const uglify = require('gulp-uglify');
const pump = require('pump');
const srcdir = './src/';
const dstdir = './static/';

/* ---------------------------------------------------------------------- CSS */

// Build application.css
gulp.task('sass', function () {
  return gulp
    .src(npath.resolve(srcdir, 'css/application.scss'))
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed',
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
        'node_modules/govuk-elements-sass/public/sass'
      ]
    }).on('error', sass.logError))
    .pipe(gulp.dest(npath.resolve(dstdir, 'css/')));
});

/* ----------------------------------------------------------------------- JS */

gulp.task('js', function (callback) {
  pump([
    gulp.src(npath.resolve(srcdir, 'js/**/*.js')),
    uglify(),
    gulp.dest(npath.resolve(dstdir, 'js'))
  ], callback);
});

/* ----------------------------------------------------------------------- COPY */

gulp.task('copy', function (callback) {
  pump([
    gulp.src('node_modules/jquery/dist/jquery.min.js'),
    gulp.src('node_modules/parsleyjs/dist/*'),
    gulp.dest(npath.resolve(dstdir, 'js'))
  ], callback);
});

/* -------------------------------------------------------------------- Watch */

gulp.task('watch', function () {
  watch(srcdir + '**/*.js', function () {
    runSequence('js');
  });
  watch(srcdir + '**/*.scss', function () {
    runSequence('sass');
  });
});

/* ----------------------------------------------------------------------- Img */

gulp.task('img', function (callback) {
  pump([
    gulp.src(npath.resolve(srcdir, 'img/**/*')),
    gulp.dest(npath.resolve(dstdir, 'img'))
  ], callback);
});

gulp.task('public', function (callback) {
  pump([
    gulp.src(npath.resolve(srcdir, 'errorPages/**/*')),
    gulp.dest(npath.resolve(dstdir, 'public'))
  ], callback);
});

/* ----------------------------------------------------------------------- data */

gulp.task('data', function (callback) {
  pump([
    gulp.src(npath.resolve(srcdir, 'data/trust-data.json')),
    jsonmin(),
    rename('trust-data.min.json'),
    gulp.dest(npath.resolve(dstdir, 'data'))
  ], callback);
});

/* -------------------------------------------------------------------- Tasks */

gulp.task('default', gulp.series('sass', 'js', 'img', 'public', 'data', 'copy'));

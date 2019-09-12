const autoprefixer = require('autoprefixer');
const browsersync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const cssnano = require('cssnano');
const del = require('del');
const gulp = require('gulp');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const paths = {
  dist: 'dist',
  css: 'src/css',
  js: 'src/js'
};

const browserSync = done => {
  browsersync.init({
    server: {
      baseDir: './'
    },
    port: 3000
  });
  done();
};

const clean = () => del([paths.dist]);

const styles = () =>
  gulp
    .src(`${paths.css}/**/*.scss`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());

const scripts = () =>
  gulp
    .src(`${paths.js}/**/*.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['@babel/preset-env']
      })
    )
    .pipe(concat('carousel.js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.dist))
    .pipe(browsersync.stream());

const watchFiles = () => {
  gulp.watch(`${paths.css}/**/*.scss`, styles);
  gulp.watch(`${paths.js}/**/*.js`, scripts);
};

const build = gulp.series(clean, gulp.parallel(styles, scripts));
const watch = gulp.parallel(watchFiles, browserSync);

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.build = build;
exports.watch = watch;
exports.default = build;

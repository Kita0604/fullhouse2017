'use strict'

const path = require('path')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', '*']
})
const browserSync = require('browser-sync').create()

let locals = {}

gulp.task('setlocals', () => {
  // GitLab CIで実行したときにGitLabのネームスペースに合わせる
  if (process.env.CI_PROJECT_PATH) {
    locals.basePath = '/' + process.env.CI_PROJECT_PATH + '/'
  }
})

// yaml
gulp.task('yaml', () => {
  return gulp.src('app/src/*y{,a}ml')
  .pipe($.vinylYamlData())
  .pipe($.deepExtendStream(locals))
})

// pug
gulp.task('pug', ['yaml'], () => {
  gulp.src('app/markup/**/!(_)*.pug')
    .pipe($.plumber())
    .pipe($.pug({
      pretty: true, //リリース時は圧縮する
      locals: locals
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream())
    .pipe($.logger({ beforeEach: '[pug] wrote: ' }))
})

// scripts
// JSファイルは全てmain.jsにコンパイルされます
gulp.task('js', () => {
  gulp.src(path.join('app/scripts', '**/*.js'))
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.babel({
        presets: ['es2015']
    }))
    .pipe($.concat('main.js'))
    .pipe($.uglify({ preserveComments: 'some' }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.stream())
    .pipe($.logger({ beforeEach: '[js] wrote: ' }))
})

// JSファイルは全てmain.jsにコンパイルされます
gulp.task('js_time_schedule', () => {
  gulp.src(path.join('app/scripts_time_schedule', '**/*.js'))
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.babel({
        presets: ['es2015']
    }))
    .pipe($.concat('time_schedule.js'))
    .pipe($.uglify({ preserveComments: 'some' }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(browserSync.stream())
    .pipe($.logger({ beforeEach: '[js] wrote: ' }))
})

// assets
gulp.task('styles', () => {
  gulp.src('app/assets/styles/**/!(_)*.styl')
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.stylus({'include css': true}))
    .pipe($.autoprefixer('last 3 version', 'ie >= 9', 'Android 4.0'))
    .pipe($.cleanCss()) // CSSを圧縮(コメントアウトすれば展開される)
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dist/assets/styles'))
    .pipe(browserSync.stream())
    .pipe($.logger({ beforeEach: '[styles] wrote: ' }))
})

gulp.task('lint', () => {
  gulp.src('app/assets/styles/**/*.styl')
      .pipe($.stylint({ }))
      .pipe($.stylint.reporter())
})

gulp.task('images', () => {
  gulp.src('app/assets/images/**/*.{jpg,jpeg,png,gif,svg}')
    .pipe($.plumber())
    .pipe($.changed('dist/assets/images'))
    .pipe($.imagemin())
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browserSync.stream())
  gulp.src('app/assets/images/**/*.{ico,pdf}')
    .pipe($.plumber())
    .pipe($.changed('dist/assets/images'))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browserSync.stream())
})

gulp.task('fonts', () => {
  gulp.src('app/assets/fonts/**/*.{eot,woff,woff2,ttf,otf,svg}')
    .pipe($.plumber())
    .pipe(gulp.dest('dist/assets/fonts'))
    .pipe(browserSync.stream())
})

gulp.task('clean', () => { gulp.src('dist').pipe($.clean()) })
gulp.task('assets', ['styles', 'images', 'fonts'])
gulp.task('default', ['assets', 'js', 'pug'])
gulp.task('ci', ['setlocals', 'default'])

gulp.task('server', ['watch'], () => {
  browserSync.init({
    server: {
      baseDir: './dist',
      index: 'index.html'
    }
  })
})

gulp.task('watch', ['default'], () => {
  $.watch(['app/**/*.pug'], () => {
    gulp.start(['pug'])
  })
  $.watch(['app/assets/styles/**/*'], () => {
    gulp.start(['styles'])
  })
  $.watch(['app/assets/images/**/*'], () => {
    gulp.start(['images'])
  })
  $.watch(['app/assets/fonts/**/*'], () => {
    gulp.start(['fonts'])
  })
  $.watch(['app/scripts/**/*'], () => {
    gulp.start(['js'])
  })
  $.watch(['app/scripts_time_schedule/**/*'], () => {
    gulp.start(['js_time_schedule'])
  })
})

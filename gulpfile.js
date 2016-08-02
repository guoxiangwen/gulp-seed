const gulp = require('gulp');
const eslint = require('gulp-eslint');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const babel = require('gulp-babel');

const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create(); //auto open browser and liveload

const useref = require('gulp-useref');
const revReplace = require('gulp-rev-replace');
const rev = require('gulp-rev');///md5
const inject = require('gulp-inject');
const del = require('del');

const url = require('url');
const proxyMiddleware = require('http-proxy-middleware');

// 说明
gulp.task('help', () => {
    console.log('===========gulp build:项目发布打包==========');
    console.log('===========gulp run:项目启动===============');
    console.log('===========gulp help:gulp参数说明==========');
});
//js
gulp.task('js', () => {
    return gulp.src('src/script/*.js')
        .pipe(concat('app.bundle.js'))
        .pipe(babel({ presets: ['es2015'] }))
        .pipe(rev())
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .pipe(gulp.dest('build'))

})
//css
gulp.task('css', () => {
    return gulp.src(["!src/sass/reset.scss", "src/sass/*.scss"])
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(concat('app.bundle.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(rev())
        .pipe(gulp.dest("build"))
        .pipe(browserSync.stream())
})
//build
gulp.task('build', ['clear', 'html', 'js', 'css'], () => {
    let target = gulp.src('./build/index.html');
    let sources = gulp.src(['./build/*.js', './build/*.css'], { read: false }, { relative: false });

    target.pipe(inject(sources))
        .pipe(gulp.dest('./build'));
})
//html

gulp.task('html', () => {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('build'))
})
//del
gulp.task('clear', () => {
    del([
        'build/*.*'
    ])
})



/* 默认 */

gulp.task('start', ['build'], () => {
    //反向代理
    var proxy = proxyMiddleware('/openrest', { target: 'http://10.3.30.182:8999' });
    browserSync.init({
        // notify: false,//关闭页面通知
        server: {
            baseDir: ["./build", "./"],
            port: 3000,
            middleware: [proxy]
        }
    });
    gulp.watch('src/index.html', ['build']).on("change", browserSync.reload);
    gulp.watch('src/sass/*.scss', ['build']).on("change", browserSync.reload);
    gulp.watch('src/script/*.js', ['build']).on("change", browserSync.reload);
});

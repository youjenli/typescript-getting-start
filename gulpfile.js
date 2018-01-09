const gulp = require('gulp');
const del = require('del');
const ts  = require('gulp-typescript');
const inject = require('gulp-inject');
const tsConfig = require('./tsconfig.json');

const distPath = './dist';

//清空輸出打包成品的資料夾
const clean = 'clean';
gulp.task(clean, function(){
    return del([distPath]);
});

//轉譯並合併 typescript 指令稿
const bundleJSTask = 'bundleJS';
const bundleFileOutputPath = distPath + '/js';
gulp.task(bundleJSTask,[clean],  function(){
    return gulp.src('./src/ts/greeter.ts')
            .pipe(ts(tsConfig))
            .pipe(gulp.dest(bundleFileOutputPath));
});

//把轉譯好的內容連結注入到網頁中
const injectJSLinkToHtml = 'injectJSLinkToHtml';
gulp.task(injectJSLinkToHtml,[bundleJSTask], function(){
    var injectSrc = gulp.src([bundleFileOutputPath + '/*.js']);
    return gulp.src('./src/html/index.html')
            .pipe(inject(injectSrc))
            .pipe(gulp.dest(distPath));
});

gulp.task('default', [clean, bundleJSTask, injectJSLinkToHtml]);
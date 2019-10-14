'use strict';


//--------> requires

const configuration = require('./configuration'),
    cssnano = require('cssnano'),
    del = require('del'),
    fancyLog = require('fancy-log'),
    gulp = require('gulp'),
    gulpBabel = require('gulp-babel'),
    gulpConcat = require('gulp-concat'),
    gulpHtmlmin = require('gulp-htmlmin'),
    gulpHtmlReplace = require('gulp-html-replace'),
    gulpImagemin = require('gulp-imagemin'),
    gulpNewer = require('gulp-newer'),
    gulpPlumber = require('gulp-plumber'),
    gulpPostcss = require('gulp-postcss'),
    gulpUglify = require('gulp-uglify');


//--------> basic recipes

const clear = () => del([`./${configuration.buildDir}/*`]);

const imagesBuild = () => gulp
    .src(`./${configuration.assetsDir}/images/**/*`)
    .pipe(gulpNewer(`./${configuration.assetsBuildDir}/images`))
    .pipe(
        gulpImagemin([
            gulpImagemin.gifsicle({ interlaced: true }),
            gulpImagemin.jpegtran({ progressive: true }),
            gulpImagemin.optipng({ optimizationLevel: 5 }),
            gulpImagemin.svgo({
                plugins: [
                    {
                        removeViewBox: false,
                        collapseGroups: true
                    }
                ]
            })
        ])
    )
    .pipe(gulp.dest(`./${configuration.assetsBuildDir}/images`));

const cssBuild = () => gulp
    .src(`./${configuration.assetsDir}/css/**/*.css`)
    .pipe(gulpConcat(configuration.cssAllFile))
    .pipe(gulpPostcss([cssnano()]))
    .pipe(gulp.dest(`./${configuration.assetsBuildDir}/css`));

const jsBuild = () => gulp
    .src(`./${configuration.assetsDir}/js/**/*.js`)
    .pipe(gulpPlumber())
    .pipe(gulpBabel({
        presets: [
            ['@babel/env', {
                modules: false
            }]
        ]
    }))
    .pipe(gulpConcat(configuration.jsAllFile))
    .pipe(gulpUglify())
    .pipe(gulp.dest(`./${configuration.assetsBuildDir}/js`));

const htmlBuild = () => gulp
    .src('*.html')
    .pipe(gulpHtmlReplace({
        js: `${configuration.assetsDir}/js/${configuration.jsAllFile}`,
        css: `${configuration.assetsDir}/css/${configuration.cssAllFile}`
    }))
    .pipe(gulpHtmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`./${configuration.buildDir}`));

const copyFileToBuildDirectory = () => {
    if (configuration.filesToCopyToBuildDirectory.length > 0) {
        fancyLog(`copyFileToBuildDirectory :: ${configuration.filesToCopyToBuildDirectory.length} file to copy`);
        return gulp
            .src(configuration.filesToCopyToBuildDirectory)
            .pipe(gulp.dest(`./${configuration.buildDir}`));
    }

    return new Promise((resolve, reject) => {
        fancyLog('copyFileToBuildDirectory :: 0 file to copy');
        resolve();
    });
};


//-------- define complex recipes

const build = gulp.series(clear, gulp.parallel(imagesBuild, cssBuild, jsBuild, htmlBuild, copyFileToBuildDirectory));


//-------- export tasks

exports.build = build;
exports.clear = clear;
exports.imagesBuild = imagesBuild;
exports.cssBuild = cssBuild;
exports.jsBuild = jsBuild;
exports.htmlBuild = htmlBuild;
exports.copyFileToBuildDirectory = copyFileToBuildDirectory;
exports.default = build;

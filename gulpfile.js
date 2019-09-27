'use strict';


//--------> plugins

const del = require('del'),
    gulp = require('gulp'),
    gulpImagemin = require('gulp-imagemin'),
    gulpNewer = require('gulp-newer'),
    gulpPlumber = require('gulp-plumber'),
    gulpUglify = require('gulp-uglify'),
    gulpBabel = require('gulp-babel'),
    gulpConcat = require('gulp-concat'),
    gulpPostcss = require('gulp-postcss'),
    cssnano = require('cssnano'),
    gulpHtmlReplace = require('gulp-html-replace'),
    gulpHtmlmin = require('gulp-htmlmin');


//--------> define vars

const assetsDir = 'assets',
    buildDir = 'build',
    assetsBuildDir = `${buildDir}/${assetsDir}`,
    jsAllFile = 'all.js',
    cssAllFile = 'all.css';


//--------> basic recipes

const clear = () => del([`./${buildDir}/*`]);

const imagesBuild = () => gulp
    .src(`./${assetsDir}/images/**/*`)
    .pipe(gulpNewer(`./${assetsBuildDir}/images`))
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
    .pipe(gulp.dest(`./${assetsBuildDir}/images`));

const cssBuild = () => gulp
    .src(`./${assetsDir}/css/**/*.css`)
    .pipe(gulpConcat(cssAllFile))
    .pipe(gulpPostcss([cssnano()]))
    .pipe(gulp.dest(`./${assetsBuildDir}/css`));

const jsBuild = () => gulp
    .src(`./${assetsDir}/js/**/*.js`)
    .pipe(gulpPlumber())
    .pipe(gulpBabel({
        presets: [
            ['@babel/env', {
                modules: false
            }]
        ]
    }))
    .pipe(gulpConcat(jsAllFile))
    .pipe(gulpUglify())
    .pipe(gulp.dest(`./${assetsBuildDir}/js`));

const htmlBuild = () => gulp
    .src('*.html')
    .pipe(gulpHtmlReplace({
        js: `${assetsDir}/js/${jsAllFile}`,
        css: `${assetsDir}/css/${cssAllFile}`
    }))
    .pipe(gulpHtmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(`./${buildDir}`));


//-------- define complex recipes

const build = gulp.series(clear, gulp.parallel(imagesBuild, cssBuild, jsBuild, htmlBuild));


//-------- export tasks

exports.build = build;
exports.clear = clear;
exports.imagesBuild = imagesBuild;
exports.cssBuild = cssBuild;
exports.jsBuild = jsBuild;
exports.htmlBuild = htmlBuild;
exports.default = build;

'use strict';


//--------> requires

const configuration = require('./configuration'),
    del = require('del'),
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

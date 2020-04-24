'use strict';


//--------> conf file

if (!process.env.SSM_CONF_FILE) {
    throw new Error('You must define the env vars SSM_CONF_FILE with the absolute path of your configuration file!');
}
const ssmConfFile = process.env.SSM_CONF_FILE;


//--------> requires

const configuration = require(ssmConfFile),
    utility = require('./utility'),
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
    gulpReplace = require('gulp-replace'),
    gulpUglify = require('gulp-uglify');

fancyLog.info(`${configuration.shellOutputPrefix} used conf file is ${ssmConfFile}`);


//--------> init const from configuration file

const imagesSrc = `${configuration.srcDirWebSite}/${configuration.srcDirImages}/${configuration.srcWildcardImages}`;
const imagesDest = `${configuration.buildDirWebSite}/${(configuration.buildDirImages) ? configuration.buildDirImages : configuration.srcDirImages}`;

const cssSrc = `${configuration.srcDirWebSite}/${configuration.srcDirCss}/${configuration.srcWildcardCss}`;
const cssDest = `${configuration.buildDirWebSite}/${(configuration.buildDirCss) ? configuration.buildDirCss : configuration.srcDirCss}`;

const jsSrc = `${configuration.srcDirWebSite}/${configuration.srcDirJs}/${configuration.srcWildcardJs}`;
const jsDest = `${configuration.buildDirWebSite}/${(configuration.buildDirJs) ? configuration.buildDirJs : configuration.srcDirJs}`;

const htmlSrc = `${configuration.srcDirWebSite}/${configuration.srcWildcardHtml}`;
const htmlDest = `${configuration.buildDirWebSite}`;

const buildFileCss = utility.getDynamicFileName(configuration.buildFileCss);
const buildFileJs = utility.getDynamicFileName(configuration.buildFileJs);


//--------> basic recipes

const clear = () => del(configuration.buildDirWebSite, {force: true});

const imagesBuild = () => {
    fancyLog.info(`${configuration.shellOutputPrefix} imagesBuild ===> FROM ${imagesSrc} TO ${imagesDest}`);
    return gulp.src(imagesSrc)
        .pipe(gulpNewer(imagesDest))
        .pipe(
            gulpImagemin([
                gulpImagemin.gifsicle({interlaced: true}),
                gulpImagemin.jpegtran({progressive: true}),
                gulpImagemin.optipng({optimizationLevel: 5}),
                gulpImagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ], {
                verbose: true
            })
        )
        .pipe(gulp.dest(imagesDest));
};

const cssBuild = () => {
    fancyLog.info(`${configuration.shellOutputPrefix} cssBuild ===> FROM ${cssSrc} TO ${cssDest}`);
    return gulp.src(cssSrc)
        .pipe(gulpConcat(buildFileCss))
        .pipe(gulpPostcss([cssnano()]))
        .pipe(gulp.dest(cssDest));
};

const jsBuild = () => {
    fancyLog.info(`${configuration.shellOutputPrefix} jsBuild ===> FROM ${jsSrc} TO ${jsDest}`);
    return gulp.src(jsSrc)
        .pipe(gulpPlumber())
        .pipe(gulpBabel({
            presets: [
                ['@babel/env', {
                    modules: false
                }]
            ]
        }))
        .pipe(gulpConcat(buildFileJs))
        .pipe(gulpUglify())
        .pipe(gulp.dest(jsDest));
};

const htmlBuild = () => {
    fancyLog.info(`${configuration.shellOutputPrefix} htmlBuild ===> FROM ${htmlSrc} TO ${htmlDest}`);
    return gulp.src(htmlSrc)
        .pipe(gulpHtmlReplace({
            css: `css/${buildFileCss}`,
            js: `js/${buildFileJs}`
        }))
        .pipe(gulpHtmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(htmlDest));
};

const copyFileToBuildDir = () => {
    if (configuration.filesToCopyToBuildDir.size > 0) {
        fancyLog.info(`${configuration.shellOutputPrefix} copyFileToBuildDir ===> ${configuration.filesToCopyToBuildDir.size} instruction(s) to copy`);
        for (let [src, dest] of configuration.filesToCopyToBuildDir) {
            dest = (!dest) ? `./${configuration.buildDirWebSite}` : `./${configuration.buildDirWebSite}/${dest}`;
            gulp.src(`./${configuration.srcDirWebSite}/${src}`)
                .pipe(gulp.dest(dest));
        }
        return new Promise((resolve, reject) => {
            fancyLog.info(`${configuration.shellOutputPrefix} copyFileToBuildDir ===> ${configuration.filesToCopyToBuildDir.size} instruction(s) copied`);
            resolve();
        });
    }

    return new Promise((resolve, reject) => {
        fancyLog.info(`${configuration.shellOutputPrefix} copyFileToBuildDir ===> 0 instruction to copy`);
        resolve();
    });
};

const stringsReplace = () => {
    if (configuration.stringsToReplace.size > 0) {
        fancyLog.info(`${configuration.shellOutputPrefix} stringsReplace ===> ${configuration.filesToCopyToBuildDir.size} replacement(s)`);
        for (let [search, replace] of configuration.stringsToReplace) {
            fancyLog.info(`${configuration.shellOutputPrefix} stringsReplace ===> replace "${search}" by "${replace}"`);
            gulp.src(`${configuration.buildDirWebSite}/**/*`)
                .pipe(gulpReplace(search, replace))
                .pipe(gulp.dest(configuration.buildDirWebSite));
        }
        return new Promise((resolve, reject) => {
            resolve();
        });
    }

    return new Promise((resolve, reject) => {
        fancyLog.info(`${configuration.shellOutputPrefix} stringsReplace ===> no replacement to execute`);
        resolve();
    });
};

//-------- define complex recipes

const build = gulp.series(clear, gulp.parallel(imagesBuild, cssBuild, jsBuild, htmlBuild), copyFileToBuildDir, stringsReplace);


//-------- export tasks

exports.build = build;
exports.clear = clear;
exports.imagesBuild = imagesBuild;
exports.cssBuild = cssBuild;
exports.jsBuild = jsBuild;
exports.htmlBuild = htmlBuild;
exports.copyFileToBuildDir = copyFileToBuildDir;
exports.default = build;

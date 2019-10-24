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


//--------> init const from configuration file

const imagesSrc = `./${configuration.srcDirWebSite}/${configuration.srcDirImages}/${configuration.srcWildcardImages}`;
const imagesDest = `./${configuration.buildDirWebSite}/${(configuration.buildDirImages) ? configuration.buildDirImages : configuration.srcDirImages}`;

const cssSrc = `./${configuration.srcDirWebSite}/${configuration.srcDirCss}/${configuration.srcWildcardCss}`;
const cssDest = `./${configuration.buildDirWebSite}/${(configuration.buildDirCss) ? configuration.buildDirCss : configuration.srcDirCss}`;

const jsSrc = `./${configuration.srcDirWebSite}/${configuration.srcDirJs}/${configuration.srcWildcardJs}`;
const jsDest = `./${configuration.buildDirWebSite}/${(configuration.buildDirJs) ? configuration.buildDirJs : configuration.srcDirJs}`;

const htmlSrc = `./${configuration.srcDirWebSite}/${configuration.srcWildcardHtml}`;
const htmlDest = `./${configuration.buildDirWebSite}`;


//--------> basic recipes

const clear = () => del([`./${configuration.buildDirWebSite}/*`]);

const imagesBuild = () => {
  fancyLog.warn(`imagesBuild ===> FROM ${imagesSrc} TO ${imagesDest}`);
  return gulp.src(imagesSrc)
    .pipe(gulpNewer(imagesDest))
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
    .pipe(gulp.dest(imagesDest));
};

const cssBuild = () => {
  fancyLog.warn(`cssBuild ===> FROM ${cssSrc} TO ${cssDest}`);
  return gulp.src(cssSrc)
    .pipe(gulpConcat(configuration.buildFileCss))
    .pipe(gulpPostcss([cssnano()]))
    .pipe(gulp.dest(cssDest));
};

const jsBuild = () => {
  fancyLog.warn(`jsBuild ===> FROM ${jsSrc} TO ${jsDest}`);
  return gulp.src(jsSrc)
    .pipe(gulpPlumber())
    .pipe(gulpBabel({
        presets: [
            ['@babel/env', {
                modules: false
            }]
        ]
    }))
    .pipe(gulpConcat(configuration.buildFileJs))
    .pipe(gulpUglify())
    .pipe(gulp.dest(jsDest));
};

const htmlBuild = () => {
  fancyLog.warn(`htmlBuild ===> FROM ${htmlSrc} TO ${htmlDest}`);
  return gulp.src(htmlSrc)
    .pipe(gulpHtmlReplace({
        css: `css/${configuration.buildFileCss}`,
        js: `js/${configuration.buildFileJs}`
    }))
    .pipe(gulpHtmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(htmlDest));
};

const copyFileToBuildDir = () => {
    if (configuration.filesToCopyToBuildDir.size > 0) {
        fancyLog.warn(`copyFileToBuildDir ===> ${configuration.filesToCopyToBuildDir.size} instruction(s) to copy`);
        for (let [src, dest] of configuration.filesToCopyToBuildDir) {
          dest = (!dest) ? `./${configuration.buildDirWebSite}` : `./${configuration.buildDirWebSite}/${dest}`;
          gulp.src(`./${configuration.srcDirWebSite}/${src}`)
              .pipe(gulp.dest(dest));
        }
        return new Promise((resolve, reject) => {
            fancyLog.warn(`copyFileToBuildDir ===> ${configuration.filesToCopyToBuildDir.size} instruction(s) copied`);
            resolve();
        });
    }

    return new Promise((resolve, reject) => {
        fancyLog.warn('copyFileToBuildDir ===> 0 instruction to copy');
        resolve();
    });
};


//-------- define complex recipes

const build = gulp.series(clear, gulp.parallel(imagesBuild, cssBuild, jsBuild, htmlBuild, copyFileToBuildDir));


//-------- export tasks

exports.build = build;
exports.clear = clear;
exports.imagesBuild = imagesBuild;
exports.cssBuild = cssBuild;
exports.jsBuild = jsBuild;
exports.htmlBuild = htmlBuild;
exports.copyFileToBuildDir = copyFileToBuildDir;
exports.default = build;

'use strict';

const dateNow = Date.now();

const filesToCopyToBuildDirMap = new Map();
filesToCopyToBuildDirMap.set('css/vendor/fontawesome-free-5.10.2-web/webfonts/*', 'css/vendor/fontawesome-free-5.10.2-web/webfonts/');
filesToCopyToBuildDirMap.set('css/vendor/fontawesome-free-5.10.2-web/css/all.min.css', 'css/vendor/fontawesome-free-5.10.2-web/css/');
filesToCopyToBuildDirMap.set('php/**/*', 'php/');
filesToCopyToBuildDirMap.set('.htaccess', null);
filesToCopyToBuildDirMap.set('browserconfig.xml', null);
filesToCopyToBuildDirMap.set('favicon.ico', null);
filesToCopyToBuildDirMap.set('humans.txt', null);
filesToCopyToBuildDirMap.set('icon.png', null);
filesToCopyToBuildDirMap.set('robots.txt', null);
filesToCopyToBuildDirMap.set('site.webmanifest', null);
filesToCopyToBuildDirMap.set('tile.png', null);
filesToCopyToBuildDirMap.set('tile-wide.png', null);

module.exports = {
  srcDirWebSite: 'source_web_site',
  buildDirWebSite: 'build',

  srcDirImages: 'media',
  srcWildcardImages: '**/*',
  buildDirImages: null,

  srcDirCss: 'css',
  srcWildcardCss: '*.css',
  buildDirCss: null,
  buildFileCss: `all.${dateNow}.min.css`,

  srcDirJs: 'js',
  srcWildcardJs: '*.js',
  buildDirJs: null,
  buildFileJs: `all.${dateNow}.min.js`,

  srcDirHtml: null,
  srcWildcardHtml: '*.html',
  buildDirHtml: null,

  filesToCopyToBuildDir: filesToCopyToBuildDirMap
};

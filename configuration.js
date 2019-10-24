'use strict';

const getDateAsString = (date = new Date(), separator = '-') => {
  let dateAsString = `${date.getFullYear()}${separator}`;
  dateAsString += `${date.getMonth() + 1}${separator}`;
  dateAsString += `${date.getDate().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getHours().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getMinutes().toString().padStart(2, '0')}${separator}`;
  dateAsString += `${date.getSeconds().toString().padStart(2, '0')}`;

  return dateAsString;
};
const dateAsString = getDateAsString();
const filesToCopyToBuildDir = [
  ['css/vendor/fontawesome-free-5.10.2-web/webfonts/*', 'css/vendor/fontawesome-free-5.10.2-web/webfonts/'],
  ['css/vendor/fontawesome-free-5.10.2-web/css/all.min.css', 'css/vendor/fontawesome-free-5.10.2-web/css/'],
  ['php/**/*', 'php/'],
  ['.htaccess', null],
  ['browserconfig.xml', null],
  ['favicon.ico', null],
  ['humans.txt', null],
  ['icon.png', null],
  ['robots.txt', null],
  ['site.webmanifest', null],
  ['tile.png', null],
  ['tile-wide.png', null],
];

module.exports = {
  srcDirWebSite: 'source_web_site',
  buildDirWebSite: 'build',

  srcDirImages: 'media',
  srcWildcardImages: '**/*',
  buildDirImages: null,

  srcDirCss: 'css',
  srcWildcardCss: '*.css',
  buildDirCss: null,
  buildFileCss: `all.${dateAsString}.min.css`,

  srcDirJs: 'js',
  srcWildcardJs: '*.js',
  buildDirJs: null,
  buildFileJs: `all.${dateAsString}.min.js`,

  srcDirHtml: null,
  srcWildcardHtml: '*.html',
  buildDirHtml: null,

  filesToCopyToBuildDir: new Map(filesToCopyToBuildDir)
};

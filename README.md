# SSM : Simple Site Minifier

## Description
Simply reduce your website size (css, js, images, ...) with Gulp.js

## Install
```
npm install simple-site-minifier
```

## Define a configuration file
You must provide an environment variable called `SSM_CONF_FILE` which contains the path to your configuration file. 

## Configuration file
The configuration file of ssm is a simple js file :
```
'use strict';

module.exports = {
  propertyName: "propertyValue"
};
```

## Properties
In your configuration file you must define the following properties :

| **Property name** | **Utility** | **Example** |
|----------|-------------:|-------------:|
| shellOutputPrefix | Prefix SSM console output with the given string | `--->SSM:`  |
| srcDirWebSite | The absolute path to your website | `/foo/bar` |
| buildDirWebSite | The absolute path for ssm compilation result | `/foo/bar/build` |
| srcDirImages | The path relative to srcDirWebSite for your images | `img` |
| srcWildcardImages | A wildcard to select your images | `**/*` |
| buildDirImages | If you want to change the path of your images in the compilation result | `null` |
| srcDirCss | The path relative to srcDirWebSite for your css files | `css` |
| srcWildcardCss | A wildcard to select your css files | `*.css` |
| buildDirCss | If you want to change the path of your css files in the compilation result | `null` |
| buildFileCss | The name of your compiled css file | `all.[ssm::currentDate].min.css` |
| srcDirJs | The path relative to srcDirWebSite for your js files | `css` |
| srcWildcardJs | A wildcard to select your js files | `*.js` |
| buildDirJs | If you want to change the path of your js files in the compilation result | `null` |
| buildFileJs | The name of your compiled js file | `all.[ssm::currentDate].min.js` |
| srcDirHtml | The path relative to srcDirWebSite for your html files | `null` |
| srcWildcardHtml | A wildcard to select your html files | `*.html` |
| buildDirHtml | If you want to change the path of your html files in the compilation result | `null` |
| filesToCopyToBuildDir | A map of extra file to copy in buildDirWebSite | `new Map(['favicon.ico', null])` |
| stringsToReplace | A map of string to replace in the compilation result | `new Map(['http://localhost/', 'http://mywebsite/'])` |
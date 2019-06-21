# PDF2Pic  
[![Build Status][travis-image]][travis-url]
[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]  
A utility for converting pdf to image and base64 format.  

## Prerequisite  
  
* node >= 4.1.2 
* graphicsmagick  
* ghostscript  

## Features  
  
* converts pdf to image.  
* converts pdf to base64. 
* customizable output.  
* customizable image quality.  
  
## Dependencies
  
* bluebird  
* fs-extra  
* gm  
* gm-base64
  
## Installation  
  
```
npm install -S pdf2pic
```
  
## Usage  
  
## Basic  
  
```javascript
const PDF2Pic = require("pdf2pic");

const pdf2pic = new PDF2Pic({
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: 600               // output size in pixels
});

pdf2pic.convert("/path/to/pdf/sample.pdf").then((resolve) => {
  console.log("image converter successfully!");

  return resolve;
});

```
## Convert all pages
  
```javascript
const PDF2Pic = require("pdf2pic");

const pdf2pic = new PDF2Pic({
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: 600               // output size in pixels
});

pdf2pic.convertBulk("path/to/pdf/sample.pdf", -1).then((resolve) => {
  console.log("image converter successfully!");

  return resolve;
});

```

## Multiple page conversion (specific pages)  
  
```javascript
const PDF2Pic = require("pdf2pic");

const pdf2pic = new PDF2Pic({
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: 600               // output size in pixels
});

pdf2pic.convertBulk("path/to/pdf/sample.pdf", [1,4,6]).then((resolve) => {
  console.log("image converter successfully!");

  return resolve;
});

```


## Convert pdf to base64 string of an image  
  
```javascript
const PDF2Pic = require("pdf2pic");

const pdf2pic = new PDF2Pic({
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: 600               // output size in pixels
});

pdf2pic.convertToBase64("path/to/pdf/sample.pdf").then((resolve) => {
  if (resolve.base64) {
    console.log("image converter successfully!");

    // assuming you're using some ORM to save base64 to db
    return db.model.table('users').update({id: "1", image: resolve.base64});
  }
});

```

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/pdf2pic.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pdf2pic
[npm-downloads]: https://img.shields.io/npm/dm/pdf2pic.svg?style=flat-square
[travis-image]: https://travis-ci.org/yakovmeister/pdf2image.svg?branch=1.0
[travis-url]: https://travis-ci.org/yakovmeister/pdf2image

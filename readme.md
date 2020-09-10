# PDF2Pic  
[![Donate][paypal-image]](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=938FMCPPQG4DQ&currency_code=USD&source=url)
[![Build Status][travis-image]][travis-url]
[![CodeFactor](https://www.codefactor.io/repository/github/yakovmeister/pdf2image/badge/next)](https://www.codefactor.io/repository/github/yakovmeister/pdf2image/overview/next)
[![Maintainability](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/maintainability)](https://codeclimate.com/github/yakovmeister/pdf2image/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/test_coverage)](https://codeclimate.com/github/yakovmeister/pdf2image/test_coverage)
[![install size](https://packagephobia.com/badge?p=pdf2pic)](https://packagephobia.com/result?p=pdf2pic)
[![NPM Version][npm-image]][npm-url]
[![License](https://img.shields.io/npm/l/pdf2pic?color=blue)][npm-url]
![David](https://img.shields.io/david/peer/yakovmeister/pdf2image)
![David](https://img.shields.io/david/dev/yakovmeister/pdf2image)
[![Known Vulnerabilities](https://snyk.io/test/npm/pdf2pic/badge.svg)](https://snyk.io/test/npm/pdf2pic)
[![Downloads Stats][npm-downloads]][npm-url]  
  
A utility for converting pdf to image and base64 format.  

> IMPORTANT NOTE: Please support this library by donating via [PayPal](https://www.paypal.com/paypalme/yakovmeister), your help is much appreciated. Contributors are also welcome!
  
## Prerequisite  
  
* node >= 12.x 
* graphicsmagick  
* ghostscript  
  
### Don't have graphicsmagick and ghostscript yet?  
  
Follow [this](docs/gm-installation.md) guide to install the required dependencies.  
  
## Installation  
  
```
npm install -S pdf2pic
```
  
## Usage  
  
### Converting specific page of PDF from path, then saving as image file  
  
```javascript
import { fromPath } from "pdf2pic";

const options = {
  density: 100,
  savename: "untitled",
  savedir: "./images",
  format: "png",
  width: 600,
  height: 600
};
const storeAsImage = fromPath("/path/to/pdf/sample.pdf", options);
const pageToConvertAsImage = 1;

storeAsImage(pageToConvertAsImage).then((resolve) => {
  console.log("Page 1 is now converted as image");

  return resolve;
});

```  
### Converting specific page of PDF from path, then saving as base64 string of image  
  
```javascript
import { fromPath } from "pdf2pic";

const options = {
  density: 100,           // output pixels per inch
  savename: "untitled",   // output file name
  savedir: "./images",    // output file location
  format: "png",          // output file format
  size: "600x600"         // output size in pixels
};
const convertPdf2Base64Image = fromPath("/path/to/pdf/sample.pdf", options);
const pageToConvertAsImage = 1;

// adding true as second parameter will transform response to base64 string
convertPdf2Base64Image(pageToConvertAsImage, true).then((resolve) => {
  console.log("Page 1 is now converted as base64string");

  console.log({
    base64string: resolve.base64
  })

  return resolve;
});

```  
  
## TO BE CONTINUED!

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/pdf2pic.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pdf2pic
[npm-downloads]: https://img.shields.io/npm/dm/pdf2pic.svg?style=flat-square
[travis-image]: https://travis-ci.org/yakovmeister/pdf2image.svg?branch=next
[travis-url]: https://travis-ci.org/yakovmeister/pdf2image
[paypal-image]: https://img.shields.io/badge/Donate-PayPal-green.svg
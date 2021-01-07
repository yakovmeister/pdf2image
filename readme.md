# PDF2Pic  
[![Donate][paypal-image]](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=938FMCPPQG4DQ&currency_code=USD&source=url)
[![Build Status][travis-image]][travis-url]
[![CodeFactor](https://www.codefactor.io/repository/github/yakovmeister/pdf2image/badge/next)](https://www.codefactor.io/repository/github/yakovmeister/pdf2image/overview/next)
[![Maintainability](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/maintainability)](https://codeclimate.com/github/yakovmeister/pdf2image/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/test_coverage)](https://codeclimate.com/github/yakovmeister/pdf2image/test_coverage)
[![install size](https://packagephobia.com/badge?p=pdf2pic)](https://packagephobia.com/result?p=pdf2pic)
[![NPM Version][npm-image]][npm-url]
[![License](https://img.shields.io/npm/l/pdf2pic?color=blue)][npm-url]
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
  saveFilename: "untitled",
  savePath: "./images",
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
  
### Nuff talk, show me how:
More usage example can be found [here](https://github.com/yakovmeister/pdf2pic-examples).  
  
## pdf2pic API  
  
### fromPath(filePath, options)  
  
Initialize PDF to image conversion by supplying a file path  
  
#### Functions  
  
Converts specific page of the PDF to Image/Base64 by supplying a file path  
  
```javascript
fromPath(filePath, options).convert(pageNumber, isBase64)
```
* filePath - pdf file's path  
* options - see [options](#options).  
* pageNumber - page number to be converted to image  
* isBase64 - if true, `convert()` will return base64 output instead  
  
---  
  
Converts PDF to Image/Base64 by supplying a file path  
```javascript
fromPath(filePath, options).bulk(pageNumber, isBase64)
```
* filePath - pdf file's path  
* options - see [options](#options).  
* pageNumber - page number/s to be converted to images  
  * set `pageNumber` to `-1` to select all pages  
  * `pageNumber` also accepts an array indicating the page number e.g. `[1,2,3]`
  * also accepts number e.g. `1`
* isBase64 - if true, `bulk()` will return an array of base64 output instead  
  
---
  
Set GraphicsMagick's subclass or path  
```javascript
fromPath(filePath, options).setGMClass(subClass)  
```  
NOTE: should be called before calling `convert()` or `bulk()`.
* filePath - pdf file's path  
* options - see [options](#options).  
* subClass - path to gm binary or set to true to use imagemagick  
  * set `subClass` to true to use imagemagick  
  * supply a valid path as `subClass` to locate gm path specified  
  
---
  
### fromBuffer(buffer, options)  
   
Initialize PDF to image conversion by supplying a PDF buffer  
  
#### Functions  
  
Converts specific page of the PDF to Image/Base64 by supplying a buffer  
```javascript
fromBuffer(buffer, options).convert(pageNumber, isBase64)
```
  
Functions same as `fromPath(filePath, options).convert(pageNumber, isBase64)` only input is changed  
  
---
Converts PDF to Image/Base64 by supplying a buffer  
  
```javascript
fromBuffer(buffer, options).bulk(pageNumber, isBase64)
```
  
Functions same as `fromPath(filePath, options).bulk(pageNumber, isBase64)` only input is changed  
  
---
Set GraphicsMagick's subclass or path  
```javascript
fromBuffer(buffer, options).setGMClass(subClass)  
```  
  
Functions same as `fromPath(filePath, options).setGMClass(subClass)` only input is changed  
  
---
  
### fromBase64(b64string, options)  
Initialize PDF to image conversion by supplying a PDF base64 string  
  
#### Functions  
  
Converts specific page of the PDF to Image/Base64 by supplying a base64 string  
```javascript
fromBase64(b64string, options).convert(pageNumber, isBase64)
```
  
Functions same as `fromPath(filePath, options).convert(pageNumber, isBase64)` only input is changed  
  
---
Converts PDF to Image/Base64 by supplying a base64 string  
  
```javascript
fromBase64(b64string, options).bulk(pageNumber, isBase64)
```
  
Functions same as `fromPath(filePath, options).bulk(pageNumber, isBase64)` only input is changed  
  
---
Set GraphicsMagick's subclass or path  
```javascript
fromBase64(b64string, options).setGMClass(subClass)  
```  
  
Functions same as `fromPath(filePath, options).setGMClass(subClass)` only input is changed  
  
---
### options  
Following are the options that can be passed on the pdf2pic api:
* quality - set output's image quality  
* format - set output's file format  
* width - set output's width  
* height - set output's height  
* density - controls output's dpi (i am not so sure)  
* savePath - set output's save path  
* saveFilename - set output's file name  
* compression - set output's compression method  
  
## Contributing
* Fork it (https://github.com/yakovmeister/pdf2image/fork)  
* Create your feature branch (git checkout -b feature/make-maintainer-cry)  
* Commit your changes (git commit -am 'feature: make maintainer cry by running git rm -rf')  
* Push to the branch (git push origin feature/make-maintainer-cry)
* Create a new PR  
  
## License
pdf2pic is [MIT licensed](LICENSE).
  
<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/pdf2pic.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/pdf2pic
[npm-downloads]: https://img.shields.io/npm/dm/pdf2pic.svg?style=flat-square
[travis-image]: https://travis-ci.org/yakovmeister/pdf2image.svg?branch=next
[travis-url]: https://travis-ci.org/yakovmeister/pdf2image
[paypal-image]: https://img.shields.io/badge/Donate-PayPal-green.svg  

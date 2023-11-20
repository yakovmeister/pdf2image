# pdf2pic

[![Donate][paypal-image]](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=938FMCPPQG4DQ&currency_code=USD&source=url)
![Build Status][github-actions-url]
[![CodeFactor](https://www.codefactor.io/repository/github/yakovmeister/pdf2image/badge)](https://www.codefactor.io/repository/github/yakovmeister/pdf2image)
[![Maintainability](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/maintainability)](https://codeclimate.com/github/yakovmeister/pdf2image/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6d7bfbae9057998bda99/test_coverage)](https://codeclimate.com/github/yakovmeister/pdf2image/test_coverage)
[![install size](https://packagephobia.com/badge?p=pdf2pic)](https://packagephobia.com/result?p=pdf2pic)
[![NPM Version][npm-image]][npm-url]
[![License](https://img.shields.io/npm/l/pdf2pic?color=blue)][npm-url]
[![Known Vulnerabilities](https://snyk.io/test/npm/pdf2pic/badge.svg)](https://snyk.io/test/npm/pdf2pic)
[![Downloads Stats][npm-downloads]][npm-url]

A utility for converting pdf to image, base64 or buffer format.

> IMPORTANT NOTE: Please support this library by donating via [PayPal](https://www.paypal.com/paypalme/yakovmeister), your help is much appreciated. Contributors are also welcome!

## Prerequisites

* node >= 14.x 
* graphicsmagick
* ghostscript

### Don't have graphicsmagick and ghostscript yet?

Follow [this](docs/gm-installation.md) guide to install the required dependencies.

## Installation

```
npm install --save pdf2pic
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
const convert = fromPath("/path/to/pdf/sample.pdf", options);
const pageToConvertAsImage = 1;

convert(pageToConvertAsImage, { responseType: "image" })
  .then((resolve) => {
    console.log("Page 1 is now converted as image");

    return resolve;
  });
```

### Nuff talk, show me how:
More usage example can be found [here](https://github.com/yakovmeister/pdf2pic-examples).

## pdf2pic API

- [fromPath(filePath, options)](#frompathfilepath-options)
- [fromBuffer(buffer, options)](#frombufferbuffer-options)
- [fromBase64(b64string, options)](#frombase64b64string-options)

### fromPath(filePath, options)

Initialize PDF to image conversion by supplying a file path

#### Functions

Convert a specific page of the PDF to Image/Base64/Buffer by supplying a file path

```javascript
fromPath(filePath, options)(page, convertOptions)
```
* filePath - pdf file's path
* options - see [options](#options).
* page - page number to convert to an image
* convertOptions - see [convertOptions](#convertoptions).

---

Converts PDF to Image/Base64/Buffer by supplying a file path
```javascript
fromPath(filePath, options).bulk(pages, convertOptions)
```
* filePath - pdf file's path
* options - see [options](#options).
* pages - page numbers to convert to image
  * set `pages` to `-1` to convert all pages
  * `pages` also accepts an array indicating the page number e.g. `[1,2,3]`
  * also accepts number e.g. `1`
* convertOptions - see [convertOptions](#convertoptions)

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

Convert a specific page of the PDF to Image/Base64/Buffer by supplying a buffer
```javascript
fromBuffer(buffer, options)(page, convertOptions)
```

Functions same as `fromPath(filePath, options)(page, convertOptions)` only input is changed

---
Converts PDF to Image/Base64/Buffer by supplying a buffer:

```javascript
fromBuffer(buffer, options).bulk(pages, convertOptions)
```

Functions same as `fromPath(filePath, options).bulk(pages, convertOptions)` only input is changed

---
Set GraphicsMagick's subclass or path:
```javascript
fromBuffer(buffer, options).setGMClass(subClass)
```

Functions same as `fromPath(filePath, options).setGMClass(subClass)` only input is changed

---

### fromBase64(b64string, options)
Initialize PDF to image conversion by supplying a PDF base64 string.

#### Functions
Convert a specific page of the PDF to Image/Base64/Buffer by supplying a base64 string:
```javascript
fromBase64(b64string, options)(page, convertOptions)
```

Functions same as `fromPath(filePath, options)(page, convertOptions)` only input is changed.

---
Converts PDF to Image/Base64/Buffer by supplying a base64 string:

```javascript
fromBase64(b64string, options).bulk(pages, convertOptions)
```

Functions same as `fromPath(filePath, options).bulk(pages, convertOptions)` only input is changed.

---
Set GraphicsMagick's subclass or path:
```javascript
fromBase64(b64string, options).setGMClass(subClass)
```

Functions same as `fromPath(filePath, options).setGMClass(subClass)` only input is changed.
---
### options
Following are the options that can be passed on the pdf2pic api:

| option              | default value | description                                                                                                                                                                                                                                                                   |
|---------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| quality             | `0`           | Image compression level. Value depends on `format`, usually from `0` to `100` ([more info](http://www.graphicsmagick.org/GraphicsMagick.html#details-quality))                                                                                                                |
| format              | `'png'`       | Formatted image characteristics / image format ([image characteristics](http://www.graphicsmagick.org/GraphicsMagick.html#details-format), [image format](http://www.graphicsmagick.org/formats.html))                                                                        |
| width               | `768`         | Output width                                                                                                                                                                                                                                                                  |
| height              | `512`         | Output height                                                                                                                                                                                                                                                                 |
| preserveAspectRatio | `false`       | Maintains the aspect ratio of the image. When set to `true` and both `width` and `height` are specified, they are interpreted as the minimum width and minimum height, respectively. If set to `true` with only the `width` specified, the `height` will be automatically determined while preserving the aspect ratio, and vice versa. |
| density             | `72`          | Output DPI (dots per inch) ([more info](http://www.graphicsmagick.org/GraphicsMagick.html#details-density))                                                                                                                                                                   |
| savePath            | `'./'`        | Path where to save the output                                                                                                                                                                                                                                                 |
| saveFilename        | `'untitled'`  | Output filename                                                                                                                                                                                                                                                               |
| compression         | `'jpeg'`      | Compression method ([more info](http://www.graphicsmagick.org/GraphicsMagick.html#details-compress))                                                                                                                                                                          |

### convertOptions

| option       | default value | description |
|--------------|---------------|-------------|
| responseType | `image`       | Response type of the output. Accepts: `image`, `base64` or `buffer` |

The parameter can also be a boolean, if `true` then the response type will be `base64` and if `false` then the response type will be `image`. 
This is deprecated and will be removed in the next major version.

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
[github-actions-url]: https://github.com/yakovmeister/pdf2image/actions/workflows/test.yml/badge.svg?branch=master
[paypal-image]: https://img.shields.io/badge/Donate-PayPal-green.svg

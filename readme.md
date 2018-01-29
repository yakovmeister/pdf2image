# PDF2Pic  
[![Build Status](https://travis-ci.org/yakovmeister/pdf2image.svg?branch=1.0)](https://travis-ci.org/yakovmeister/pdf2image)
[![Version](https://img.shields.io/badge/version-1.1.7-blue.svg)](https://github.com/yakovmeister/pdf2image/tree/1.0)  
Node module for converting PDF to image based on pdf2img by Fitra Adity  

## Prerequisite  
  
* node >= 4.1.2 

## Features  
  
* converts pdf to image, duh.  
* converts pdf to base64.  
  
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
  
```javascript
let PDF2Pic = require('pdf2pic')
let converter = new PDF2Pic({
    density: 100,           // output pixels per inch
    savename: "untitled",   // output file name
    savedir: "./images",    // output file location
    format: "png",          // output file format
    size: 600               // output size in pixels
})

// by default the first page of the pdf will be converted
// to image
converter.convert("/path/to/pdf/sample.pdf")
         .then(resolve => {
             console.log("image converted successfully")
         })

// or you can also convert bulk
// in this example we will only convert pages 1 4 and 6
converter.convertBulk("path/to/pdf/sample.pdf", [1,4,6])
         .then(resolve => {
             console.log("image converted successfully")
         })


// fuck it, we can also convert all pages to pdf by
// supplying -1 as second argument
converter.convertBulk("path/to/pdf/sample.pdf", -1)
         .then(resolve => {
             console.log("image converted successfully")
         })


// you can also directly convert pdf to base64 of an image
converter.convertToBase64("path/to/pdf/sample.pdf")
         .then(resolve => {
             if(resolve.base64) {
                 // assuming you're using some ORM to save base64 to db
                 db.model.table('users').update({id: "1", image: resolve.base64})
             }
         })
```  
  
## Issues  
  
* running convert() after running convertToBase64() doesn't save the file.
* for some reason, test file results are all fucked up
___

This module is based on Fitra Adity's Great work.
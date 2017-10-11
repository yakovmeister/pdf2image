# PDF2Pic  
  
Node module for converting PDF to image based on pdf2img by Fitra Adity  
  
## Usage  
  
```javascript
let PDF2Pic = require('pdf2pic')
let converter = new PDF2Pic({
    density: 100,
    savename: "untitled",
    savedir: "./images"
})

converter.convert("/path/to/pdf/sample.pdf")
         .then(resolve => {
             console.log("image converted successfully")
         })
```  
  
___

This module is based on Fitra Adity's Great work.
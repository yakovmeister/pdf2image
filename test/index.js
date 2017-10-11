let assert = require('assert')
let PDF2Pic = require('./../lib')
let PDF2PicInstance = new PDF2Pic({
    savedir: "./test/o",
    savename: "tests",
    density: 50,
    size: 600,
    format: "png"
})

describe('PDF2Pic', () => {
    it("should convert pdf1 first page", function* () {
        PDF2PicInstance.set("savedir", "./test/o/test_1")
        yield PDF2PicInstance.convert("./test/docs/pdf1.pdf")
    })
    
    it("should convert pdf1 second page", function* () {
        PDF2PicInstance.set("savedir", "./test/o/test_2")
         yield PDF2PicInstance.convert("./test/docs/pdf1.pdf", 2)
    })

    it("should convert pdf1 all pages", function* () { 
        this.timeout(100000)
        PDF2PicInstance.set("savedir", "./test/o/test_3")
        yield PDF2PicInstance.convertBulk("./test/docs/pdf1.pdf", -1)
    })

    it("should convert pdf1 page 1 5 and 8", function* () { 
        this.timeout(100000)
        PDF2PicInstance.set("savedir", "./test/o/test_4")
        yield PDF2PicInstance.convertBulk("./test/docs/pdf1.pdf", [1,5,8])
    })
})
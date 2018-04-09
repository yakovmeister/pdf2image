import assert from 'assert'
import PDF2Pic from './../src/index'
import { expect } from 'chai'

describe('PDF2Pic', () => {
  let pdf2pic = new PDF2Pic({
    savedir: "./test/output",
    savename: "tests",
    density: 72,
    size: "768x512",
    format: "png"
  })

  it('should convert pdf1 first page', function () {
    return pdf2pic.convert('./test/docs/pdf1.pdf')
      .then(resolve =>
        expect(resolve.size).to.be.above(0)
      )
  })

  it('should convert pdf1 second page', function () {
    return pdf2pic.convert('./test/docs/pdf1.pdf', 2)
      .then(resolve =>
        expect(resolve.size).to.be.above(0)
      )
  })

  it("should convert pdf1 all pages", function () { 
    return pdf2pic.convertBulk('./test/docs/pdf1.pdf', -1)
      .then(resolve =>
        expect(resolve.length).to.be.above(0)
      )
  })

  it('should convert pdf1 page 1, 5 and 8', function () {
    return pdf2pic.convertBulk('./test/docs/pdf1.pdf', [1, 5, 8])
      .then(resolve =>
        expect(resolve.length).to.be.equal(3)
      )
  })

  it('should convert all huge_size pages to pdf', function () {
    return pdf2pic.convertBulk('./test/docs/huge size.pdf')
      .then(resolve =>
        expect(resolve.length).to.be.above(0)
      )
  })

  it('should convert pdf1 first page to base64', function () {
    return pdf2pic.convertToBase64('./test/docs/pdf1.pdf')
      .then(resolve => 
        expect(resolve.page).not.to.be.empty
      )
  })
  
  it('should convert all pages of pdf1 to base64', function () {
    return pdf2pic.convertToBase64Bulk('./test/docs/pdf1.pdf')
      .then(resolve =>
        expect(resolve.length).not.to.be.empty
      )
  })
})
import assert from 'assert'
import PDF2Pic from './../src/index'
import { expect } from 'chai'

describe('PDF2Pic', function () {
  let pdf2pic = new PDF2Pic({
    savename: "test",
    density: 72,
    size: "768x512",
    format: "png"
  })

  beforeEach(function () {
    let savedir = `./test/output/${Math.random().toString(10).substring(7)}`

    pdf2pic.setOption('savedir', savedir)
    this.timeout(1000000)
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
    pdf2pic.convertBulk('./test/docs/pdf1.pdf', -1)
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
  
  it('should convert pdf1 first page to base64', function () {
    return pdf2pic.convertToBase64('./test/docs/pdf1.pdf')
      .then(resolve =>
        expect(resolve.page).to.be.above(0)
      )
  })
})
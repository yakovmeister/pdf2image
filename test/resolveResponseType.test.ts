import chai, { expect } from 'chai';
import { resolveResponseType } from '@module/utils/resolveResponseType'

describe('resolveResponseType', () => {
  it('should resolve to image if convertOptions is undefined', () => {
    expect(resolveResponseType()).to.equal('image')
  });

  it('should resolve to image if convertOptions is false', () => {
    expect(resolveResponseType(false)).to.equal('image')
  });

  it('should resolve to image if responseType is image', () => {
    expect(resolveResponseType({ responseType: 'image' })).to.equal('image')
  })

  it('should resolve to image if convertOptions is true', () => {
    expect(resolveResponseType(true)).to.equal('base64')
  });

  it('should resolve to base64 if responseType is base64', () => {
    expect(resolveResponseType({ responseType: 'image' })).to.equal('image')
  });

  it('should throw an error if convertOptions is invalid type', async () => {
    // @ts-ignore
    expect(() => resolveResponseType(1)).to.throw()
  });
})

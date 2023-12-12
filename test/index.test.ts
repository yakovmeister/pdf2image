import chai, { expect } from 'chai';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import gm from 'gm';
import path from 'path';
import { rimrafSync } from 'rimraf';
import { fromBase64, fromBuffer, fromPath } from '../src/index';
import { Graphics } from '../src/graphics';
import { BufferResponse, ToBase64Response, WriteImageResponse } from '../src/types/convertResponse';
import { Options } from '../src/types/options';
import { defaultOptions } from '../src/utils/defaultOptions';

describe('PDF2Pic Core', () => {
  const baseOptions = {
    quality: 100,
    format: 'jpg',
    width: 768,
    height: 512,
    savePath: './dump/fromfiletest',
  };

  const expectInfoToBeValid = (info: gm.ImageInfo, options) => {
    expect(info).to.haveOwnProperty('format');
    if (options.format) {
      expect(info.format).to.be.equal(options.format.toUpperCase());
    } else {
      expect(info.format).to.be.equal('PNG');
    }
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    if (options.width) {
      expect(info.size.width).to.be.equal(options.width);
    }
    expect(info.size).to.haveOwnProperty('height');
    if (options.height) {
      expect(info.size.height).to.be.equal(options.height);
    }
  };

  const expectImageResponseToBeValid = (response: WriteImageResponse, options: Options) => {
    expect(response).to.haveOwnProperty('name');
    expect(response.name).to.be.a('string');
    expect(response).to.haveOwnProperty('size');
    expect(response.size).to.be.a('string');
    expect(response).to.haveOwnProperty('fileSize');
    expect(response.fileSize).to.be.a('number');
    expect(response).to.haveOwnProperty('path');
    const savePath = `${options.savePath.startsWith('./') ? './' : ''}${path.join(options.savePath, response.name)}`;
    expect(response.path).to.equal(savePath);
    expect(response).to.haveOwnProperty('page');
    expect(response.page).to.be.a('number');
  };

  const expectBase64ResponseToBeValid = (response: ToBase64Response) => {
    expect(response).to.haveOwnProperty('base64');
    expect(response.base64).to.be.a('string');
    expect(response).to.haveOwnProperty('size');
    expect(response.size).to.be.a('string');
    expect(response).to.haveOwnProperty('page');
    expect(response.page).to.be.a('number');
  };

  before(() => {
    rimrafSync('./dump/fromfiletest');
    rimrafSync('./dump/frombuffertest');
    rimrafSync('./dump/frombase64test');

    mkdirSync('./dump/fromfiletest', { recursive: true });
  });

  it('should use default options', async () => {
    const convert = fromPath('./test/data/pdf1.pdf');
    const imageResponse = await convert();

    expectImageResponseToBeValid(imageResponse, defaultOptions);

    const defaultFilePath = `${defaultOptions.savePath}${defaultOptions.saveFilename}.1.${defaultOptions.format}`;
    const gm = new Graphics();
    const info = (await gm.identify(defaultFilePath)) as gm.ImageInfo;
    expect(info.format).to.equal(defaultOptions.format.toUpperCase());
    expect(info.size.width).to.equal(defaultOptions.width);
    expect(info.size.height).to.equal(defaultOptions.height);
    rimrafSync(defaultFilePath);
  });

  it('should convert pdf to pic (file input, first page)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-1',
    };

    const convert = fromPath('./test/data/pdf1.pdf', options);
    const imageResponse = await convert();

    expectImageResponseToBeValid(imageResponse, options);
    const info = (await gm.identify('./dump/fromfiletest/test-1.1.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (buffer input, first page)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-1',
    };
    const buffer = readFileSync('./test/data/pdf1.pdf');

    const convert = fromBuffer(buffer, options);
    const imageResponse = await convert();

    expectImageResponseToBeValid(imageResponse, options);
    const info = (await gm.identify('./dump/fromfiletest/test-1.1.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (base64 input, first page)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-1',
    };
    const b64 = readFileSync('./test/data/pdf1.pdf', 'base64');

    const convert = fromBase64(b64, options);
    const imageResponse = await convert();

    expectImageResponseToBeValid(imageResponse, options);
    const info = (await gm.identify('./dump/fromfiletest/test-1.1.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (file input, second page, base64 output)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-2',
    };

    const convert = fromPath('./test/data/pdf1.pdf', options);
    const base64Response = await convert(2, { responseType: 'base64' });

    expectBase64ResponseToBeValid(base64Response);
    writeFileSync('./dump/fromfiletest/frombase64.png', Buffer.from(base64Response.base64, 'base64'));
    const info = (await gm.identify('./dump/fromfiletest/frombase64.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (buffer input, second page, base64 output)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-2',
    };

    const buffer = readFileSync('./test/data/pdf1.pdf');

    const convert = fromBuffer(buffer, options);
    const base64Response = await convert(2, { responseType: 'base64' });

    expectBase64ResponseToBeValid(base64Response);
    writeFileSync('./dump/fromfiletest/frombase64.png', Buffer.from(base64Response.base64, 'base64'));
    const info = (await gm.identify('./dump/fromfiletest/frombase64.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (base64 input, second page, base64 output)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      saveFilename: 'test-2',
    };

    const b64 = readFileSync('./test/data/pdf1.pdf', 'base64');

    const convert = fromBase64(b64, options);
    const base64Response = await convert(2, { responseType: 'base64' });

    expectBase64ResponseToBeValid(base64Response);
    writeFileSync('./dump/fromfiletest/frombase64.png', Buffer.from(base64Response.base64, 'base64'));
    const info = (await gm.identify('./dump/fromfiletest/frombase64.png')) as gm.ImageInfo;
    expectInfoToBeValid(info, options);
  });

  it('should convert pdf to pic (file input, bulk 2 pages)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      width: 768,
      height: 512,
      saveFilename: 'test-3',
    };

    const convert = fromPath('./test/data/pdf1.pdf', options);
    const imageResponse = await convert.bulk([1, 2], {
      responseType: 'image',
    });

    expect(imageResponse).to.be.an('array').that.has.lengthOf(2);
    for (let i = 0; i < imageResponse.length; i++) {
      expectImageResponseToBeValid(imageResponse[i], options);
      const info = (await gm.identify(`./dump/fromfiletest/test-3.${i + 1}.png`)) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    }
  }).timeout(7000);

  it('should convert pdf to pic (file input, bulk all pages)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      width: 768,
      height: 512,
      saveFilename: 'test-3',
    };

    const convert = fromPath('./test/data/pdf1.pdf', options);
    const imageResponse = await convert.bulk(-1, { responseType: 'image' });

    expect(imageResponse).to.be.an('array').that.has.lengthOf(9);
    for (let i = 0; i < imageResponse.length; i++) {
      expectImageResponseToBeValid(imageResponse[i], options);
      const info = (await gm.identify(`./dump/fromfiletest/test-3.${i + 1}.png`)) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    }
  }).timeout(7000);

  it('should convert pdf to pic (buffer input, bulk all pages)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      width: 768,
      height: 512,
      saveFilename: 'test-3',
    };

    const buffer = readFileSync('./test/data/pdf1.pdf');

    const convert = fromBuffer(buffer, options);
    const imageResponse = await convert.bulk(-1);

    expect(imageResponse).to.be.an('array').that.has.lengthOf(9);
    for (let i = 0; i < imageResponse.length; i++) {
      expectImageResponseToBeValid(imageResponse[i], options);
      const info = (await gm.identify(`./dump/fromfiletest/test-3.${i + 1}.png`)) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    }
  }).timeout(7000);

  it('should convert pdf to pic (base64 input, bulk all pages)', async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: 'png',
      width: 768,
      height: 512,
      saveFilename: 'test-3',
    };

    const b64 = readFileSync('./test/data/pdf1.pdf', 'base64');

    const convert = fromBase64(b64, options);
    const base64Responses = await convert.bulk(-1, {
      responseType: 'base64',
    });

    expect(base64Responses).to.be.an('array').that.has.lengthOf(9);
    for (let i = 0; i < base64Responses.length; i++) {
      expectBase64ResponseToBeValid(base64Responses[i]);
      const filename = `./dump/fromfiletest/test-3.b64.${i + 1}.png`;
      writeFileSync(filename, Buffer.from(base64Responses[i].base64, 'base64'));
      const info = (await gm.identify(filename)) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    }
  }).timeout(7000);

  describe('responseType: buffer', () => {
    const expectBufferResponseToBeValid = (response: BufferResponse) => {
      expect(response).to.haveOwnProperty('buffer');
      expect(Buffer.isBuffer(response.buffer)).to.be.true;
      expect(response).to.haveOwnProperty('size');
      expect(response.size).to.be.a('string');
      expect(response).to.haveOwnProperty('page');
      expect(response.page).to.be.a('number');
    };

    it('should convert pdf to pic (file input, first page)', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
      };

      const convert = fromPath('./test/data/pdf1.pdf', options);
      const bufferResponse = await convert(2, { responseType: 'buffer' });

      expectBufferResponseToBeValid(bufferResponse);
      writeFileSync('./dump/fromfiletest/out-buffer-1.png', bufferResponse.buffer);
      const info = (await gm.identify('./dump/fromfiletest/out-buffer-1.png')) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    });

    it('should convert pdf to pic (buffer input, second page)', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
      };

      const buffer = readFileSync('./test/data/pdf1.pdf');

      const convert = fromBuffer(buffer, options);
      const bufferResponse = await convert(2, { responseType: 'buffer' });

      expectBufferResponseToBeValid(bufferResponse);
      writeFileSync('./dump/fromfiletest/out-buffer-2.png', bufferResponse.buffer);
      const info = (await gm.identify('./dump/fromfiletest/out-buffer-2.png')) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    });

    it('should convert pdf to pic (base64 input, second page)', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
        saveFilename: 'test-2',
      };

      const b64 = readFileSync('./test/data/pdf1.pdf', 'base64');

      const convert = fromBase64(b64, options);
      const bufferResponse = await convert(2, { responseType: 'buffer' });

      expectBufferResponseToBeValid(bufferResponse);
      writeFileSync('./dump/fromfiletest/out-buffer-3.png', bufferResponse.buffer);
      const info = (await gm.identify('./dump/fromfiletest/out-buffer-3.png')) as gm.ImageInfo;
      expectInfoToBeValid(info, options);
    });

    it('should convert pdf to pic (base64 input, bulk all pages)', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
        width: 768,
        height: 512,
      };

      const b64 = readFileSync('./test/data/pdf1.pdf', 'base64');

      const convert = fromBase64(b64, options);
      const bufferResponses = await convert.bulk(-1, {
        responseType: 'buffer',
      });

      expect(bufferResponses).to.be.an('array').that.has.lengthOf(9);
      for (let i = 0; i < bufferResponses.length; i++) {
        expectBufferResponseToBeValid(bufferResponses[i]);
        const filename = `./dump/fromfiletest/test-bulk.buffer.${i + 1}.png`;
        writeFileSync(filename, bufferResponses[i].buffer);
        const info = (await gm.identify(filename)) as gm.ImageInfo;
        expectInfoToBeValid(info, options);
      }
    }).timeout(7000);
  });

  describe('preserveAspectRatio', () => {
    it('should preserve aspect ratio of pages', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
        width: undefined,
        height: undefined,
        preserveAspectRatio: true,
        saveFilename: 'test-aspect-ratio-1',
      };

      const convert = fromPath('./test/data/pdf1.pdf', options);
      const imageResponse = await convert.bulk([1, 2], {
        responseType: 'image',
      });

      expect(imageResponse).to.be.an('array').that.has.lengthOf(2);

      expectImageResponseToBeValid(imageResponse[0], options);
      const page1Info = (await gm.identify(`./dump/fromfiletest/${options.saveFilename}.1.png`)) as gm.ImageInfo;
      expectInfoToBeValid(page1Info, {
        ...options,
        width: 842,
        height: 595,
      });

      expectImageResponseToBeValid(imageResponse[1], options);
      const page2Info = (await gm.identify(`./dump/fromfiletest/${options.saveFilename}.2.png`)) as gm.ImageInfo;
      expectInfoToBeValid(page2Info, {
        ...options,
        width: 1684,
        height: 595,
      });
    });

    it('should set height automatically', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
        width: 600,
        height: undefined,
        preserveAspectRatio: true,
        saveFilename: 'test-aspect-ratio-2',
      };

      const convert = fromPath('./test/data/pdf1.pdf', options);
      const imageResponse = await convert(1, { responseType: 'image' });

      expectImageResponseToBeValid(imageResponse, options);
      const page1Info = (await gm.identify(`./dump/fromfiletest/${options.saveFilename}.1.png`)) as gm.ImageInfo;
      expectInfoToBeValid(page1Info, { ...options, height: 424 });
    });

    it('should set width automatically', async () => {
      const gm = new Graphics();
      const options = {
        ...baseOptions,
        format: 'png',
        width: undefined,
        height: 600,
        preserveAspectRatio: true,
        saveFilename: 'test-aspect-ratio-3',
      };

      const convert = fromPath('./test/data/pdf1.pdf', options);
      const imageResponse = await convert(1, { responseType: 'image' });

      expectImageResponseToBeValid(imageResponse, options);
      const page1Info = (await gm.identify(`./dump/fromfiletest/${options.saveFilename}.1.png`)) as gm.ImageInfo;
      expectInfoToBeValid(page1Info, { ...options, width: 849 });
    });
  });
});

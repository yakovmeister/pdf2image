import chai, { expect } from 'chai';
import { mkdirSync, createReadStream, writeFileSync } from 'fs';
import { rimrafSync } from 'rimraf';
import gm from 'gm';
import { Graphics } from '../src/graphics';

describe('graphics', () => {
  before(() => {
    rimrafSync('./dump/savefiletest');

    mkdirSync('./dump/savefiletest', { recursive: true });
  });

  it('should return page numbers', async () => {
    const gm = new Graphics();

    const pageNumbers = await gm.identify('./test/data/pdf1.pdf', '%p ');

    expect(pageNumbers).to.be.equal('1 2 3 4 5 6 7 8 9');
  });

  it('should return page numbers (from stream)', async () => {
    const gm = new Graphics();
    const file = createReadStream('./test/data/pdf1.pdf');

    const pageNumbers = await gm.identify(file, '%p ');

    expect(pageNumbers).to.be.equal('1 2 3 4 5 6 7 8 9');
  });

  it('should return file information', async () => {
    const gm = new Graphics();

    const result = await gm.identify('./test/data/pdf2.pdf');

    expect(result).to.have.haveOwnProperty('Format');
    expect((result as gm.ImageInfo).format).to.be.equal('PDF');
  });

  it('should return all of the options (default options)', () => {
    const gm = new Graphics();

    const options = gm.getOptions();

    expect(options).to.haveOwnProperty('quality');
    expect(options.quality).to.be.equal(0);

    expect(options).to.haveOwnProperty('format');
    expect(options.format).to.be.equal('png');

    expect(options).to.haveOwnProperty('width');
    expect(options.width).to.be.equal(768);

    expect(options).to.haveOwnProperty('height');
    expect(options.height).to.be.equal(512);

    expect(options).to.haveOwnProperty('density');
    expect(options.density).to.be.equal(72);

    expect(options).to.haveOwnProperty('savePath');
    expect(options.savePath).to.be.equal('./');

    expect(options).to.haveOwnProperty('saveFilename');
    expect(options.saveFilename).to.be.equal('untitled');

    expect(options).to.haveOwnProperty('compression');
    expect(options.compression).to.be.equal('jpeg');
  });

  it('should set and return all of the options (custom options)', () => {
    const gm = new Graphics();

    gm.setQuality(100);
    gm.setFormat('jpg');
    gm.setPreserveAspectRatio(true);
    gm.setSize(100, 100);
    gm.setDensity(100);
    gm.setSavePath('./test/data');
    gm.setSaveFilename('specimen');
    gm.setCompression('Lossless');

    const options = gm.getOptions();

    expect(options).to.haveOwnProperty('quality');
    expect(options.quality).to.be.equal(100);

    expect(options).to.haveOwnProperty('format');
    expect(options.format).to.be.equal('jpg');

    expect(options).to.haveOwnProperty('width');
    expect(options.width).to.be.equal(100);

    expect(options).to.haveOwnProperty('height');
    expect(options.height).to.be.equal(100);

    expect(options).to.haveOwnProperty('preserveAspectRatio');
    expect(options.preserveAspectRatio).to.be.equal(true);

    expect(options).to.haveOwnProperty('density');
    expect(options.density).to.be.equal(100);

    expect(options).to.haveOwnProperty('savePath');
    expect(options.savePath).to.be.equal('./test/data');

    expect(options).to.haveOwnProperty('saveFilename');
    expect(options.saveFilename).to.be.equal('specimen');

    expect(options).to.haveOwnProperty('compression');
    expect(options.compression).to.be.equal('Lossless');
  });

  it('should by default use width as height if no height is given', () => {
    const gm = new Graphics();

    gm.setSize(200);

    const options = gm.getOptions();

    expect(options).to.haveOwnProperty('width');
    expect(options.width).to.be.equal(200);

    expect(options).to.haveOwnProperty('height');
    expect(options.height).to.be.equal(200);
  });

  it('should by not set height if preserveAspectRatio is `true`', () => {
    const gm = new Graphics();

    gm.setPreserveAspectRatio(true);
    gm.setSize(200);

    const options = gm.getOptions();

    expect(options).to.haveOwnProperty('width');
    expect(options.width).to.be.equal(200);

    expect(options).to.haveOwnProperty('height');
    expect(options.height).to.be.equal(undefined);
  });

  it('should save first page as image file', async () => {
    const gm = new Graphics();

    gm.setSize(1684, 2384);
    gm.setSavePath(`./dump/savefiletest`);
    const file = createReadStream('./test/data/pdf2.pdf');

    await gm.writeImage(file, 0);

    const info = (await gm.identify('./dump/savefiletest/untitled.1.png')) as gm.ImageInfo;

    expect(info).to.haveOwnProperty('format');
    expect(info.format).to.be.equal('PNG');
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    expect(info.size.width).to.be.equal(1684);
    expect(info.size).to.haveOwnProperty('height');
    expect(info.size.height).to.be.equal(2384);
  });

  it('should save second page as image file', async () => {
    const gm = new Graphics();

    gm.setSize(1684, 2384);
    gm.setSavePath(`./dump/savefiletest`);
    const file = createReadStream('./test/data/pdf2.pdf');

    await gm.writeImage(file, 1);

    const info = (await gm.identify('./dump/savefiletest/untitled.2.png')) as gm.ImageInfo;

    expect(info).to.haveOwnProperty('format');
    expect(info.format).to.be.equal('PNG');
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    expect(info.size.width).to.be.equal(1684);
    expect(info.size).to.haveOwnProperty('height');
    expect(info.size.height).to.be.equal(2384);
  });

  it('should save second page as base64 string', async () => {
    const gm = new Graphics();

    gm.setSize(1684, 2384);
    gm.setSavePath(`./dump/savefiletest`);
    const file = createReadStream('./test/data/pdf2.pdf');

    const base64string = await gm.toBase64(file, 1);

    writeFileSync('./dump/savefiletest/frombase64.png', Buffer.from(base64string.base64, 'base64'));

    const info = (await gm.identify('./dump/savefiletest/frombase64.png')) as gm.ImageInfo;

    expect(info).to.haveOwnProperty('format');
    expect(info.format).to.be.equal('PNG');
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    expect(info.size.width).to.be.equal(1684);
    expect(info.size).to.haveOwnProperty('height');
    expect(info.size.height).to.be.equal(2384);
  });

  it('should save second page as buffer', async () => {
    const gm = new Graphics();

    gm.setSize(1684, 2384);
    gm.setSavePath(`./dump/savefiletest`);
    const file = createReadStream('./test/data/pdf2.pdf');

    const { buffer } = await gm.toBuffer(file, 1);

    expect(Buffer.isBuffer(buffer)).to.be.true;
    writeFileSync('./dump/savefiletest/tobuffer.png', buffer);

    const info = (await gm.identify('./dump/savefiletest/tobuffer.png')) as gm.ImageInfo;

    expect(info).to.haveOwnProperty('format');
    expect(info.format).to.be.equal('PNG');
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    expect(info.size.width).to.be.equal(1684);
    expect(info.size).to.haveOwnProperty('height');
    expect(info.size.height).to.be.equal(2384);
  });
});

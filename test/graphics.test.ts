import chai, { expect } from "chai";
import { Graphics } from "../src/graphics";
import { mkdirsSync, readFileSync, createReadStream } from "fs-extra";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import rimraf from "rimraf";
import gm from "gm";

describe("graphics", () => {
  before(() => {
    rimraf.sync("./dump/savefiletest");
  });

  it("should return page numbers", async () => {
    const gm = new Graphics();

    const pageNumbers = await gm.identify("./test/data/pdf2.pdf", "%p ");

    expect(pageNumbers).to.be.equal("1 2");
  });

  it("should return file information", async () => {
    const gm = new Graphics();

    const result = await gm.identify("./test/data/pdf2.pdf");

    expect(result).to.have.haveOwnProperty("Format");
    expect((result as gm.ImageInfo).format).to.be.equal("PDF");
  });

  it("should return all of the options (default options)", () => {
    const gm = new Graphics();

    const options = gm.getOptions();

    expect(options).to.haveOwnProperty("quality");
    expect(options.quality).to.be.equal(0);

    expect(options).to.haveOwnProperty("format");
    expect(options.format).to.be.equal("png");

    expect(options).to.haveOwnProperty("width");
    expect(options.width).to.be.equal(768);

    expect(options).to.haveOwnProperty("height");
    expect(options.height).to.be.equal(512);
  
    expect(options).to.haveOwnProperty("density");
    expect(options.density).to.be.equal(72);

    expect(options).to.haveOwnProperty("savePath");
    expect(options.savePath).to.be.equal("./");

    expect(options).to.haveOwnProperty("saveFilename");
    expect(options.saveFilename).to.be.equal("untitled");

    expect(options).to.haveOwnProperty("compression");
    expect(options.compression).to.be.equal("jpeg");
  });

  it("should set and return all of the options (custom options)", () => {
    const gm = new Graphics();

    gm.setQuality(100);
    gm.setFormat("jpg");
    gm.setSize(100, 100);
    gm.setDensity(100);
    gm.setSavePath("./test/data");
    gm.setSaveFilename("specimen");
    gm.setCompression("Lossless");
  
    const options = gm.getOptions();

    expect(options).to.haveOwnProperty("quality");
    expect(options.quality).to.be.equal(100);

    expect(options).to.haveOwnProperty("format");
    expect(options.format).to.be.equal("jpg");

    expect(options).to.haveOwnProperty("width");
    expect(options.width).to.be.equal(100);

    expect(options).to.haveOwnProperty("height");
    expect(options.height).to.be.equal(100);
  
    expect(options).to.haveOwnProperty("density");
    expect(options.density).to.be.equal(100);

    expect(options).to.haveOwnProperty("savePath");
    expect(options.savePath).to.be.equal("./test/data");

    expect(options).to.haveOwnProperty("saveFilename");
    expect(options.saveFilename).to.be.equal("specimen");

    expect(options).to.haveOwnProperty("compression");
    expect(options.compression).to.be.equal("Lossless");
  });

  it("should by default use width as height if no height is given", () => {
    const gm = new Graphics();

    gm.setSize(200);
  
    const options = gm.getOptions();

    expect(options).to.haveOwnProperty("width");
    expect(options.width).to.be.equal(200);

    expect(options).to.haveOwnProperty("height");
    expect(options.height).to.be.equal(200);
  });

  it("should save first page as image file", async () => {
    mkdirsSync("./dump/savefiletest");
    const gm = new Graphics();

    gm.setSize(1684, 2384);
    gm.setSavePath(`./dump/savefiletest`);
    const file = createReadStream("./test/data/pdf2.pdf");

    await gm.writeImage(file, 0);

    const snapshot = PNG.sync.read(readFileSync("./test/snapshots/philpostapplicationpage1.png"));
    const actual = PNG.sync.read(readFileSync("./dump/savefiletest/untitled.0.png"));
    const {width, height} = snapshot;
    const diff = new PNG({ width, height });

    const result = pixelmatch(snapshot.data, actual.data, diff.data, width, height, {threshold: 0.1});

    expect(result).to.be.equal(0);
  });

});

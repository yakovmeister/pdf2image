import chai, { expect } from "chai";
import { mkdirsSync, readFileSync, writeFileSync } from "fs-extra";
import gm from "gm";
import rimraf from "rimraf";
import { fromBase64, fromBuffer, fromPath } from "../src/index";
import { Graphics } from "../src/graphics";
import { ToBase64Response, WriteImageResponse } from "../src/types/convertResponse";

describe("PDF2Pic Core", () => {
  const baseOptions = {
    quality: 100,
    format: "jpg",
    width: 768,
    height: 512,
    savePath: "./dump/fromfiletest"
  };

  before(() => {
    rimraf.sync("./dump/fromfiletest");
    rimraf.sync("./dump/frombuffertest");
    rimraf.sync("./dump/frombase64test");

    mkdirsSync("./dump/fromfiletest");
  });

  it("should convert pdf to pic (file input, first page)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-1"
    }

    const convert = fromPath("./test/data/pdf1.pdf", options);

    await convert() as WriteImageResponse;

    const info = await gm.identify("./dump/fromfiletest/test-1.1.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (buffer input, first page)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-1"
    }
    const buffer = readFileSync("./test/data/pdf1.pdf");

    const convert = fromBuffer(buffer, options);

    await convert() as WriteImageResponse;

    const info = await gm.identify("./dump/fromfiletest/test-1.1.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (base64 input, first page)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-1"
    }
    const b64 = readFileSync("./test/data/pdf1.pdf", "base64");

    const convert = fromBase64(b64, options);

    await convert() as WriteImageResponse;

    const info = await gm.identify("./dump/fromfiletest/test-1.1.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (file input, second page, base64 output)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-2"
    }

    const convert = fromPath("./test/data/pdf1.pdf", options);

    const converted = (await convert(2, true) as ToBase64Response);

    writeFileSync("./dump/fromfiletest/frombase64.png", Buffer.from(converted.base64, "base64"));

    const info = await gm.identify("./dump/fromfiletest/frombase64.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (buffer input, second page, base64 output)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-2"
    }

    const buffer = readFileSync("./test/data/pdf1.pdf");

    const convert = fromBuffer(buffer, options);

    const converted = (await convert(2, true) as ToBase64Response);

    writeFileSync("./dump/fromfiletest/frombase64.png", Buffer.from(converted.base64, "base64"));

    const info = await gm.identify("./dump/fromfiletest/frombase64.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (base64 input, second page, base64 output)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-2"
    }

    const b64 = readFileSync("./test/data/pdf1.pdf", "base64");

    const convert = fromBase64(b64, options);

    const converted = (await convert(2, true) as ToBase64Response);

    writeFileSync("./dump/fromfiletest/frombase64.png", Buffer.from(converted.base64, "base64"));

    const info = await gm.identify("./dump/fromfiletest/frombase64.png") as gm.ImageInfo;

    expect(info).to.haveOwnProperty("format");
    expect(info.format).to.be.equal("PNG");
    expect(info).to.haveOwnProperty("size");
    expect(info.size).to.haveOwnProperty("width");
    expect(info.size.width).to.be.equal(768);
    expect(info.size).to.haveOwnProperty("height");
    expect(info.size.height).to.be.equal(512);
  });

  it("should convert pdf to pic (file input, bulk all pages)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      width: 768,
      height: 512,
      saveFilename: "test-3"
    }

    const convert = fromPath("./test/data/pdf1.pdf", options);

    const imageResponse = await convert.bulk(-1);

    expect(imageResponse).lengthOf(9)

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expect(info1).to.haveOwnProperty("format");
    expect(info1.format).to.be.equal("PNG");
    expect(info1).to.haveOwnProperty("size");
    expect(info1.size).to.haveOwnProperty("width");
    expect(info1.size.width).to.be.equal(768);
    expect(info1.size).to.haveOwnProperty("height");
    expect(info1.size.height).to.be.equal(512);

    expect(info2).to.haveOwnProperty("format");
    expect(info2.format).to.be.equal("PNG");
    expect(info2).to.haveOwnProperty("size");
    expect(info2.size).to.haveOwnProperty("width");
    expect(info2.size.width).to.be.equal(768);
    expect(info2.size).to.haveOwnProperty("height");
    expect(info2.size.height).to.be.equal(512);

    expect(info3).to.haveOwnProperty("format");
    expect(info3.format).to.be.equal("PNG");
    expect(info3).to.haveOwnProperty("size");
    expect(info3.size).to.haveOwnProperty("width");
    expect(info3.size.width).to.be.equal(768);
    expect(info3.size).to.haveOwnProperty("height");
    expect(info3.size.height).to.be.equal(512);

    expect(info4).to.haveOwnProperty("format");
    expect(info4.format).to.be.equal("PNG");
    expect(info4).to.haveOwnProperty("size");
    expect(info4.size).to.haveOwnProperty("width");
    expect(info4.size.width).to.be.equal(768);
    expect(info4.size).to.haveOwnProperty("height");
    expect(info4.size.height).to.be.equal(512);

    expect(info5).to.haveOwnProperty("format");
    expect(info5.format).to.be.equal("PNG");
    expect(info5).to.haveOwnProperty("size");
    expect(info5.size).to.haveOwnProperty("width");
    expect(info5.size.width).to.be.equal(768);
    expect(info5.size).to.haveOwnProperty("height");
    expect(info5.size.height).to.be.equal(512);

    expect(info6).to.haveOwnProperty("format");
    expect(info6.format).to.be.equal("PNG");
    expect(info6).to.haveOwnProperty("size");
    expect(info6.size).to.haveOwnProperty("width");
    expect(info6.size.width).to.be.equal(768);
    expect(info6.size).to.haveOwnProperty("height");
    expect(info6.size.height).to.be.equal(512);

    expect(info7).to.haveOwnProperty("format");
    expect(info7.format).to.be.equal("PNG");
    expect(info7).to.haveOwnProperty("size");
    expect(info7.size).to.haveOwnProperty("width");
    expect(info7.size.width).to.be.equal(768);
    expect(info7.size).to.haveOwnProperty("height");
    expect(info7.size.height).to.be.equal(512);

    expect(info8).to.haveOwnProperty("format");
    expect(info8.format).to.be.equal("PNG");
    expect(info8).to.haveOwnProperty("size");
    expect(info8.size).to.haveOwnProperty("width");
    expect(info8.size.width).to.be.equal(768);
    expect(info8.size).to.haveOwnProperty("height");
    expect(info8.size.height).to.be.equal(512);

    expect(info9).to.haveOwnProperty("format");
    expect(info9.format).to.be.equal("PNG");
    expect(info9).to.haveOwnProperty("size");
    expect(info9.size).to.haveOwnProperty("width");
    expect(info9.size.width).to.be.equal(768);
    expect(info9.size).to.haveOwnProperty("height");
    expect(info9.size.height).to.be.equal(512);
  }).timeout(7000);

  it("should convert pdf to pic (buffer input, bulk all pages)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      width: 768,
      height: 512,
      saveFilename: "test-3"
    }

    const buffer = readFileSync("./test/data/pdf1.pdf");

    const convert = fromBuffer(buffer, options);

    const imageResponse = await convert.bulk(-1);

    expect(imageResponse).lengthOf(9)

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expect(info1).to.haveOwnProperty("format");
    expect(info1.format).to.be.equal("PNG");
    expect(info1).to.haveOwnProperty("size");
    expect(info1.size).to.haveOwnProperty("width");
    expect(info1.size.width).to.be.equal(768);
    expect(info1.size).to.haveOwnProperty("height");
    expect(info1.size.height).to.be.equal(512);

    expect(info2).to.haveOwnProperty("format");
    expect(info2.format).to.be.equal("PNG");
    expect(info2).to.haveOwnProperty("size");
    expect(info2.size).to.haveOwnProperty("width");
    expect(info2.size.width).to.be.equal(768);
    expect(info2.size).to.haveOwnProperty("height");
    expect(info2.size.height).to.be.equal(512);

    expect(info3).to.haveOwnProperty("format");
    expect(info3.format).to.be.equal("PNG");
    expect(info3).to.haveOwnProperty("size");
    expect(info3.size).to.haveOwnProperty("width");
    expect(info3.size.width).to.be.equal(768);
    expect(info3.size).to.haveOwnProperty("height");
    expect(info3.size.height).to.be.equal(512);

    expect(info4).to.haveOwnProperty("format");
    expect(info4.format).to.be.equal("PNG");
    expect(info4).to.haveOwnProperty("size");
    expect(info4.size).to.haveOwnProperty("width");
    expect(info4.size.width).to.be.equal(768);
    expect(info4.size).to.haveOwnProperty("height");
    expect(info4.size.height).to.be.equal(512);

    expect(info5).to.haveOwnProperty("format");
    expect(info5.format).to.be.equal("PNG");
    expect(info5).to.haveOwnProperty("size");
    expect(info5.size).to.haveOwnProperty("width");
    expect(info5.size.width).to.be.equal(768);
    expect(info5.size).to.haveOwnProperty("height");
    expect(info5.size.height).to.be.equal(512);

    expect(info6).to.haveOwnProperty("format");
    expect(info6.format).to.be.equal("PNG");
    expect(info6).to.haveOwnProperty("size");
    expect(info6.size).to.haveOwnProperty("width");
    expect(info6.size.width).to.be.equal(768);
    expect(info6.size).to.haveOwnProperty("height");
    expect(info6.size.height).to.be.equal(512);

    expect(info7).to.haveOwnProperty("format");
    expect(info7.format).to.be.equal("PNG");
    expect(info7).to.haveOwnProperty("size");
    expect(info7.size).to.haveOwnProperty("width");
    expect(info7.size.width).to.be.equal(768);
    expect(info7.size).to.haveOwnProperty("height");
    expect(info7.size.height).to.be.equal(512);

    expect(info8).to.haveOwnProperty("format");
    expect(info8.format).to.be.equal("PNG");
    expect(info8).to.haveOwnProperty("size");
    expect(info8.size).to.haveOwnProperty("width");
    expect(info8.size.width).to.be.equal(768);
    expect(info8.size).to.haveOwnProperty("height");
    expect(info8.size.height).to.be.equal(512);

    expect(info9).to.haveOwnProperty("format");
    expect(info9.format).to.be.equal("PNG");
    expect(info9).to.haveOwnProperty("size");
    expect(info9.size).to.haveOwnProperty("width");
    expect(info9.size.width).to.be.equal(768);
    expect(info9.size).to.haveOwnProperty("height");
    expect(info9.size.height).to.be.equal(512);
  }).timeout(7000);

  it("should convert pdf to pic (base64 input, bulk all pages)", async () => {
    const gm = new Graphics();
    const options = {
      ...baseOptions,
      format: "png",
      width: 768,
      height: 512,
      saveFilename: "test-3"
    }

    const b64 = readFileSync("./test/data/pdf1.pdf", "base64");

    const convert = fromBase64(b64, options);

    const imageResponse = await convert.bulk(-1);

    expect(imageResponse).lengthOf(9)

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expect(info1).to.haveOwnProperty("format");
    expect(info1.format).to.be.equal("PNG");
    expect(info1).to.haveOwnProperty("size");
    expect(info1.size).to.haveOwnProperty("width");
    expect(info1.size.width).to.be.equal(768);
    expect(info1.size).to.haveOwnProperty("height");
    expect(info1.size.height).to.be.equal(512);

    expect(info2).to.haveOwnProperty("format");
    expect(info2.format).to.be.equal("PNG");
    expect(info2).to.haveOwnProperty("size");
    expect(info2.size).to.haveOwnProperty("width");
    expect(info2.size.width).to.be.equal(768);
    expect(info2.size).to.haveOwnProperty("height");
    expect(info2.size.height).to.be.equal(512);

    expect(info3).to.haveOwnProperty("format");
    expect(info3.format).to.be.equal("PNG");
    expect(info3).to.haveOwnProperty("size");
    expect(info3.size).to.haveOwnProperty("width");
    expect(info3.size.width).to.be.equal(768);
    expect(info3.size).to.haveOwnProperty("height");
    expect(info3.size.height).to.be.equal(512);

    expect(info4).to.haveOwnProperty("format");
    expect(info4.format).to.be.equal("PNG");
    expect(info4).to.haveOwnProperty("size");
    expect(info4.size).to.haveOwnProperty("width");
    expect(info4.size.width).to.be.equal(768);
    expect(info4.size).to.haveOwnProperty("height");
    expect(info4.size.height).to.be.equal(512);

    expect(info5).to.haveOwnProperty("format");
    expect(info5.format).to.be.equal("PNG");
    expect(info5).to.haveOwnProperty("size");
    expect(info5.size).to.haveOwnProperty("width");
    expect(info5.size.width).to.be.equal(768);
    expect(info5.size).to.haveOwnProperty("height");
    expect(info5.size.height).to.be.equal(512);

    expect(info6).to.haveOwnProperty("format");
    expect(info6.format).to.be.equal("PNG");
    expect(info6).to.haveOwnProperty("size");
    expect(info6.size).to.haveOwnProperty("width");
    expect(info6.size.width).to.be.equal(768);
    expect(info6.size).to.haveOwnProperty("height");
    expect(info6.size.height).to.be.equal(512);

    expect(info7).to.haveOwnProperty("format");
    expect(info7.format).to.be.equal("PNG");
    expect(info7).to.haveOwnProperty("size");
    expect(info7.size).to.haveOwnProperty("width");
    expect(info7.size.width).to.be.equal(768);
    expect(info7.size).to.haveOwnProperty("height");
    expect(info7.size.height).to.be.equal(512);

    expect(info8).to.haveOwnProperty("format");
    expect(info8.format).to.be.equal("PNG");
    expect(info8).to.haveOwnProperty("size");
    expect(info8.size).to.haveOwnProperty("width");
    expect(info8.size.width).to.be.equal(768);
    expect(info8.size).to.haveOwnProperty("height");
    expect(info8.size.height).to.be.equal(512);

    expect(info9).to.haveOwnProperty("format");
    expect(info9.format).to.be.equal("PNG");
    expect(info9).to.haveOwnProperty("size");
    expect(info9.size).to.haveOwnProperty("width");
    expect(info9.size.width).to.be.equal(768);
    expect(info9.size).to.haveOwnProperty("height");
    expect(info9.size.height).to.be.equal(512);
  }).timeout(7000);
});

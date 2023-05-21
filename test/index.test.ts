import chai, { expect } from "chai";
import { mkdirsSync, readFileSync, writeFileSync } from "fs-extra";
import gm from "gm";
import rimraf from "rimraf";
import { fromBase64, fromBuffer, fromPath } from "../src/index";
import { Graphics } from "../src/graphics";
import { ToBase64Response, WriteImageResponse } from "../src/types/convertResponse";
import { Options } from "../src/types/options";

describe("PDF2Pic Core", () => {
  const baseOptions = {
    quality: 100,
    format: "jpg",
    width: 768,
    height: 512,
    savePath: "./dump/fromfiletest"
  };

  const expectInfoToBeValid = (info: gm.ImageInfo, options) => {
    expect(info).to.haveOwnProperty('format');
    expect(info.format).to.be.equal(options.format.toUpperCase());
    expect(info).to.haveOwnProperty('size');
    expect(info.size).to.haveOwnProperty('width');
    expect(info.size.width).to.be.equal(options.width);
    expect(info.size).to.haveOwnProperty('height');
    expect(info.size.height).to.be.equal(options.height);
  }

  const expectImageResponseToBeValid = (response: WriteImageResponse, options: Options) => {
    expect(response).to.haveOwnProperty('name');
    expect(response.name).to.be.a('string');
    expect(response).to.haveOwnProperty('size');
    expect(response.size).to.be.a('string');
    expect(response).to.haveOwnProperty('fileSize');
    expect(response.fileSize).to.be.a('number');
    expect(response).to.haveOwnProperty('path');
    expect(response.path).to.equal(`${options.savePath}/${response.name}`);
    expect(response).to.haveOwnProperty('page');
    expect(response.page).to.be.a('number');
  }

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

    expectInfoToBeValid(info, options)
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

    expectInfoToBeValid(info, options)
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

    expectInfoToBeValid(info, options)
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

    expectInfoToBeValid(info, options)
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

    expectInfoToBeValid(info, options)
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

    expectInfoToBeValid(info, options)
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

    expect(imageResponse).to.be.an('array').that.has.lengthOf(9)
    imageResponse.forEach(imageResponse => expectImageResponseToBeValid(imageResponse, options))

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expectInfoToBeValid(info1, options)
    expectInfoToBeValid(info2, options)
    expectInfoToBeValid(info3, options)
    expectInfoToBeValid(info4, options)
    expectInfoToBeValid(info5, options)
    expectInfoToBeValid(info6, options)
    expectInfoToBeValid(info7, options)
    expectInfoToBeValid(info8, options)
    expectInfoToBeValid(info9, options)
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

    expect(imageResponse).to.be.an('array').that.has.lengthOf(9)
    imageResponse.forEach(imageResponse => expectImageResponseToBeValid(imageResponse, options))

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expectInfoToBeValid(info1, options)
    expectInfoToBeValid(info2, options)
    expectInfoToBeValid(info3, options)
    expectInfoToBeValid(info4, options)
    expectInfoToBeValid(info5, options)
    expectInfoToBeValid(info6, options)
    expectInfoToBeValid(info7, options)
    expectInfoToBeValid(info8, options)
    expectInfoToBeValid(info9, options)
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

    expect(imageResponse).to.be.an('array').that.has.lengthOf(9)
    imageResponse.forEach(imageResponse => expectImageResponseToBeValid(imageResponse, options))

    const info1 = await gm.identify("./dump/fromfiletest/test-3.1.png") as gm.ImageInfo;
    const info2 = await gm.identify("./dump/fromfiletest/test-3.2.png") as gm.ImageInfo;
    const info3 = await gm.identify("./dump/fromfiletest/test-3.3.png") as gm.ImageInfo;
    const info4 = await gm.identify("./dump/fromfiletest/test-3.4.png") as gm.ImageInfo;
    const info5 = await gm.identify("./dump/fromfiletest/test-3.5.png") as gm.ImageInfo;
    const info6 = await gm.identify("./dump/fromfiletest/test-3.6.png") as gm.ImageInfo;
    const info7 = await gm.identify("./dump/fromfiletest/test-3.7.png") as gm.ImageInfo;
    const info8 = await gm.identify("./dump/fromfiletest/test-3.8.png") as gm.ImageInfo;
    const info9 = await gm.identify("./dump/fromfiletest/test-3.9.png") as gm.ImageInfo;

    expectInfoToBeValid(info1, options)
    expectInfoToBeValid(info2, options)
    expectInfoToBeValid(info3, options)
    expectInfoToBeValid(info4, options)
    expectInfoToBeValid(info5, options)
    expectInfoToBeValid(info6, options)
    expectInfoToBeValid(info7, options)
    expectInfoToBeValid(info8, options)
    expectInfoToBeValid(info9, options)
  }).timeout(7000);
});

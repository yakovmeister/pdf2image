import chai, { expect } from "chai";
import { mkdirsSync, readFileSync, createReadStream, writeFileSync } from "fs-extra";
import { fromPath } from "../src/index";
import { WriteImageResponse } from "../src/types/writeImageResponse";
import { ToBase64Response } from "../src/types/toBase64Response";
import rimraf from "rimraf";
import { looksSame } from "./utils/looksSame";
import { Graphics } from "../src/graphics";
import gm from "gm";

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

  it("should convert pdf to pic (file input, bulk all pages)", async () => {
    const options = {
      ...baseOptions,
      format: "png",
      width: 768,
      height: 512,
      saveFilename: "test-3"
    }

    const convert = fromPath("./test/data/pdf1.pdf", options);

    await convert.bulk(-1);
  });
});

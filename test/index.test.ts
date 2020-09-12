import chai, { expect } from "chai";
import { mkdirsSync, readFileSync, createReadStream, writeFileSync } from "fs-extra";
import { fromPath } from "../src/index";
import { WriteImageResponse } from "../src/types/writeImageResponse";
import { ToBase64Response } from "../src/types/toBase64Response";
import rimraf from "rimraf";
import { looksSame } from "./utils/looksSame";
import gm from "gm";

describe("PDF2Pic Core", () => {
  const baseOptions = {
    quality: 100,
    format: "jpg",
    width: 1684,
    height: 2384,
    savePath: "./dump/fromfiletest"
  };

  before(() => {
    rimraf.sync("./dump/fromfiletest");
    rimraf.sync("./dump/frombuffertest");
    rimraf.sync("./dump/frombase64test");

    mkdirsSync("./dump/fromfiletest");
  });

  it("should convert pdf to pic (file input, first page)", async () => {
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-1"
    }

    const convert = fromPath("./test/data/pdf2.pdf", options);

    const converted = (await convert() as WriteImageResponse);
    const imageResult = await looksSame("./dump/fromfiletest/test-1.1.png", "./test/snapshots/philpostapplicationpage1.png");

    expect(converted).to.haveOwnProperty("path");
    expect(converted).to.haveOwnProperty("name");
    expect(converted.name).to.be.equal("test-1.1.png");
    expect(converted.path).to.be.equal("./dump/fromfiletest/test-1.1.png");
    expect(imageResult.equal).to.be.true;
  });

  it("should convert pdf to pic (file input, second page, base64 output)", async () => {
    const options = {
      ...baseOptions,
      format: "png",
      saveFilename: "test-2"
    }

    const convert = fromPath("./test/data/pdf2.pdf", options);

    const converted = (await convert(2, true) as ToBase64Response);

    writeFileSync("./dump/fromfiletest/frombase64.png", Buffer.from(converted.base64, "base64"));

    const imageResult = await looksSame("./dump/fromfiletest/frombase64.png", "./test/snapshots/philpostapplicationpage2.png");

    expect(imageResult.equal).to.be.true;
  });
});
import { Graphics } from "@module/graphics";
import { createReadStream, ReadStream } from "fs-extra";
import { ConvertFromPath } from "@module/types/convertFromPath";
import { GetOptionResponse } from "@module/types/getOptionResponse";
import { Readable } from "stream";

const defaultOptions: GetOptionResponse = {
  quality: 0,
  format: "png",
  width: 768,
  height: 512,
  density: 72,
  savePath: "./",
  saveFilename: "untitled",
  compression: "jpeg"
};

function combine<T>(obj1: T, obj2: T): T {
  return {
    ...obj1,
    ...obj2
  };
}

function bufferToStream(buffer: Buffer): ReadStream {
  const readableInstanceStream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });

  return readableInstanceStream as ReadStream;
}

function convertToStream(source: string, file: string | Buffer): ReadStream {
  if (source === "buffer") {
    return  bufferToStream(file as Buffer);
  }

  if (source === "path") {
    return  createReadStream(source as string);
  }

  throw new Error("Cannot recognize specified source");
}

function setGMOptions(gm: Graphics, options: GetOptionResponse): void {
  gm.setQuality(options.quality)
  .setFormat(options.format)
  .setSize(options.width, options.height)
  .setDensity(options.density)
  .setSavePath(options.savePath)
  .setSaveFilename(options.saveFilename)
  .setCompression(options.compression)

  return;
}

function convert(source: string, filePath: string | Buffer, options = defaultOptions) {
  const gm = new Graphics();

  options = combine(defaultOptions, options);

  const convert = (page = 1, toBase64 = false) => {
    if (page < 1) {
      throw new Error("Page number should be more than or equal 1");
    }

    const stream = convertToStream(source, filePath);

    if (!!toBase64) {
      return gm.toBase64(stream, (page - 1));
    }

    return gm.writeImage(stream, (page - 1));
  };

  convert.setOptions = (): void => setGMOptions(gm, options);

  convert.setGMClass = (gmClass: string | boolean): void => {
    gm.setGMClass(gmClass);

    return;
  };

  convert.setOptions();

  return convert;
}

export function fromPath(filePath: string, options = defaultOptions): ConvertFromPath {
  return convert("path", filePath, options);
}

export function fromBuffer(buffer: Buffer, options = defaultOptions): ConvertFromPath {
  return convert("buffer", buffer, options);
}

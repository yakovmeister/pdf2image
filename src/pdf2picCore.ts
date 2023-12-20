import fs from 'fs';
import { Graphics } from './graphics';
import type { Convert, ConvertOptions } from './types/convert';
import type { ConvertResponse } from './types/convertResponse';
import type { Options } from './types/options';
import { bufferToStream } from './utils/converters/bufferToStream';
import { convertToBuffer } from './utils/converters/convertToBuffer';
import { convertToStream } from './utils/converters/convertToStream';
import { defaultOptions } from './utils/defaultOptions';
import { getPages } from './utils/getPages';
import { resolveResponseType } from './utils/resolveResponseType';

export function pdf2picCore(source: string, data: string | Buffer, options = defaultOptions): Convert {
  const gm = new Graphics();

  options = { ...defaultOptions, ...options };

  const _convert = (stream: fs.ReadStream, page: number, convertOptions: ConvertOptions): Promise<ConvertResponse> => {
    if (page < 1) {
      throw new Error('Page number should be more than or equal 1');
    }

    const responseType = resolveResponseType(convertOptions);
    switch (responseType) {
      case 'base64':
        return gm.toBase64(stream, page - 1);
      case 'image':
        return gm.writeImage(stream, page - 1);
      case 'buffer':
        return gm.toBuffer(stream, page - 1);
      default:
        throw new Error(`Invalid responseType: ${responseType}`);
    }
  };

  const _bulk = (stream, pages, convertOptions) => {
    return Promise.all(pages.map((page) => _convert(stream, page, convertOptions)));
  };

  const convert = (page = 1, convertOptions) => {
    const stream = convertToStream(source, data);
    return _convert(stream, page, convertOptions);
  };

  convert.bulk = async (pages, convertOptions) => {
    const buffer = await convertToBuffer(source, data);
    const pagesToConvert =
      pages === -1 ? await getPages(gm, bufferToStream(buffer)) : Array.isArray(pages) ? pages : [pages];

    const results = [];
    const batchSize = 10;
    for (let i = 0; i < pagesToConvert.length; i += batchSize) {
      results.push(...(await _bulk(bufferToStream(buffer), pagesToConvert.slice(i, i + batchSize), convertOptions)));
    }

    return results;
  };

  convert.setOptions = (): void => setGMOptions(gm, options);

  convert.setGMClass = (gmClass: string | boolean): void => {
    gm.setGMClass(gmClass);

    return;
  };

  convert.setOptions();

  return convert;
}

function setGMOptions(gm: Graphics, options: Options): void {
  gm.setQuality(options.quality)
    .setFormat(options.format)
    .setPreserveAspectRatio(options.preserveAspectRatio)
    .setSize(options.width, options.height)
    .setDensity(options.density)
    .setSavePath(options.savePath)
    .setSaveFilename(options.saveFilename)
    .setCompression(options.compression);

  return;
}

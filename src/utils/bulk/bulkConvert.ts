import { Graphics } from "../../graphics";
import { getPages } from "./getPages";
import { convertToStream } from "../converters/convertToStream";
import { WriteImageResponse } from "../../types/writeImageResponse";
import { ToBase64Response } from "../../types/toBase64Response";

function convert(gm: Graphics, source: string, filePath: string | Buffer, pageNumber: number[], toBase64 = false): Promise<WriteImageResponse[] | ToBase64Response[]> {
  const stream = convertToStream(source, filePath);
  const pages: (Promise<WriteImageResponse> | Promise<ToBase64Response>)[] = pageNumber.map(page => {
    if (page < 1) {
      throw new Error("Page number should be more than or equal 1");
    }

    if (!!toBase64) {
      return gm.toBase64(stream, (page - 1));
    }

    return gm.writeImage(stream, (page - 1));
  });

  return Promise.all(pages);
}

export async function bulkConvert(gm: Graphics, source: string, filePath: string | Buffer, pageNumber: number | number[] = 1, toBase64 = false): Promise<WriteImageResponse[] | ToBase64Response[]> {
  const pagesToConvert = pageNumber === -1
    ? await getPages(gm, convertToStream(source, filePath))
    : Array.isArray(pageNumber) ? pageNumber : [pageNumber];

  const results = []
  const batchSize = 10
  for (let i = 0; i < pagesToConvert.length; i += batchSize) {
    results.push(...await convert(gm, source, filePath, pagesToConvert.slice(i, i + batchSize), toBase64))
  }

  return results
}

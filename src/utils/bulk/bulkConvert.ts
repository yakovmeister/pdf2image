import { Graphics } from "@module/graphics";
import { getPages } from "@module/utils/bulk/getPages";
import { convertToStream } from "@module/utils/converters/convertToStream";
import { WriteImageResponse } from "@module/types/writeImageResponse";
import { ToBase64Response } from "@module/types/toBase64Response";

export async function bulkConvert(gm: Graphics, source: string, filePath: string | Buffer, pageNumber: number | number[] = 1, toBase64 = false):  Promise<(Promise<WriteImageResponse> | Promise<ToBase64Response>)[]> {
  if (pageNumber !== -1 && pageNumber < 1) {
    throw new Error("Page number should be more than or equal 1");
  }

  const stream = convertToStream(source, filePath);

  if (pageNumber === -1) {
    pageNumber = await getPages(gm, stream);
  } else if (!Array.isArray(pageNumber)) {
    pageNumber = [pageNumber];
  }

  const pages: (Promise<WriteImageResponse> | Promise<ToBase64Response>)[] = pageNumber.map(page => {
    if (!!toBase64) {
      return gm.toBase64(stream, (page - 1));
    }

    return gm.writeImage(stream, (page - 1));
  });

  return pages; 
}

// Type definitions for pdf2pic
// Project: https://github.com/yakovmeister/pdf2image
// Definitions by:  Jihoon Lee <https://github.com/NoMoreViolence>
// TypeScript Version: 3.7.5

declare module "pdf2pic" {
  interface Pdf2picConstructor {
    /**
     * output pixels per inch  */
    density: number;
    /**
     * output file name
     */
    savename: string;
    /**
     * output file location
     */
    savedir: string;
    /**
     * output file format
     */
    format: "png" | "jpg" | "jpeg";
    /**
     * output size in pixels
     * example 768x512
     */
    size: string;
  }
  export interface ConvertResult {
    /**
     * file name
     */
    name: string;
    /**
     * file size
     */
    size: number;
    /**
     * file path
     */
    path: string;
    page: number;
  }
  export interface ConvertBase64Result {
    /**
     * image uri
     */
    base64: string;
    page: number;
  }

  class Pdf2pic {
    constructor(option?: Pdf2picConstructor);

    /**
     *
     * @param pdfPath path to file
     * @param page specific page to convert
     */
    public convert(pdfPath: string, page?: number): Promise<ConvertResult>;
    /**
     *
     * @param pdfPath path to file
     * @param page page number to be converted (-1 for all pages)
     */
    public convertBulk(
      pdfPath: string,
      page?: number | number[]
    ): Promise<ConvertResult[]>;
    /**
     *
     * @param pdfPath path to file
     * @param page specific page to convert
     */
    public convertToBase64(
      pdfPath: string,
      page?: number
    ): Promise<ConvertBase64Result>;
    /**
     *
     * @param pdfPath path to file
     * @param page page number to be converted (-1 for all pages)
     */
    public convertToBase64Bulk(
      pdfPath: string,
      page?: number
    ): Promise<ConvertBase64Result[]>;
  }

  export default Pdf2pic;
}

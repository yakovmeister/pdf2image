import { Graphics } from "../../graphics";
import { ReadStream } from "fs-extra";

export async function getPages(gm: Graphics, pdf_path: ReadStream): Promise<number[]> {
  const page = (await gm.identify(pdf_path, "%p ") as string)

  return page.split(" ").map((pageNumber) => parseInt(pageNumber, 10));
}

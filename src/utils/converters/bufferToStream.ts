import { ReadStream } from "fs";
import { Readable } from "stream";

export function bufferToStream(buffer: Buffer): ReadStream {
  return Readable.from(buffer) as ReadStream;
}


import { ReadStream } from "fs-extra";
import { Readable } from "stream";

export function bufferToStream(buffer: Buffer): ReadStream {
  const readableInstanceStream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    }
  });

  return readableInstanceStream as ReadStream;
}

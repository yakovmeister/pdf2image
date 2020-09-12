
import { ReadStream } from "fs-extra";
import { bufferToStream } from "@module/utils/converters/bufferToStream";

export function base64ToStream(base64: string): ReadStream {
  const buffer = Buffer.from(base64, "base64");

  return bufferToStream(buffer);
}

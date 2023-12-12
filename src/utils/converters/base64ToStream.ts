import { ReadStream } from 'fs';
import { bufferToStream } from '../../utils/converters/bufferToStream';

export function base64ToStream(base64: string): ReadStream {
  const buffer = Buffer.from(base64, 'base64');

  return bufferToStream(buffer);
}

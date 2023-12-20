import { createReadStream, ReadStream } from 'fs';
import { base64ToStream } from '../../utils/converters/base64ToStream';
import { bufferToStream } from '../../utils/converters/bufferToStream';

export function convertToStream(source: string, file: string | Buffer): ReadStream {
  if (source === 'buffer') {
    return bufferToStream(file as Buffer);
  }

  if (source === 'path') {
    return createReadStream(file as string);
  }

  if (source === 'base64') {
    return base64ToStream(file as string);
  }

  throw new Error('Cannot recognize specified source');
}

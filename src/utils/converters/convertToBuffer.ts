import { promises as fs } from 'fs';

export async function convertToBuffer(source: string, data: string | Buffer): Promise<Buffer> {
  if (source === 'buffer') {
    return data as Buffer;
  }

  if (source === 'path') {
    return await fs.readFile(data as string);
  }

  if (source === 'base64') {
    return Buffer.from(data as string, 'base64');
  }

  throw new Error('Cannot recognize specified source');
}

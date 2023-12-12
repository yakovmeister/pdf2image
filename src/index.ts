import { Convert } from './types/convert';
import { defaultOptions } from './utils/defaultOptions';
import { pdf2picCore } from './pdf2picCore';

export function fromPath(filePath: string, options = defaultOptions): Convert {
  return pdf2picCore('path', filePath, options);
}

export function fromBuffer(buffer: Buffer, options = defaultOptions): Convert {
  return pdf2picCore('buffer', buffer, options);
}

export function fromBase64(b64string: string, options = defaultOptions): Convert {
  return pdf2picCore('base64', b64string, options);
}

import type { ConvertResponse } from './convertResponse';

export type ResponseType = 'image' | 'base64'

export type ConvertOptions = boolean | {
  responseType: ResponseType
}

export type Convert = {
  bulk?: (pages?: number | number[], options?: ConvertOptions) => Promise<ConvertResponse[]>;

  setOptions?: () => void;

  setGMClass?: (gmClass: string | boolean) => void;

  (page?: number, options?: ConvertOptions): Promise<ConvertResponse>;
}

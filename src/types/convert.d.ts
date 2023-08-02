import type { BufferResponse, ToBase64Response, WriteImageResponse } from './convertResponse';

export type ResponseType = 'image' | 'base64' | 'buffer'
export type ConvertOptions = boolean | {
  responseType: ResponseType
}

export type Convert = {
  (pages?: number, options?: undefined): Promise<WriteImageResponse>;
  (pages: number, options: false | { responseType?: undefined }): Promise<WriteImageResponse>;
  (pages: number, options: true | { responseType: 'base64' }): Promise<ToBase64Response>;
  (pages: number, options: { responseType: 'image' }): Promise<WriteImageResponse>;
  (pages: number, options: { responseType: 'buffer' }): Promise<BufferResponse>;

  bulk: {
    (pages?: number | number[], options?: undefined): Promise<WriteImageResponse[]>;
    (pages: number | number[], options: false | { responseType?: undefined }): Promise<WriteImageResponse[]>;
    (pages: number | number[], options: true | { responseType: 'base64' }): Promise<ToBase64Response[]>;
    (pages: number | number[], options: { responseType: 'image' }): Promise<WriteImageResponse[]>;
    (pages: number | number[], options: { responseType: 'buffer' }): Promise<BufferResponse[]>;
  };

  setOptions: () => void;

  setGMClass: (gmClass: string | boolean) => void;
}

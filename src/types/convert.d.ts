import type { WriteImageResponse } from './convertResponse';
import { ToBase64Response } from './convertResponse';

export type ResponseType = 'image' | 'base64'
export type ConvertOptions = boolean | {
  responseType: 'image' | 'base64'
  otherOpt: string
}

export type Convert = {
  (pages?: number, options?: undefined): Promise<WriteImageResponse>;
  (pages: number, options: false | { responseType?: undefined }): Promise<WriteImageResponse>;
  (pages: number, options: true | { responseType: 'base64' }): Promise<ToBase64Response>;
  (pages: number, options: { responseType: 'image' }): Promise<WriteImageResponse>;

  bulk: {
    (pages?: number | number[], options?: undefined): Promise<WriteImageResponse[]>;
    (pages: number | number[], options: false | { responseType?: undefined }): Promise<WriteImageResponse[]>;
    (pages: number | number[], options: true | { responseType: 'base64' }): Promise<ToBase64Response[]>;
    (pages: number | number[], options: { responseType: 'image' }): Promise<WriteImageResponse[]>;
  };

  setOptions: () => void;

  setGMClass: (gmClass: string | boolean) => void;
}

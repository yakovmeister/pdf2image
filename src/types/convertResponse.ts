export interface BaseResponse {
  size?: string;
  page?: number;
}

export interface WriteImageResponse extends BaseResponse {
  name?: string;
  fileSize?: number;
  path?: string;
}

export interface ToBase64Response extends BaseResponse {
  base64?: string;
}

export interface BufferResponse extends BaseResponse {
  buffer?: Buffer;
}

export type ConvertResponse = WriteImageResponse | ToBase64Response | BufferResponse;

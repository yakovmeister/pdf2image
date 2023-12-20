import { ConvertOptions, ResponseType } from '@module/types/convert';

export const resolveResponseType = (convertOptions?: ConvertOptions): ResponseType => {
  if (convertOptions && typeof convertOptions !== 'object') {
    throw new Error(`Invalid convertOptions type: ${convertOptions}`);
  }
  return convertOptions?.responseType ?? 'image';
};

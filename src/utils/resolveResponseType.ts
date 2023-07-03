import { ConvertOptions, ResponseType } from '@module/types/convert';

export const resolveResponseType = (convertOptions?: ConvertOptions): ResponseType => {
  if (convertOptions === undefined || typeof convertOptions === 'boolean') {
    return convertOptions ? 'base64' : 'image'
  }
  if (typeof convertOptions !== 'object') {
    throw new Error(`Invalid convertOptions type: ${convertOptions}`)
  }
  return convertOptions.responseType ?? 'image'
}

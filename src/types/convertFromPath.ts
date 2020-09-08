import { WriteImageResponse } from "@module/types/writeImageResponse";

export type ConvertFromPath = {

  setOptions?: () => void;

  setGMClass?: (gmClass: string | boolean) => void;

  (page: number): Promise<WriteImageResponse>;
}

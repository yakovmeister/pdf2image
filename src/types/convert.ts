import { WriteImageResponse } from "@module/types/writeImageResponse";
import { ToBase64Response } from "@module/types/toBase64Response";

export type Convert = {

  bulk?: (pages?: number | number[], toBase64?: boolean) => Promise<(Promise<WriteImageResponse> | Promise<ToBase64Response>)[]>;

  setOptions?: () => void;

  setGMClass?: (gmClass: string | boolean) => void;

  (page?: number, toBase64?: boolean): Promise<WriteImageResponse|ToBase64Response>;
}

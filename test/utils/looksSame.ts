import same from "looks-same";

/**
 * The result obtained from the function.
*/
interface LooksSameResult {
  /**
   * true if images are equal, false - otherwise
   */
  equal?: boolean;
  /**
   * diff bounds for not equal images
   */
  diffBounds?: any;
  /**
   * diff clusters for not equal images
   */
  diffClusters?: any[];
}

export function looksSame(image1: string | Buffer, image2: string | Buffer): Promise<LooksSameResult> {
  return new Promise((resolve, reject) => {
    same(image1, image2, (error, result) => {
      if (error) {
        return reject(error);
      }

      return resolve(result);
    });
  });
}

import gm from 'gm';
import path from 'path';
import fs from 'fs';
import { BufferResponse, ToBase64Response, WriteImageResponse } from './types/convertResponse';
import { Options } from './types/options';

export class Graphics {
  private quality = 0;

  private format = 'png';

  private width = 768;

  private height = 512;

  private preserveAspectRatio = false;

  private density = 72;

  private savePath = './';

  private saveFilename = 'untitled';

  private compression = 'jpeg';

  private gm: gm.SubClass = gm.subClass({ imageMagick: false });

  public generateValidFilename(page?: number): string {
    let filePath = path.join(this.savePath, this.saveFilename);
    if (this.savePath.startsWith('./')) {
      filePath = `./${filePath}`;
    }

    if (typeof page === 'number') {
      filePath = `${filePath}.${page + 1}`;
    }

    return `${filePath}.${this.format}`;
  }

  public gmBaseCommand(stream: fs.ReadStream, filename: string): gm.State {
    return this.gm(stream, filename)
      .density(this.density, this.density)
      .resize(this.width, this.height, this.preserveAspectRatio ? '^' : '!')
      .quality(this.quality)
      .compress(this.compression);
  }

  public async toBase64(stream: fs.ReadStream, page?: number): Promise<ToBase64Response> {
    const { buffer, size, page: pageResponse } = await this.toBuffer(stream, page);

    return { base64: buffer.toString('base64'), size, page: pageResponse };
  }

  public toBuffer(stream: fs.ReadStream, page?: number): Promise<BufferResponse> {
    const pageSetup = `${stream.path}[${page}]`;

    return new Promise((resolve, reject) => {
      this.gmBaseCommand(stream, pageSetup).stream(this.format, (error, stdout) => {
        const buffers = [];

        if (error) {
          return reject(error);
        }

        stdout
          .on('data', (data) => {
            buffers.push(data);
          })
          .on('end', () => {
            return resolve({
              buffer: Buffer.concat(buffers),
              size: `${this.width}x${this.height}`,
              page: page + 1,
            });
          });
      });
    });
  }

  public writeImage(stream: fs.ReadStream, page?: number): Promise<WriteImageResponse> {
    const output = this.generateValidFilename(page);
    const pageSetup = `${stream.path}[${page}]`;

    return new Promise((resolve, reject) => {
      this.gmBaseCommand(stream, pageSetup).write(output, (error) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          name: path.basename(output),
          size: `${this.width}x${this.height}`,
          fileSize: fs.statSync(output).size / 1000.0,
          path: output,
          page: page + 1,
        });
      });
    });
  }

  public identify(filepath: string | fs.ReadStream, argument?: string): Promise<gm.ImageInfo | string> {
    const image = this.gm(filepath as string);

    return new Promise((resolve, reject) => {
      if (argument) {
        image.identify(argument, (error, data) => {
          if (error) {
            return reject(error);
          }

          return resolve(data.replace(/^[\w\W]*?1/, '1'));
        });
      } else {
        image.identify((error, data) => {
          if (error) {
            return reject(error);
          }

          return resolve(data);
        });
      }
    });
  }

  public setQuality(quality: number): Graphics {
    this.quality = quality;

    return this;
  }

  public setFormat(format: string): Graphics {
    this.format = format;

    return this;
  }

  public setSize(width: number, height?: number): Graphics {
    this.width = width;
    this.height = this.preserveAspectRatio || !!height ? height : width;

    return this;
  }

  public setPreserveAspectRatio(preserveAspectRatio: boolean): Graphics {
    this.preserveAspectRatio = preserveAspectRatio;

    return this;
  }

  public setDensity(density: number): Graphics {
    this.density = density;

    return this;
  }

  public setSavePath(savePath: string): Graphics {
    this.savePath = savePath;

    return this;
  }

  public setSaveFilename(filename: string): Graphics {
    this.saveFilename = filename;

    return this;
  }

  public setCompression(compression: string): Graphics {
    this.compression = compression;

    return this;
  }

  public setGMClass(gmClass: string | boolean): Graphics {
    if (typeof gmClass === 'boolean') {
      this.gm = gm.subClass({ imageMagick: gmClass });

      return this;
    }

    if (gmClass.toLocaleLowerCase() === 'imagemagick') {
      this.gm = gm.subClass({ imageMagick: true });

      return this;
    }

    this.gm = gm.subClass({ appPath: gmClass });

    return this;
  }

  public getOptions(): Options {
    return {
      quality: this.quality,
      format: this.format,
      width: this.width,
      height: this.height,
      preserveAspectRatio: this.preserveAspectRatio,
      density: this.density,
      savePath: this.savePath,
      saveFilename: this.saveFilename,
      compression: this.compression,
    };
  }
}

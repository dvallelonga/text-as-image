import Jimp from "jimp";
export interface ImageDimensions {
  width: number;
  height: number;
}

export interface RGBA {
  r: number; // red channel
  g: number; // green channel
  b: number; // blue channel
  a: number; // alpha channel
}

export class Image {
  private buffer: Buffer;
  constructor(imageBuffer: Buffer){
    this.buffer = imageBuffer;
  }

  public async getDimensions(): Promise<ImageDimensions> {
    return Jimp.read(this.buffer)
    .then(image => {
      const imageDimensions: ImageDimensions = {
        width: image.bitmap.width,
        height: image.bitmap.height
      };
  
      return imageDimensions;
    })
    .catch(err => {
      // Handle an exception.
      throw err;
    });
  }

  public async getPixelColorAtCoordinate(xCoord: number, yCoord: number): Promise<RGBA> {

    return Jimp.read(this.buffer)
    .then(image => {
  
      const rgba: RGBA = Jimp.intToRGBA(image.getPixelColor(xCoord, yCoord));
  
      return rgba;
    })
    .catch(err => {
      // Handle an exception.
      throw err;
    });
  
  }
  
}

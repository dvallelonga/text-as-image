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
export async function getImageDimensions(imageBuffer: Buffer): Promise<ImageDimensions> {
  return Jimp.read(imageBuffer)
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

export async function getPixelColorAtImageCoordinate(imageBuffer: Buffer, xCoord: number, yCoord: number): Promise<RGBA> {

  return Jimp.read(imageBuffer)
  .then(image => {

    let rgba: RGBA = Jimp.intToRGBA(image.getPixelColor(xCoord, yCoord));

    return rgba;
  })
  .catch(err => {
    // Handle an exception.
    throw err;
  });

}

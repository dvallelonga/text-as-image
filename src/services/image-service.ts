import Jimp from 'jimp';

export interface ImageDimensions {
  width: number;
  height: number;
}

export function getImageDimensions(imageBuffer: Buffer): Promise<ImageDimensions> {
  return Jimp.read(imageBuffer)
  .then(image => {
    let imageDimensions: ImageDimensions = {
      width: image.bitmap.width,
      height: image.bitmap.height
    }

    return imageDimensions;
  })
  .catch(err => {
    // Handle an exception.
    throw err;
  });
}

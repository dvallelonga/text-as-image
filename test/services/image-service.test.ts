import {
  getImageDimensions,
  ImageDimensions
} from '../../src/services/image-service';
import fs from 'fs';


describe("Parsing of Upload Image", () => {
  it("should get images dimensions from image buffer", async () => {
    let expectedImageDimensions: ImageDimensions = {
      width: 800,
      height: 800
    };

    let image: Buffer = fs.readFileSync('test/fixtures/source-image.png');

    let imageDimensions: ImageDimensions = await getImageDimensions(image);
    expect(imageDimensions).toEqual(expectedImageDimensions);
  });
});


import {
  getImageDimensions,
  ImageDimensions,
  getPixelColorAtImageCoordinate,
  RGBA
} from "../../src/services/image-service";
import fs from "fs";


describe("Parsing of Upload Image", () => {
  describe("getImageDimensions()", () => {
    it("should get images dimensions from image buffer", async () => {
      const SOURCE_IMAGE_PATH = "test/fixtures/images/source-image.png";
      const expectedImageDimensions: ImageDimensions = {
        width: 800,
        height: 800
      };

      const image: Buffer = fs.readFileSync(SOURCE_IMAGE_PATH);

      const imageDimensions: ImageDimensions = await getImageDimensions(image);
      expect(imageDimensions).toEqual(expectedImageDimensions);
    });
  });
});

describe("Inspecting Image", () => {
  describe("getPixelColorAtImageCoordinate()", () => {
    it("should get the pixel color at the given image coordinate", async () => {
      const SOURCE_IMAGE_PATH = "test/fixtures/images/rgba-sample.png";

      const image: Buffer = fs.readFileSync(SOURCE_IMAGE_PATH);

      let coordsConfig = [
        // red
        {
          coord: { x: 0, y: 256 },
          expectedRGBA: { r: 255, g: 0, b: 0, a: 255 }
        },
        // green
        {
          coord: { x: 256, y: 0 },
          expectedRGBA: { r: 0, g: 255, b: 0, a: 255 }
        },
        // blue
        {
          coord: { x: 256, y: 256 },
          expectedRGBA: { r: 0, g: 0, b: 255, a: 255 }
        },
        // transparent
        {
          coord: { x: 128, y: 128 },
          expectedRGBA: { r: 125, g: 125, b: 1, a: 0 }
        },
      ];

      return Promise.all(coordsConfig.map(async (config) => {
        let rgba: RGBA = await getPixelColorAtImageCoordinate(image, config.coord.x, config.coord.y);
        expect(rgba).toEqual(config.expectedRGBA);
      }));

    });
  });
});


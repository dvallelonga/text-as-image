import {
  buildCharacterMatrix,
  calculateGridDimensionsToFitCellCount,
  CharacterMatrix,
  GridDimensions,
  readContentFromTextUpload,
  stripWhitespace
} from '../../src/services/text-service';
import fs from 'fs';
import { ImageDimensions } from '../../src/services/image-service';


const EXPECTED_SINGLE_TEXT_FILE_CONTENT = `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit.`;

const TEXT_WITH_WHITESPACE_CHARS = `    Lorem ipsum dolor sit amet, 
consectetur        adipiscing elit. 

\tUt dapibus dignissim ipsum vitae tempor. 
\t\tClass aptent\ntaciti\rsociosqu ad litora 
torquent per\tconubia nostra, per inceptos himenaeos.       `;

const EXPECTED_TEXT_WITH_WHITESPACE_CHARS_STRIPPED = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus dignissim ipsum vitae tempor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`;

const EXPECTED_23_CHAR_MATRIX_6_X_4: CharacterMatrix = [
  "Lorem ",
  "ipsum ",
  "dolor ",
  "sit a"
];

const EXPECTED_24_CHAR_MATRIX_6_X_4: CharacterMatrix = [
  "Lorem ",
  "ipsum ",
  "dolor ",
  "sit am"
];

const EXPECTED_25_CHAR_MATRIX_6_X_4: CharacterMatrix = [
  "Lorem ",
  "ipsum ",
  "dolor ",
  "sit am",
  "e"
];



describe("Parsing of Upload Text", () => {

  it("should process an upload containing a single text file", async () => {
    let textUploadFile: Buffer = fs.readFileSync('test/fixtures/source-text.txt');

    let textFileContent: string = await readContentFromTextUpload(textUploadFile);
    expect(textFileContent).toEqual(EXPECTED_SINGLE_TEXT_FILE_CONTENT);
  });

  it("should remove extra whitespace characters from text", async () => {
    let whitespaceStripped: string = await stripWhitespace(TEXT_WITH_WHITESPACE_CHARS);
    expect(whitespaceStripped).toEqual(EXPECTED_TEXT_WITH_WHITESPACE_CHARS_STRIPPED);
  });

});


describe("Formatting Text Matrix", () => {

  describe("For an image input with given width x height dimensions, ", () => {
    const IMAGE_DIMENSIONS_3_X_2: ImageDimensions = { width: 3, height: 2 };
    const TEXT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus dignissim ipsum vitae tempor. Cl";

    describe("When the length of the input text provides **exactly the number of characters required** to fill out the dimensions of the scaled image,", () => {
      it("should produce a text matrix where row count == scaled image height in pixels, and the character length of the bottom row is equal to the width in pixels of the scaled image", async () => {
        const INPUT_CHAR_COUNT = 24;
        const textInput: string = TEXT.substr(0, INPUT_CHAR_COUNT);

        let characterMatrix: CharacterMatrix = buildCharacterMatrix(textInput, IMAGE_DIMENSIONS_3_X_2);

        expect(characterMatrix).toEqual(EXPECTED_24_CHAR_MATRIX_6_X_4);
      });
    });

    describe("When the length of the input text provides **slightly fewer than the number of characters required** to fill out the dimensions of the scaled image,", () => {
      it("should produce a text matrix where row count == scaled image height in pixels, and the character length of the bottom row is slightly less than the to the width in pixels of the scaled image", async () => {
        const INPUT_CHAR_COUNT = 23;
        const textInput: string = TEXT.substr(0, INPUT_CHAR_COUNT);

        let characterMatrix: CharacterMatrix = buildCharacterMatrix(textInput, IMAGE_DIMENSIONS_3_X_2);

        expect(characterMatrix).toEqual(EXPECTED_23_CHAR_MATRIX_6_X_4);
      });
    });

    describe("When the length of the input text provides **slightly more than the number of characters required** to fill out the dimensions of the scaled image,", () => {
      it("should produce a text matrix where row count == scaled image height in pixels + 1, and the character length of the bottom row is slightly less than the to the width in pixels of the scaled image", async () => {
        const INPUT_CHAR_COUNT = 25;
        const textInput: string = TEXT.substr(0, INPUT_CHAR_COUNT);

        let characterMatrix: CharacterMatrix = buildCharacterMatrix(textInput, IMAGE_DIMENSIONS_3_X_2);

        expect(characterMatrix).toEqual(EXPECTED_25_CHAR_MATRIX_6_X_4);
      });
    });


  });

  describe("calculateGridDimensionsToFitCellCount", () => {
    it("should correctly calculate the dimensions to use for the character matrix", async () => {

      const scenarios = [

        // character count == pixel count (no scaling)
        {
          input: {
            charCount: 50,
            imageDimensions: { width: 5, height: 10 }
          },
          expectedOutput: {
            gridDimensions: { columns: 5, rows: 10 }
          }
        },

        // character count > pixel count (scale up)
        {
          input: {
            charCount: 2000000,
            imageDimensions: { width: 1200, height: 900 }
          },
          expectedOutput: {
            gridDimensions: { columns: 1633, rows: 1225 }
          }
        },

        // character count < pixel count (scale down)
        {
          input: {
            charCount: 801503,
            imageDimensions: { width: 2400, height: 1900 }
          },
          expectedOutput: {
            gridDimensions: { columns: 1006, rows: 797 }
          }
        },
      ];

      scenarios.forEach(scenario => {
        const PRECISION_AFTER_DECIMAL = 2;
        const INPUT_IMAGE_ASPECT_RATIO = (scenario.input.imageDimensions.height / scenario.input.imageDimensions.width).toFixed(PRECISION_AFTER_DECIMAL);

        let gridDimensions: GridDimensions = calculateGridDimensionsToFitCellCount(scenario.input.imageDimensions, scenario.input.charCount);
        let gridAspectRatio = (gridDimensions.rows / gridDimensions.columns).toFixed(PRECISION_AFTER_DECIMAL);

        expect(gridDimensions).toEqual(scenario.expectedOutput.gridDimensions);
        expect(gridDimensions.columns * gridDimensions.rows).toBeGreaterThanOrEqual(scenario.input.charCount);
        expect(gridAspectRatio).toEqual(INPUT_IMAGE_ASPECT_RATIO);
      });

    });
  });

});

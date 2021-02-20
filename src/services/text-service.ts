import { Image, ImageDimensions } from "./image-service";

// TDOO: Look into fixing this so it doesn't require disabling the eslint rule
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CharacterMatrix extends Array<string> {};

export interface GridDimensions {
  columns: number;
  rows: number;
};

export class Text {
  private buffer: Buffer;
  private value: string;

  public static stripWhitespace(text: string): string {
    const strippedText: string = text
      .trim()
      // Condense extra whitespace characters (same characters found
      // by String.trim()) in a string by replacing each run of one
      // or more whitespace character with a single Space character.
      .replace(/[\s\uFEFF\xA0]+/g, " ");
  
    return strippedText;
  }

  constructor(sourceTextUploadFileBuffer: Buffer){
    this.buffer = sourceTextUploadFileBuffer;
    this.value = this.buffer.toString();
  }

  public getValue(): string {
    return this.value;
  }
  
}


export function buildCharacterMatrix(text: string, imageDimensions: ImageDimensions): CharacterMatrix {
  const charMatrix: CharacterMatrix = [];
  const { rows: rowCount, columns: colCount } = calculateGridDimensionsToFitCellCount(imageDimensions, text.length);

  while(charMatrix.length < rowCount){
    const textStartIndex: number = charMatrix.length * colCount;
    const rowChars: string = text.substr(textStartIndex, colCount);
    charMatrix[charMatrix.length] = rowChars;
  }

  return charMatrix;
}

/**
 * Scales a grid up or down in size, keeping the same proportions as the starting grid.
 * such that `cellCount` number of cells fit into the resulting scaled grid.
 * 
 * In the case that `cellCount` overflows the number that can be contained by the scaled
 * grid, one additional row will be added to accommodate the overflowed cells.
 * 
 * @param gridDimensions - Width and height dimensions of the starting grid from which to scale.
 * @param cellCount - The minimum number of cells that must fit within the scaled grid.
 * @returns GridDimensions - column and row counts of the scaled grid.
 */
export function calculateGridDimensionsToFitCellCount(gridDimensions: ImageDimensions, cellCount: number): GridDimensions {

  const aspectRatio = gridDimensions.height / gridDimensions.width; // e.g. 900 / 1200 = 0.75

  const columns = Math.round( Math.sqrt(cellCount / aspectRatio) );
  let rows = Math.round(columns * aspectRatio);

  // Add one more row if we'll overflow final row
  if((columns * rows) < cellCount){
    rows = rows + 1;
  }

  return {
    columns,
    rows
  };
}

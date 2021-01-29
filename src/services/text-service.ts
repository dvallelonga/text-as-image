export async function readContentFromTextUpload(sourceTextUploadFileBuffer: Buffer): Promise<string>{
  return sourceTextUploadFileBuffer.toString();
}

export function stripWhitespace(text: string): string {
  let strippedText: string = text
    .trim()
    // Condense extra whitespace characters (same characters found
    // by String.trim()) in a string by replacing each run of one
    // or more whitespace character with a single Space character.
    .replace(/[\s\uFEFF\xA0]+/g, ' ');

  return strippedText;
}

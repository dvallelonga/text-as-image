import {
  readContentFromTextUpload
} from '../../src/services/text-service';
import fs from 'fs';



let EXPECTED_SINGLE_TEXT_FILE_CONTENT = `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit.`;

describe("Parsing of Upload Text", () => {
  it("should process an upload containing a single text file", async () => {
    let textUploadFile: Buffer = fs.readFileSync('test/fixtures/source-text.txt');

    let textFileContent: string = await readContentFromTextUpload(textUploadFile);
    expect(textFileContent).toEqual(EXPECTED_SINGLE_TEXT_FILE_CONTENT);
  });

});

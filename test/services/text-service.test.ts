import {
  readContentFromTextUpload,
  stripWhitespace
} from '../../src/services/text-service';
import fs from 'fs';


const EXPECTED_SINGLE_TEXT_FILE_CONTENT = `Lorem ipsum dolor sit amet, 
consectetur adipiscing elit.`;

const TEXT_WITH_WHITESPACE_CHARS = `    Lorem ipsum dolor sit amet, 
consectetur        adipiscing elit. 

\tUt dapibus dignissim ipsum vitae tempor. 
\t\tClass aptent\ntaciti\rsociosqu ad litora 
torquent per\tconubia nostra, per inceptos himenaeos.       `;

const EXPECTED_TEXT_WITH_WHITESPACE_CHARS_STRIPPED = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut dapibus dignissim ipsum vitae tempor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.`;


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

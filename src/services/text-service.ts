export async function readContentFromTextUpload(sourceTextUploadFileBuffer: Buffer): Promise<string>{
  return sourceTextUploadFileBuffer.toString();
}
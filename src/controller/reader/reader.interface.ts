export interface IFileReader {
  readDataFromPath: (filePath: string) => Promise<ArrayBuffer>;
}

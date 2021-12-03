import * as core from '@actions/core';
import * as fs from 'fs';
import { IFileReader } from './reader.interface';

class ReaderController implements IFileReader {
  constructor() {}

  public readDataFromPath = (filePath: string): Promise<ArrayBuffer> => {
    core.info('Reading the protobuf dataset from: ' + filePath);

    return new Promise((resolve, reject) => {
      fs.readFile(filePath, null, (err, data) => {
        if (err) {
          core.setFailed('No dataset found in the provided `data-path` value.');
          return reject(err.message);
        }

        return resolve(data.buffer);
      });
    });
  };
}

export default ReaderController;

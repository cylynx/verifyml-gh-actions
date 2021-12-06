import * as core from '@actions/core';
import CommentController from './controller/comment';
import ProtobufController from './controller/protobuf';
import ReaderController from './controller/reader';

const main = async () => {
  const readerController = new ReaderController();
  const protobufController = new ProtobufController();
  const commentController = new CommentController();

  try {
    const cwd = core.getInput('cwd');
    const path = core.getInput('data-path');
    if (!path) {
      core.setFailed(
        '`data-path` is not provided, the path to dataset is required for us to compute the results.',
      );
      throw new Error('Missing `data-path` parameters');
    }

    const filePath = `${cwd}${path}`;

    const data = await readerController.readDataFromPath(filePath);
    const modelCard = protobufController.decodeMessage(data);

    const { name: modelCardName } = modelCard.modelDetails;
    const testResult = protobufController.deriveTestResults(modelCard);
    commentController.makeComment(testResult, path, modelCardName);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

main();

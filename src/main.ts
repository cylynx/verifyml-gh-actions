import * as core from '@actions/core';
import CommentController from './controller/comment';
import ProtobufController from './controller/protobuf';
import ReaderController from './controller/reader';

const main = async () => {
  const readerController = new ReaderController();
  const protobufController = new ProtobufController();
  const commentController = new CommentController();

  try {
    // const cwd = core.getInput('cwd');
    // const path = core.getInput('data-path');
    // if (!path) {
    //   core.setFailed(
    //     '`data-path` is not provided, the path to dataset is required for us to compute the results.',
    //   );
    //   throw new Error('Missing `data-path` parameters');
    // }

    // const filePath = `${cwd}${path}`;
    const filePath =
      '/Users/yinghua/Projects/cylynx/verifyml-report/public/data/credit-card-fraud.proto';
    const data = await readerController.readDataFromPath(filePath);
    const modelCard = protobufController.decodeMessage(data);
    const testResult = protobufController.deriveTestResults(modelCard);
    const commentContent = commentController.constructMarkdown(
      testResult,
      filePath,
    );

    console.log(commentContent);
  } catch (error: any) {
    core.setFailed(error.message);
  }
};

main();

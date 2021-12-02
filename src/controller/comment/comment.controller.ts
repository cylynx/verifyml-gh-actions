import { TestResult } from '../protobuf';
import type { CommentInterface } from './comment.interface';

class CommentController implements CommentInterface {
  public constructMarkdown(result: TestResult, path: string): string {
    const description = this.constructDescription(path);
    const testSummary = this.constructResult(result);

    const mdTemplate = `
    # 🔖 VerifyML Report

    ${description}

    ## 🔍 Test Result Summary

    ${testSummary}
    `;

    return mdTemplate;
  }

  private constructDescription(path: string) {
    return `Your test result for dataset in <code>${path}</code> is ready!`;
  }

  private constructResult(result: TestResult) {
    const {
      explainabilityAnalysis: EA,
      quantitativeAnalysis: QA,
      fairnessAnalysis: FA,
    } = result;

    const table = `
    |Test Type|Passed|Failed|
    |---------|:---:|:-----:|
    |Explainability Analysis| ${EA.passCount}| ${EA.failCount} |
    |Quantitative Analysis| ${QA.passCount}| ${QA.failCount} |
    |Fairness Analysis| ${FA.passCount}| ${FA.failCount} |
    `;

    return table;
  }
}

export default CommentController;

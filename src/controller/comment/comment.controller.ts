import { TestResult } from '../protobuf';
import type { CommentInterface } from './comment.interface';
import * as github from '@actions/github';
import * as core from '@actions/core';

class CommentController implements CommentInterface {
  private constructMarkdown(result: TestResult, path: string): string {
    const title = this.constructTitle(path);
    const testSummary = this.constructResult(result);

    const mdTemplate = `
    ${title}
    ${testSummary}
    `;

    return mdTemplate;
  }

  private constructTitle(path: string) {
    return `
    # 🔖 VerifyML Report

    Your test result for dataset in <code>${path}</code> is ready!

    `;
  }

  private constructResult(result: TestResult) {
    const {
      explainabilityAnalysis: EA,
      quantitativeAnalysis: QA,
      fairnessAnalysis: FA,
    } = result;

    const table = `
     ## 🔍 Test Result Summary

    |Test Type|Passed|Failed|
    |---------|:---:|:-----:|
    |Explainability Analysis| ${EA.passCount} | ${EA.failCount} |
    |Quantitative Analysis| ${QA.passCount} | ${QA.failCount} |
    |Fairness Analysis| ${FA.passCount} | ${FA.failCount} |

    `;

    return table;
  }

  public makeComment(result: TestResult, path: string) {
    const comment = this.constructMarkdown(result, path);
    const githubToken = core.getInput('GITHUB_TOKEN');

    const context = github.context;
    if (context.payload.pull_request == null) {
      throw new Error('no pull request found.');
    }

    const pullRequestNumber = context.payload['pull_request_number'];

    const octokit = github.getOctokit(githubToken);
    octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: pullRequestNumber,
      body: comment,
    });
  }
}

export default CommentController;

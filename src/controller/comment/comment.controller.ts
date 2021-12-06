import { TestResult } from '../protobuf';
import type { CommentInterface } from './comment.interface';
import * as github from '@actions/github';
import * as core from '@actions/core';

class CommentController implements CommentInterface {
  private constructMarkdown(
    result: TestResult,
    filePath: string,
    modelCardName: string,
  ): string {
    const repoUrl = github.context.payload.repository?.html_url;
    const { GITHUB_SHA } = process.env;
    const githubDataPath = `${repoUrl}/blob/${GITHUB_SHA}${filePath}`;

    const title = this.constructTitle();
    const testSummary = this.constructResult(result);
    const viewer = this.constructInspect(githubDataPath, modelCardName);

    const mdTemplate = `${title}
${testSummary}
${viewer}`;

    return String(mdTemplate);
  }

  private constructInspect(filePath: string, modelCardName: string) {
    const modelCardLink = `https://report.verifyml.com/redirect?url=${filePath}&section=modelDetails`;
    const content = `## 🔍 Inspect ${modelCardName} report

View and compare your dataset with our elegant [Model Card Viewer](${modelCardLink}). ✨

A public repository is required to use the Model Card Viewer.
`;

    return content;
  }

  private constructTitle() {
    return `The test results of your **model card** is automatically generated with VerifyML! 🎉`;
  }

  private constructResult(result: TestResult) {
    const {
      explainabilityAnalysis: EA,
      quantitativeAnalysis: QA,
      fairnessAnalysis: FA,
    } = result;

    const table = `## 📜 Test Result Summary

|Type of Tests|Pass|Fail|
|:--------|:---:|:-----:|
|Explainability Analysis| ${EA.passCount} | ${EA.failCount} |
|Quantitative Analysis| ${QA.passCount} | ${QA.failCount} |
|Fairness Analysis| ${FA.passCount} | ${FA.failCount} |
`;

    return table;
  }

  public makeComment(
    result: TestResult,
    filePath: string,
    modelCardName: string,
  ) {
    const body = this.constructMarkdown(result, filePath, modelCardName);

    const githubToken = core.getInput('GITHUB_TOKEN');

    const prNumber = this.getPRNumber();
    if (prNumber == null) {
      throw new Error('no pull request found.');
    }

    const context = github.context;
    const { number: issueNumber } = context.issue;
    core.info('Writing comments in the PR #' + issueNumber);

    const { repo, owner } = context.repo;

    const octokit = github.getOctokit(githubToken);
    octokit.rest.issues.createComment({
      repo,
      owner,
      issue_number: issueNumber,
      body,
    });
  }

  private getPRNumber() {
    const issueNumber = github.context.issue.number;
    if (issueNumber) return issueNumber;

    const prNumber = core.getInput('TARGET_PR_NUMBER');
    if (prNumber) return prNumber;

    return null;
  }
}

export default CommentController;

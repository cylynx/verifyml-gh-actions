import { TestResult } from '../protobuf';
import type { CommentInterface } from './comment.interface';
import * as github from '@actions/github';
import * as core from '@actions/core';

class CommentController implements CommentInterface {
  private constructMarkdown(result: TestResult, filePath: string): string {
    const repoUrl = github.context.payload.repository?.html_url;
    const githubDataPath = `${repoUrl}${filePath}`;

    const title = this.constructTitle(githubDataPath);
    const testSummary = this.constructResult(result);
    const viewer = this.constructViewer(githubDataPath);

    const mdTemplate = title + testSummary + viewer;

    return String(mdTemplate);
  }

  private constructViewer(filePath: string) {
    const content = `
    ## 🔍 Model Card Viewer

    View and compare your dataset with our elegant [Model Card Viewer](${filePath}).
    `;

    return content;
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
     ## 📜 Test Result Summary

    |Test Type|Passed|Failed|
    |---------|:---:|:-----:|
    |Explainability Analysis| ${EA.passCount} | ${EA.failCount} |
    |Quantitative Analysis| ${QA.passCount} | ${QA.failCount} |
    |Fairness Analysis| ${FA.passCount} | ${FA.failCount} |

    `;

    return table;
  }

  public makeComment(result: TestResult, filePath: string) {
    const body = this.constructMarkdown(result, filePath);

    const githubToken = core.getInput('GITHUB_TOKEN');

    const context = github.context;
    if (context.payload.pull_request == null) {
      throw new Error('no pull request found.');
    }

    const { number: issueNumber } = context.issue;
    const { repo, owner } = context.repo;
    console.log(owner);
    console.log(body);

    const octokit = github.getOctokit(githubToken);
    octokit.rest.issues.createComment({
      repo,
      owner,
      issue_number: issueNumber,
      body,
    });
  }
}

export default CommentController;

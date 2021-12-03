"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const github = __importStar(require("@actions/github"));
const core = __importStar(require("@actions/core"));
class CommentController {
    constructMarkdown(result, filePath) {
        var _a;
        const repoUrl = (_a = github.context.payload.repository) === null || _a === void 0 ? void 0 : _a.html_url;
        const { GITHUB_HEAD_REF } = process.env;
        const githubDataPath = `${repoUrl}/blob/${GITHUB_HEAD_REF}${filePath}`;
        const title = this.constructTitle(githubDataPath);
        const testSummary = this.constructResult(result);
        const viewer = this.constructViewer(githubDataPath);
        const mdTemplate = `${title}
${testSummary}
${viewer}`;
        return String(mdTemplate);
    }
    constructViewer(filePath) {
        const modelCardLink = `https://report.verifyml.com/redirect?url=${filePath}&section=modelDetails`;
        const content = `## 🔍 Model Card Viewer

View and compare your dataset with our elegant [Model Card Viewer](${modelCardLink}). ✨

Your repository visibility is required to be <b>public</b> in order to use the Model Card Viewer.
`;
        return content;
    }
    constructTitle(path) {
        return `The VerifyML Report for your [uploaded dataset](${path}) is ready! 🎉`;
    }
    constructResult(result) {
        const { explainabilityAnalysis: EA, quantitativeAnalysis: QA, fairnessAnalysis: FA, } = result;
        const table = `## 📜 Test Result Summary

|Type of Tests|Pass|Fail|
|:--------|:---:|:-----:|
|Explainability Analysis| ${EA.passCount} | ${EA.failCount} |
|Quantitative Analysis| ${QA.passCount} | ${QA.failCount} |
|Fairness Analysis| ${FA.passCount} | ${FA.failCount} |
`;
        return table;
    }
    makeComment(result, filePath) {
        const body = this.constructMarkdown(result, filePath);
        const githubToken = core.getInput('GITHUB_TOKEN');
        const context = github.context;
        if (context.payload.pull_request == null) {
            throw new Error('no pull request found.');
        }
        const { number: issueNumber } = context.issue;
        const { repo, owner } = context.repo;
        const octokit = github.getOctokit(githubToken);
        octokit.rest.issues.createComment({
            repo,
            owner,
            issue_number: issueNumber,
            body,
        });
    }
}
exports.default = CommentController;

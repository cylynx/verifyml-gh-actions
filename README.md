# cylynx/verifyml-reports

This action provides the following functionality for GitHub Actions users:

- Read the Protobuf dataset from a specified path in local repository and display the test results as comment in the pull request.
- Generate Model Card Viewer link for user to view the model card data.

# Usage

See [action.yml](https://github.com/cylynx/verifyml-reports/blob/v0.0.1-beta/action.yml)

**Basic**

```yaml
name: Generate VerifyML Report

on:
  pull_request:
    branches:
      - '*'

jobs:
  report-generation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout to Current Branch
        uses: actions/checkout@v2

      - name: Generate VerifyML Report
        uses: cylynx/verifyml-reports@v1
        with:
          data-path: '/examples/model_card_output/data/loan_approval_example.proto'
```

The `data-path` input is required. It must be specify for the action to read the dataset from a specific path in order to generate test result.

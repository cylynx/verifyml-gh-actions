# cylynx/verifyml-reports

This action provides the following functionality for GitHub Actions users:

- Read the Protobuf dataset from a specified path in local repository and display the test results as comment in the pull request.
- Generate Model Card Viewer link for user to view the model card data.

# Usage

See [action.yml](./action.yml)

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

The `data-path` input is required - the action will read the model card from the given path and use it to generate the test results.

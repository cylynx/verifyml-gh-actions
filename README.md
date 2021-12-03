# cylynx/verifyml-reports

This action provides the following functionality for GitHub Actions users:

- Read the Protobuf dataset from a specified path in local repository and display the test results as comment in the pull request.
- Generate Model Card Viewer link for user to view the model card data.

# Usage

See [action.yml](./action.yml)

```yaml
steps:
  - name: Generate VerifyML Report
  - uses: cylynx/verifyml-reports@v1
    with:
      data-path: '/public/data/credit-card-fraud.proto'
```

The `data-path` input is required. It must be specify for the action to read the dataset from a specific path in order to generate test result.

# Install Scarb

Sets up [Scarb] in your GitHub Actions workflow.

## Example workflow

```yaml
name: My workflow
on:
  push:
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: software-mansion/setup-scarb@v1
        with:
          scarb-version: "0.5.1"
      - run: scarb fmt --check
      - run: scarb test
```

## Inputs

- `scarb-version` - **Optional**. A string stating an explicit Scarb version to use, or `"latest"`. When not specified, the `.tool-versions` file will be read to resolve Scarb version, and in case it is not present the latest version will be used.

## Outputs

- `scarb-prefix` - A path to where Scarb has been extracted to. The `scarb` binary will be located in the `bin`
  subdirectory (`${{ steps.setup-scarb.outputs.scarb-prefix }}/bin`).
- `scarb-version` - Installed Scarb version.

[scarb]: https://docs.swmansion.com/scarb

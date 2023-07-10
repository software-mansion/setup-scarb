# Install Scarb

Sets up [Scarb] in your GitHub Actions workflow.

## Example workflow

```yaml
name: My workflow
on:
  push:
  pull_request:
jobs:
  test:
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

- `scarb-version` - **Optional**. A string stating an explicit Scarb version to use, or `"latest"`. Defaults to `"latest"`.

## Outputs

- `scarb-prefix` - A path to where Scarb has been extracted to. The `scarb` binary will be located in the `bin`
  subdirectory (`${{ steps.setup-scarb.outputs.scarb-prefix }}/bin`).
- `scarb-version` - Installed Scarb version.

[scarb]: https://docs.swmansion.com/scarb

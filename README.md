# Install Scarb

Sets up [Scarb] in your GitHub Actions workflow supporting caching out of the box.

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
          scarb-version: "2.3.0"
      - run: scarb fmt --check
      - run: scarb test
```

## Inputs

- `scarb-version` - **Optional**. String, either:
  - Stating an explicit Scarb version to use, for example `"2.3.0"`.
  - Stating an explicit nightly tag to use, for example `"nightly-2023-08-24"`.
  - `"latest"` to download latest stable version.
  - `"nightly"` to download latest nightly version.
  - Empty/not specified: the `.tool-versions` file will be read to resolve Scarb version, and in case it is not
    present the latest stable version will be used.
- `tool-versions` - **Optional**. String.
  - Stating a relative or absolute path to the `.tool-versions` file.
  - Should be used only if `scarb-version` is not specified.

## Outputs

- `scarb-prefix` - A path to where Scarb has been extracted to. The `scarb` binary will be located in the `bin`
  subdirectory (`${{ steps.setup-scarb.outputs.scarb-prefix }}/bin`).
- `scarb-version` - Installed Scarb version (as reported by `scarb -V`).

[scarb]: https://docs.swmansion.com/scarb

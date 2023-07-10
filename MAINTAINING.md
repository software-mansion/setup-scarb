# Scarb Maintenance

> This document supplements [Scarb Maintenance](https://github.com/software-mansion/scarb/blob/main/MAINTAINING.md)
> docs, with information specific to `setup-scarb` repository alone.

## Release procedure

In a nutshell, this is trivial: create a tag on `main` named `vX.Y.Z`.
There is a tag protection rule set up!
Make sure you create it on a green commit (CI is passing), this is not verified!
Then force push `vX` and `vX.Y` tags, so that people will be able to type following in their workflows:

```yaml
- uses: software-mansion/setup-scarb@vX
- uses: software-mansion/setup-scarb@vX.Y
```

Checkout [Example developer process](https://docs.github.com/en/actions/creating-actions/releasing-and-maintaining-actions#example-developer-process)
in GitHub docs.

Do not forget to announce the update on Twitter, Telegram and Discord!

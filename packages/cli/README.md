<!-- prettier-ignore-start -->

<!-- badges-start -->

[![Black Lives Matter!][badge-blm]][link-blm]
[![Maintenance status][badge-maintenance]][link-repo]
[![Last commit timestamp][badge-last-commit]][link-repo]
[![Open issues][badge-issues]][link-issues]
[![Pull requests][badge-pulls]][link-pulls]
[![Codecov][badge-codecov]][link-codecov]
[![Source license][badge-license]][link-license]
[![Tree shaking support][badge-tree-shaking]][link-bundlephobia]
[![Compressed package size][badge-size]][link-bundlephobia]
[![NPM version][badge-npm]][link-npm]
[![Uses Semantic Release!][badge-semantic-release]][link-semantic-release]

<!-- badges-end -->

<!-- prettier-ignore-end -->

# @projector-js/cli

<!-- TODO -->

- The `--root` argument, when used in a polyrepo context, refers to the
  repository root and can usually be omitted.
- `-w` vs `-p`

> The `p` and alias `projector` command comes from `npm i -g @projector-js/cli`.
> Alternatively, npx can be used: `npx projector ...` (when installed locally)
> or `npx projector-js ...` (when not installed).

glob `-w` has a specific priority order

`create` has alias `init`

`--parallel` vs `--concurrency 1` (or N) vs `--sequential`

confirm when calling `create` within a directory that contains a `package.json`
without `workspaces` key. `--monorepo` (and all other options) settable from
CLI; still, ask via inquirer too.

tests and some other commands are done from root

`clean` command that calls clean script eventually but also cleans up tmp
articles in /tmp and elsewhere

git output symbols inspired by
[https://github.com/spaceship-prompt/spaceship-prompt][1]

in monorepo mode, publishing from the main repository is not possible

package-id used for git tags

publish will fail if whole repo is not clean

publish will fail if not enough disk space remaining

Caveat: publish command in a monorepo context trades off disk space for perf
(concurrency).

publish will keep temp release dirs around

publish will bind mount `node_modules` and any other files and dirs specified in
`.gitignore`

If going with conventional-changelog, consider using [the CLI version patched to
work properly with monorepos][2]:

```bash
npm install --save-dev https://xunn.at/conventional-changelog-cli
```

## Install

```bash
npm install --save-dev @projector-js/cli
```

## Usage

<!-- TODO -->

## Documentation

Further documentation can be found under [`docs/`][docs].

### License

[![FOSSA analysis][badge-fossa]][link-fossa]

## Contributing and Support

**[New issues][choose-new-issue] and [pull requests][pr-compare] are always
welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟 this
project][link-repo] to let me know you found it useful! ✊🏿 Thank you!

See [CONTRIBUTING.md][contributing] and [SUPPORT.md][support] for more
information.

[badge-blm]: https://xunn.at/badge-blm 'Join the movement!'
[link-blm]: https://xunn.at/donate-blm
[badge-maintenance]:
  https://img.shields.io/maintenance/active/2022
  'Is this package maintained?'
[link-repo]: https://github.com/xunnamius/projector
[badge-last-commit]:
  https://img.shields.io/github/last-commit/xunnamius/projector
  'Latest commit timestamp'
[badge-issues]:
  https://img.shields.io/github/issues/Xunnamius/projector
  'Open issues'
[link-issues]: https://github.com/Xunnamius/projector/issues?q=
[badge-pulls]:
  https://img.shields.io/github/issues-pr/xunnamius/projector
  'Open pull requests'
[link-pulls]: https://github.com/xunnamius/projector/pulls
[badge-codecov]:
  https://codecov.io/gh/Xunnamius/projector/branch/main/graph/badge.svg?token=HWRIOBAAPW
  'Is this package well-tested?'
[link-codecov]: https://codecov.io/gh/Xunnamius/projector
[badge-license]:
  https://img.shields.io/npm/l/@projector-js/cli
  "This package's source license"
[link-license]: https://github.com/Xunnamius/projector/blob/main/LICENSE
[badge-fossa]:
  https://app.fossa.com/api/projects/custom%2B27276%2Fgit%40github.com%3AXunnamius%2Fprojector.git.svg?type=large
  "Analysis of this package's license obligations"
[link-fossa]:
  https://app.fossa.com/projects/custom+27276%2Fgit@github.com:Xunnamius%2Fprojector.git
[badge-npm]:
  https://api.ergodark.com/badges/npm-pkg-version/@projector-js/cli
  'Install this package using npm or yarn!'
[link-npm]: https://www.npmjs.com/package/@projector-js/cli
[badge-semantic-release]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
  'This repo practices continuous integration and deployment!'
[link-semantic-release]: https://github.com/semantic-release/semantic-release
[badge-size]: https://badgen.net/bundlephobia/minzip/@projector-js/cli
[badge-tree-shaking]:
  https://badgen.net/bundlephobia/tree-shaking/@projector-js/cli
  'Is this package optimized for Webpack?'
[link-bundlephobia]:
  https://bundlephobia.com/result?p=@projector-js/cli
  'Package size (minified and gzipped)'
[package-json]: package.json
[docs]: docs
[choose-new-issue]: https://github.com/xunnamius/projector/issues/new/choose
[pr-compare]: https://github.com/xunnamius/projector/compare
[contributing]: /CONTRIBUTING.md
[support]: /.github/SUPPORT.md
[1]: https://github.com/spaceship-prompt/spaceship-prompt
[2]: https://github.com/conventional-changelog/conventional-changelog/pull/865

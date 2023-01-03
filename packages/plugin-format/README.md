<!-- prettier-ignore-start -->

<!-- badges-start -->

[![Black Lives Matter!][badge-blm]][link-blm]
[![Maintenance status][badge-maintenance]][link-repo]
[![Last commit timestamp][badge-last-commit]][link-repo]
[![Open issues][badge-issues]][link-issues]
[![Pull requests][badge-pulls]][link-pulls]
[![Codecov][badge-codecov]][link-codecov]
[![Source license][badge-license]][link-license]
[![NPM version][badge-npm]][link-npm]
[![Uses Semantic Release!][badge-semantic-release]][link-semantic-release]

<!-- badges-end -->

<!-- prettier-ignore-end -->

# @projector-js/plugin-format

<!-- TODO -->

remark-sort-references

doctoc and remark should ignore whichever files prettier is ignoring (does
prettier have an API to get ignored files? Or do we have to look at
.prettierignore directly). That is: use fast-glob to interpret a shared glob and
then pass the same files to each program.

Needs a special mode where it can run its constituent parts individually based
on the extension of the file passed in. Essentially, it can accept and/or has
internally a lint-staged.config.js style configuration capable of running on
certain formatters

Also the ability to run the individual formatters manually

## Install

```bash
npm install --save-dev @projector-js/plugin-format
```

## Usage

<!-- TODO -->

## Documentation

Further documentation can be found under [`docs/`][docs].

## Contributing and Support

**[New issues][choose-new-issue] and [pull requests][pr-compare] are always
welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟 this
project][link-repo] to let me know you found it useful! ✊🏿 Thank you!

See [CONTRIBUTING.md][contributing] and [SUPPORT.md][support] for more
information.

[badge-blm]: https://xunn.at/badge-blm 'Join the movement!'
[link-blm]: https://xunn.at/donate-blm
[badge-maintenance]:
  https://img.shields.io/maintenance/active/2023
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
  https://img.shields.io/npm/l/@projector-js/plugin-format
  "This package's source license"
[link-license]: https://github.com/Xunnamius/projector/blob/main/LICENSE
[badge-npm]:
  https://api.ergodark.com/badges/npm-pkg-version/@projector-js/plugin-format
  'Install this package using npm or yarn!'
[link-npm]: https://www.npmjs.com/package/@projector-js/plugin-format
[badge-semantic-release]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
  'This repo practices continuous integration and deployment!'
[link-semantic-release]: https://github.com/semantic-release/semantic-release
[package-json]: package.json
[docs]: docs
[choose-new-issue]: https://github.com/xunnamius/projector/issues/new/choose
[pr-compare]: https://github.com/xunnamius/projector/compare
[contributing]: /CONTRIBUTING.md
[support]: /.github/SUPPORT.md

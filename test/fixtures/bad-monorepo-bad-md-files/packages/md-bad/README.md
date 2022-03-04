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

# md-bad

Words here.

## Documentation

> Further documentation can be found under [`docs/`][docs].

This is a \[CJS2 package]\[cjs-mojito] with \[statically-analyzable
exports]\[commonjs-static] built for Node14 and above. That means both CJS2 (via
`require(...)`) and ESM (via `import { ... } from ...` or `await import(...)`)
will load this package from the same entry points when using Node. This has
several benefits, the foremost being: 1) less code shipped/smaller package
size, 2) avoiding \[dual package hazard]\[dual-package-hazard] entirely, and 3)
less complex/fragile build process.

For bundlers like Webpack and Rollup, each entry point (i.e. `ENTRY`) in
[`package.json`'s `exports[ENTRY]`][package-json] object includes an
\[`exports[ENTRY].module`]\[exports-module-key] key pointing to
\[tree-shakable]\[tree-shaking] ESM source. Additionally, for TypeScript and
IDEs, each object includes an \[`exports[ENTRY].types`]\[exports-types-key] key
pointing to its respective TypeScript declarations file. There may be [other
keys][package-json] for \[other runtimes]\[exports-conditions] as well,
including `node` and `browser`. Finally, [`package.json`][package-json] also
includes the \[`sideEffects`]\[side-effects-key] key, which is `false` for
optimal \[tree shaking]\[tree-shaking].

Though [`package.json`][package-json] includes
\[`{ "type": "commonjs" }`]\[local-pkg], note that the ESM entry points are ES
module (`.mjs`) files.

### License

[![FOSSA analysis][badge-fossa]][link-fossa]

## Contributing and Support

**[New issues][choose-new-issue] and [pull requests][pr-compare] are always
welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟 this
project][link-repo] to let me know you found it useful! ✊🏿 Thank you!

See \[CONTRIBUTING.md]\[contributing] and \[SUPPORT.md]\[support] for more
information.

[badge-blm]: https://xunn.at/badge-blm 'Join the movement!'
[link-blm]: https://xunn.at/donate-blm
[badge-maintenance]:
  https://img.shields.io/maintenance/active/2022
  'Is this package maintained?'
[link-repo]: https://github.com/xunnamius/next-test-api-route-handler
[badge-last-commit]:
  https://img.shields.io/github/last-commit/xunnamius/next-test-api-route-handler
  'Latest commit timestamp'
[badge-issues]:
  https://img.shields.io/github/issues/Xunnamius/next-test-api-route-handler
  'Open issues'
[link-issues]:
  https://github.com/Xunnamius/next-test-api-route-handler/issues?q=
[badge-pulls]:
  https://img.shields.io/github/issues-pr/xunnamius/next-test-api-route-handler
  'Open pull requests'
[link-pulls]: https://github.com/xunnamius/next-test-api-route-handler/pulls
[badge-codecov]:
  https://codecov.io/gh/Xunnamius/next-test-api-route-handler/branch/main/graph/badge.svg?token=HWRIOBAAPW
  'Is this package well-tested?'
[link-codecov]: https://codecov.io/gh/Xunnamius/next-test-api-route-handler
[badge-license]:
  https://img.shields.io/npm/l/next-test-api-route-handler
  "This package's source license"
[link-license]:
  https://github.com/Xunnamius/next-test-api-route-handler/blob/main/LICENSE
[badge-fossa]:
  https://app.fossa.com/api/projects/git%2Bgithub.com%2FXunnamius%2Fnext-test-api-route-handler.svg?type=large
  "Analysis of this package's license obligations"
[link-fossa]:
  https://app.fossa.com/projects/git%2Bgithub.com%2FXunnamius%2Fnext-test-api-route-handler
[badge-npm]:
  https://api.ergodark.com/badges/npm-pkg-version/next-test-api-route-handler
  'Install this package using npm or yarn!'
[link-npm]: https://www.npmjs.com/package/next-test-api-route-handler
[badge-semantic-release]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
  'This repo practices continuous integration and deployment!'
[link-semantic-release]: https://github.com/semantic-release/semantic-release
[badge-size]: https://badgen.net/bundlephobia/minzip/next-test-api-route-handler
[badge-tree-shaking]:
  https://badgen.net/bundlephobia/tree-shaking/next-test-api-route-handler
  'Is this package optimized for Webpack?'
[link-bundlephobia]:
  https://bundlephobia.com/result?p=next-test-api-route-handler
  'Package size (minified and gzipped)'
[package-json]: package.json
[docs]: docs
[choose-new-issue]:
  https://github.com/Xunnamius/next-test-api-route-handler/issues/new/choose
[pr-compare]: https://github.com/Xunnamius/next-test-api-route-handler/compare

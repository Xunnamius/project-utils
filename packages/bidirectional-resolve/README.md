<!-- symbiote-template-region-start 1 -->

<p align="center" width="100%">
  <img width="300" src="https://raw.githubusercontent.com/Xunnamius/project-utils/refs/heads/main/packages/bidirectional-resolve/logo.png">
</p>

<p align="center" width="100%">
<!-- symbiote-template-region-end -->
Resolve a package entry point to a file path <i>or a file path to a package entry point!</i>
<!-- symbiote-template-region-start 2 -->
</p>

<hr />

<div align="center">

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-downloads-link]

</div>

# bidirectional-resolve

<!-- symbiote-template-region-end -->

This package allows you to resolve a given package entry point (e.g.
`mdast-util-from-markdown` in `import('mdast-util-from-markdown')`) into a file
path (e.g. `./node_modules/mdast-util-from-markdown/lib/index.js`).

```typescript
import {
  flattenPackageJsonSubpathMap,
  resolveExportsTargetsFromEntryPoint
} from 'bidirectional-resolve';

const entrypoint = 'mdast-util-from-markdown';

const { exports: packageJsonExports } = await readJsonFile(
  // There are several ways to grab a package's package.json file
  `${entrypoint}/package.json`
);

const flatExports = flattenPackageJsonSubpathMap({ map: packageJsonExports });

const nodeModulesPaths = resolveExportsTargetsFromEntryPoint({
  flattenedExports: flatExports,
  entrypoint,
  conditions: ['types', 'require', 'import', 'node']
});

console.log(nodeModulesPaths); // => ['./node_modules/mdast-util-from-markdown/lib/index.js']
```

This is similar to what is returned by `require.resolve` in CJS contexts, or
`import.meta.resolve` in ESM contexts, and there are several other libraries
that accomplish some form of this.

What makes `bidirectional-resolve` special is that, unlike prior art, it can
also _reverse_ a given file path (e.g.
`./node_modules/mdast-util-from-markdown/lib/index.js`) back into an entry point
(e.g. `mdast-util-from-markdown`).

```typescript
import {
  flattenPackageJsonSubpathMap,
  resolveEntryPointsFromExportsTarget
} from 'bidirectional-resolve';

const precariousNodeModulesImportPath =
  './node_modules/mdast-util-from-markdown/lib/index.js';

const { exports: packageJsonExports } = await readJsonFile(
  await packageUp({ cwd: path.dirname(precariousNodeModulesImportPath) })
);

const flatExports = flattenPackageJsonSubpathMap({ map: packageJsonExports });

const entrypoints = resolveEntryPointsFromExportsTarget({
  flattenedExports: flatExports,
  precariousNodeModulesImportPath,
  conditions: ['types', 'require', 'import', 'node']
});

console.log(entrypoints); // => ['mdast-util-from-markdown']
```

As the above examples demonstrate, `bidirectional-resolve` supports
bidirectional [conditional resolution][1] of entry points in both [exports][3]
_and [imports][2]_ `package.json` fields.

Deriving a package's entry point from one of its internal file paths satisfies a
variety of use cases. For instance, `bidirectional-resolve` can be used to [work
around][4] strange behavior in the TypeScript compiler—behavior exhibited since
version 3.9 (2020) and _still happening_ as of 5.7 (2025)—where `tsc` [sometimes
emits definition files containing relative paths precariously pointing to files
inside the nearest `node_modules` directory][5].

This is not ideal for several reasons, including the fact that package managers
like NPM frequently hoist packages in unpredictable ways, especially in
monorepos, which will _silently break these hardcoded import paths_. As part of
a post-emit step, `bidirectional-resolve` can be used to turn these hardcoded
paths back into their more resilient entrypoint forms.

<!-- symbiote-template-region-start 3 -->

---

<!-- remark-ignore-start -->
<!-- symbiote-template-region-end -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [`flattenPackageJsonSubpathMap`](#flattenpackagejsonsubpathmap)
  - [`resolveEntryPointsFromExportsTarget`](#resolveentrypointsfromexportstarget)
  - [`resolveExportsTargetsFromEntryPoint`](#resolveexportstargetsfromentrypoint)
  - [`resolveEntryPointsFromImportsTarget`](#resolveentrypointsfromimportstarget)
  - [`resolveImportsTargetsFromEntryPoint`](#resolveimportstargetsfromentrypoint)
- [Appendix](#appendix)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- symbiote-template-region-start 4 -->
<!-- remark-ignore-end -->

## Install

<!-- symbiote-template-region-end -->

To install:

```shell
npm install bidirectional-resolve
```

## Usage

This package exports five functions:

### `flattenPackageJsonSubpathMap`

> [API reference][6]

Flattens entry points within a `package.json` [`imports`][2]/[`exports`][3] map
into a one-dimensional array of subpath-target mappings.

Each resolver function consumes a flattened array of subpath mappings. This
function takes the pain out of generating such mappings.

#### Example

```typescript
const flattenedExports = flattenPackageJsonSubpathMap({
  map: packageJson.exports
});
```

### `resolveEntryPointsFromExportsTarget`

> [API reference][7]

Given `target` and `conditions`, this function returns an array of zero or more
entry points that are guaranteed to resolve to `target` when the exact
`conditions` are present. This is done by reverse-mapping `target` using
[`exports`][3] from `package.json`. [`exports`][3] is assumed to be valid.

Entry points are sorted in the order they're encountered with the caveat that
exact subpaths always come before subpath patterns. Note that, if `target`
contains one or more asterisks, the subpaths returned by this function will also
contain an asterisk.

The only other time this function returns a subpath with an asterisk is if the
subpath is a "many-to-one" mapping; that is: the subpath has an asterisk but its
target does not.

For instance:

```json
{
  "exports": {
    "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
    "many-to-one-subpath-returned-with-asterisk-2/*": null
  }
}
```

In this case, the asterisk can be replaced with literally anything and it would
still match. Hence, the replacement is left up to the caller.

#### Example

```typescript
const entrypoints = resolveEntryPointsFromExportsTarget({
  flattenedExports,
  target,
  conditions,
  includeUnsafeFallbackTargets,
  replaceSubpathAsterisks
});
```

### `resolveExportsTargetsFromEntryPoint`

> [API reference][8]

Given `entryPoint` and `conditions`, this function returns an array of zero or
more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are present. This is done by mapping `entryPoint` using
[`exports`][3] from `package.json`. [`exports`][3] is assumed to be valid.

#### Example

```typescript
const targets = resolveExportsTargetsFromEntryPoint({
  flattenedExports,
  entryPoint,
  conditions,
  includeUnsafeFallbackTargets
});
```

### `resolveEntryPointsFromImportsTarget`

> [API reference][9]

Given `target` and `conditions`, this function returns an array of zero or more
entry points that are guaranteed to resolve to `target` when the exact
`conditions` are present. This is done by reverse-mapping `target` using
[`imports`][2] from `package.json`. [`imports`][2] is assumed to be valid.

Entry points are sorted in the order they're encountered with the caveat that
exact subpaths always come before subpath patterns. Note that, if `target`
contains one or more asterisks, the subpaths returned by this function will also
contain an asterisk.

The only other time this function returns a subpath with an asterisk is if the
subpath is a "many-to-one" mapping; that is: the subpath has an asterisk but its
target does not.

For instance:

```json
{
  "imports": {
    "many-to-one-subpath-returned-with-asterisk-1/*": "target-with-no-asterisk.js",
    "many-to-one-subpath-returned-with-asterisk-2/*": null
  }
}
```

In this case, the asterisk can be replaced with literally anything and it would
still match. Hence, the replacement is left up to the caller.

#### Example

```typescript
const entrypoints = resolveEntryPointsFromImportsTarget({
  flattenedImports,
  target,
  conditions,
  includeUnsafeFallbackTargets,
  replaceSubpathAsterisks
});
```

### `resolveImportsTargetsFromEntryPoint`

> [API reference][10]

Given `entryPoint` and `conditions`, this function returns an array of zero or
more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are present. This is done by mapping `entryPoint` using
[`imports`][2] from `package.json`. [`imports`][2] is assumed to be valid.

#### Example

```typescript
const targets = resolveImportsTargetsFromEntryPoint({
  flattenedImports,
  entryPoint,
  conditions,
  includeUnsafeFallbackTargets
});
```

<!-- symbiote-template-region-start 5 -->

## Appendix

<!-- symbiote-template-region-end -->

Further documentation can be found under [`docs/`][x-repo-docs].

<!-- TODO: additional appendix sections here -->
<!-- symbiote-template-region-start 6 -->

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for use in Node.js versions that are not end-of-life. For
TypeScript users, this package supports both `"Node10"` and `"Node16"` module
resolution strategies.

<!-- symbiote-template-region-end -->
<!-- TODO: additional package details here -->
<!-- symbiote-template-region-start 7 -->

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, a drastically less complex build process, and CJS
consumers aren't shafted.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declaration file for TypeScript and IDEs, a
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, a `exports[ENTRY].node` and/or
`exports[ENTRY].default` condition pointing to (usually CJS2) source for Node.js
`require`/`import` and for browsers and other environments, and [other
conditions][x-pkg-exports-conditions] not enumerated here. Check the
[package.json][x-repo-package-json] file to see which export conditions are
supported.

Note that, regardless of the [`{ "type": "..." }`][x-pkg-type] specified in
[`package.json`][x-repo-package-json], any JavaScript files written in ESM
syntax (including distributables) will always have the `.mjs` extension. Note
also that [`package.json`][x-repo-package-json] may include the
[`sideEffects`][x-pkg-side-effects-key] key, which is almost always `false` for
optimal [tree shaking][x-pkg-tree-shaking] where appropriate.

<!-- symbiote-template-region-end -->
<!-- TODO: additional package details here -->
<!-- symbiote-template-region-start 8 -->

</details>

### License

<!-- symbiote-template-region-end -->

See [LICENSE][x-repo-license].

<!-- TODO: additional license information and/or sections here -->
<!-- symbiote-template-region-start 9 -->

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Or [buy
me a beer][x-repo-sponsor], I'd appreciate it. Thank you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

<!-- symbiote-template-region-end -->
<!-- TODO: additional contribution/support sections here -->
<!-- symbiote-template-region-start 10 -->

### Contributors

<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start root-package-only -->
<!-- (section elided by symbiote) -->
<!-- symbiote-template-region-end -->
<!-- symbiote-template-region-start workspace-package-only -->

See the [table of contributors][x-repo-contributors].

<!-- symbiote-template-region-end -->

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/project-utils/main?style=flat-square&token=HWRIOBAAPW&flag=package.main_bidirectional-resolve
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/project-utils
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/bidirectional-resolve?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-downloads-link]: https://npmtrends.com/bidirectional-resolve
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/Xunnamius/project-utils?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/bidirectional-resolve?style=flat-square
  "This package's source license"
[x-badge-license-link]:
  https://github.com/Xunnamius/project-utils/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/bidirectional-resolve
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://npm.im/bidirectional-resolve
[x-badge-repo-link]: https://github.com/Xunnamius/project-utils
[x-badge-semanticrelease-image]:
  https://xunn.at/badge-semantic-release
  'This repo practices continuous integration and deployment!'
[x-badge-semanticrelease-link]:
  https://github.com/semantic-release/semantic-release
[x-pkg-cjs-mojito]:
  https://dev.to/jakobjingleheimer/configuring-commonjs-es-modules-for-nodejs-12ed#publish-only-a-cjs-distribution-with-property-exports
[x-pkg-dual-package-hazard]:
  https://nodejs.org/api/packages.html#dual-package-hazard
[x-pkg-exports-conditions]:
  https://webpack.js.org/guides/package-exports#reference-syntax
[x-pkg-exports-module-key]:
  https://webpack.js.org/guides/package-exports#providing-commonjs-and-esm-version-stateless
[x-pkg-exports-types-key]:
  https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta#packagejson-exports-imports-and-self-referencing
[x-pkg-side-effects-key]:
  https://webpack.js.org/guides/tree-shaking#mark-the-file-as-side-effect-free
[x-pkg-tree-shaking]: https://webpack.js.org/guides/tree-shaking
[x-pkg-type]:
  https://github.com/nodejs/node/blob/8d8e06a345043bec787e904edc9a2f5c5e9c275f/doc/api/packages.md#type
[x-repo-choose-new-issue]:
  https://github.com/Xunnamius/project-utils/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-contributors]: /README.md#contributors
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/Xunnamius/project-utils/compare
[x-repo-sponsor]: https://github.com/sponsors/Xunnamius
[x-repo-support]: /.github/SUPPORT.md
[1]: https://nodejs.org/api/packages.html#conditional-exports
[2]: https://nodejs.org/api/packages.html#imports
[3]: https://nodejs.org/api/packages.html#exports
[4]:
  https://github.com/Xunnamius/symbiote/blob/c3fc1264932eb8224289ef973366fc0cb5435f59/babel.config.cjs#L344-L435
[5]: https://github.com/microsoft/TypeScript/issues/38111
[6]:
  https://github.com/Xunnamius/project-utils/blob/main/packages/bidirectional-resolve/docs/functions/flattenPackageJsonSubpathMap.md
[7]:
  https://github.com/Xunnamius/project-utils/blob/main/packages/bidirectional-resolve/docs/functions/resolveEntryPointsFromExportsTarget.md
[8]:
  https://github.com/Xunnamius/project-utils/blob/main/packages/bidirectional-resolve/docs/functions/resolveExportsTargetsFromEntryPoint.md
[9]:
  https://github.com/Xunnamius/project-utils/blob/main/packages/bidirectional-resolve/docs/functions/resolveEntryPointsFromImportsTarget.md
[10]:
  https://github.com/Xunnamius/project-utils/blob/main/packages/bidirectional-resolve/docs/functions/resolveImportsTargetsFromEntryPoint.md

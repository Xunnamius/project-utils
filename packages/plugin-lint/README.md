<!-- badges-start -->

[![Black Lives Matter!][x-badge-blm-image]][x-badge-blm-link]
[![Last commit timestamp][x-badge-lastcommit-image]][x-badge-repo-link]
[![Codecov][x-badge-codecov-image]][x-badge-codecov-link]
[![Source license][x-badge-license-image]][x-badge-license-link]
[![Monthly Downloads][x-badge-downloads-image]][x-badge-npm-link]
[![NPM version][x-badge-npm-image]][x-badge-npm-link]
[![Uses Semantic Release!][x-badge-semanticrelease-image]][x-badge-semanticrelease-link]

<!-- badges-end -->

# @projector-js/plugin-lint

> See the [usage section][1] for more information.

- This opinionated CLI tool checks a Node.js project for correctness. It should
  be run [after the project has been built][2]. TypeScript ([tsc][3]) is used
  for type checking, [ESLint][4] and [Babel][5] for static analysis of
  JavaScript/TypeScript build output, and [Remark][6] and [mdast][7] for
  analysis of Markdown source. Further checks are performed to ensure the
  project is optimally structured and conforms to best practices, including
  detecting when running in a monorepo root vs a polyrepo root vs a sub-root.

---

<!-- remark-ignore-start -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Install](#install)
- [Usage](#usage)
  - [CLI Options](#cli-options)
  - [API](#api)
- [Examples](#examples)
- [Related](#related)
- [Appendix](#appendix)
  - [List of Correctness Checks](#list-of-correctness-checks)
  - [Published Package Details](#published-package-details)
  - [License](#license)
- [Contributing and Support](#contributing-and-support)
  - [Contributors](#contributors)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
<!-- remark-ignore-end -->

## Install

```bash
npm install --save-dev @projector-js/plugin-lint
```

## Usage

Standalone usage:

```bash
npx @projector-js/plugin-lint
```

Or, if configured to work with [Projector][8]:

```bash
npm run lint
```

### CLI Options

Help text (use `--help` to get the most up-to-date version):

```
plugin-lint

Check a project for correctness.

Options:
  --help                  Show help                                    [boolean]
  --version               Show version number                          [boolean]
  --silent                Nothing will be printed to stdout or stderr
                                                      [boolean] [default: false]
  --root-dir              The project root directory containing ESLint and
                          TypeScript configuration files, and that relative
                          paths and globs are resolved against. This must be an
                          absolute path.       [string] [default: process.cwd()]
  --md-path               Absolute paths, relative paths, and/or globs that
                          resolve to one or more markdown files. If a single
                          argument ending in "/" is given, the default glob
                          pattern will be appended to this argument instead.
                             [array] [default: .md files not under node_modules]
  --project               An absolute or relative path to, or file name of, a
                          TypeScript tsconfig.json configuration file. Source
                          paths are determined using this file's "files,"
                          "include," and "exclude" fields with all file
                          extensions recognized by the TypeScript compiler
                          considered.   [string] [default: "tsconfig.lint.json"]
  --pre-push-only         In pre-push mode, a limited subset of checks are
                          performed. Pre-push linting mode is meant to be
                          invoked by the "pre-push" Git hook.
                                                      [boolean] [default: false]
  --link-protection-only  In link protection mode, a limited subset of checks
                          are performed. Link protection linting mode is meant
                          to be invoked after potentially-destructive operations
                          on Markdown files (e.g. via Remark) to check for links
                          that have been accidentally disabled.
                                                      [boolean] [default: false]
```

### API

<!-- TODO -->

#### Importing CLI as a Module

This package can be imported and run directly in source without spawning a child
process or calling a CLI. This is useful for, for instance, composing multiple
[yargs][3]-based CLI tools together or invoking the "link protection"
stand-alone checks.

```typescript
import { configureProgram } from '@projector/plugin-lint';
import { checkForPotentiallyDisabledLinks } from '@projector/plugin-lint/utils';

const { program, parse } = configureProgram();
// `program` is a yargs instance
// `parse` is an async function that will (eventually) call program.parse(...)
await parse(['--help']);

// This package also exposes some of its internal utils for external use
await checkForPotentiallyDisabledLinks();
```

## Examples

<!-- TODO -->

## Related

<!-- TODO -->

## Appendix

Further documentation can be found under [`docs/`][x-repo-docs].

### List of Correctness Checks

Specifically, in addition to type checking and static analysis with tsc and
ESLint, the following checks are performed:

- ⛔ Errors when the project is not a git repository
- ⛔ Errors when the `package.json` file is missing or unparsable
- ⛔ Errors when the `dist` directory or its subdirectories contain
  `.tsbuildinfo` files
- ⛔ Errors when `package.json` does not contain `description`, `homepage`,
  `repository`, `license`, `author`, `engines`, or `type` fields
  - When linting a [monorepo root][9], the check for `description` is skipped
- ⛔ Errors when `package.json` does not contain `name`, `version`, `keywords`,
  `sideEffects`, `exports`, `files`, or `publishConfig` fields
  - When linting a [monorepo root][9], or if the `private` field exists and is
    set to `true`, this check is skipped
- ⛔ Errors when the same dependency appears under both `dependencies` and
  `devDependencies` fields in `package.json`
- ⛔ Errors when `package.json` contains the `files` field but its array is
  missing `"/dist"`, `"/LICENSE"`, `"/package.json"`, or `"/README.md"` elements
- ⛔ Errors when `package.json` is missing the `exports["./package"]` or
  `exports["./package.json"]` fields, or if they point to files that do not
  exist
- ⛔ Errors when missing `LICENSE` or `README.md` files
- ⛔ ⹋ Errors when an unpublished git commit has "fixup" or "mergeme" in its
  subject
  - This is evidence that the commit tree needs to be cleaned up before changes
    are merged upstream!
- ⛔ Errors when any `exports` or `typesVersions` entry points in `package.json`
  point to files that do not exist
- ⛔ ⹋⹋ Errors when any Markdown file matching the provided `--md-path` glob(s)
  contain disabled links
  - This check can be skipped for specific files by setting
    `config['plugin-lint']['link-protection'].ignore = ['relative/path/or/glob']`
    in `package.json`
- ⛔ Errors when depending on a [non-pinned][10] [pre-release][11] package
  version (like `"^x.y.z-alpha.1"`, which should instead be `"x.y.z-alpha.1"`)
  - This is dangerous enough to warrant an error instead of a warning since
    pre-release versions can differ _radically_ from version to version and
    should therefore be pinned
  - Pinned pre-release package versions will still trigger a "pinned package
    version" warning (below), as they should
- ⛔ † Errors when a source file contains an import but does not list the
  imported package in the `package.json` `dependencies`, `peerDependencies`, or
  `optionalDependencies` fields
  - Also checks for unlisted cross-dependencies when linting a monorepo
  - [Self-referential imports][12] are excluded from this check
  - Checks of [type imports][13] additionally consider the `package.json`
    `devDependencies` field
  - Checks of source files ending in `.test.ts` (or any other supported
    extension), source files with `/test/` or `/__test__/` in their path, or
    source files located at a package root additionally consider the
    `package.json` `devDependencies` field. These rules can be _overwritten_ by
    setting
    `config['plugin-lint']['imports'].considerDevDeps = ['relative/path/or/glob']`
    in `package.json`
- ⚠️ Warns when one or more `package.json` files exist at a location that is not
  at the project root or, when linting a monorepo, at a sub-root
  - Non-root `package.json` files can be used to [specify the `type` of `.js`
    files that exist under it in the filesystem tree][14]. Unfortunately, these
    arbitrary `package.json` files are not well-supported by Projector tooling
    yet
- ⚠️ Warns when missing `tsconfig.json`, `tsconfig.docs.json`,
  `tsconfig.eslint.json`, `tsconfig.lint.json`, or `tsconfig.types.json` files
  - When linting a [monorepo root][9], only `tsconfig.json`,
    `tsconfig.lint.json`, and `tsconfig.eslint.json` are checked for existence
  - When linting a [monorepo sub-root][9], only `tsconfig.docs.json`,
    `tsconfig.lint.json`, and `tsconfig.types.json` are checked for existence
- ⚠️ Warns when `package.json` `license` field is not `"MIT"`
- ⚠️ Warns when `package.json` contains an [experimental][15] `version` (i.e.
  `<1.0.0`)
  - This INCLUDES the obsoleted "placeholder" version `0.0.0-development`
- ⚠️ Warns when `package.json` contains the outdated `main`, `module`, `types`,
  or `typesVersions` fields
  - Use `exports` instead
- ⚠️ Warns when `package.json` contains the `engines` field but is missing the
  `engines.node` field, or if it is not set to [the maintained and LTS versions
  of Node.js][16]
  - For example:
    `{ "engines": { "node": "^12.22.0 || ^14.19.0 || ^16.13.0 || >=17.4.0" }}`
    (as of Feb 2022)
- ⚠️ Warns when `package.json` is missing the `scripts` field
- ⚠️ Warns when `package.json` `scripts` field contains a script name equal to
  or starting with any of the following: `test-integration-webpack`,
  `test-integration-browser`, `prepublishOnly`, `postpublish`, `repl`,
  `preinstall`, `postinstall`, `fixup`, `check-types`, or `publishGuard`
- ⚠️ Warns when `package.json` `scripts` field is missing one of the following
  script names: `build`, `build-changelog`, `build-dist`, `build-docs`,
  `build-stats`, `clean`, `format`, `lint`, `lint-all`, `list-tasks`, `prepare`,
  `test`, `test-all`, `test-integration`, `test-repeat-all`, `test-repeat-unit`,
  or `test-unit`
  - When linting a [monorepo root][9], existence checks for the `build`,
    `build-changelog`, `build-dist`, `build-docs`, and `build-stats` script
    names are skipped
    - Exceptions for the `build*` script names will most likely be removed in
      [later versions of Projector][17]
  - When linting a [monorepo sub-root][9], existence checks for the `prepare`
    script name is skipped
  - If a `next.config.js` file exists at the [project root][9], existence checks
    for the following script names are additionally performed: `dev`, `start`,
    `test-e2e`
- ⚠️ Warns when depending on a [pinned][10] package version (like `"x.y.z"`,
  which should instead be `"^x.y.z"`)
  - Use [`package-lock.json`][18] + [`npm ci`][19] if you want to guarantee the
    same dependencies are consistently installed
- ⚠️ Warns when depending on a [dist-tag package version][20] (like `"next"` or
  `"latest"`) instead of a proper semver (like `"~x.y.z"`)
- ⚠️ Warns when `package.json` is missing the
  `config['plugin-build'].docs.entry` field, or if it points to a file that does
  not exist
- ⚠️ ‡ Warns when `README.md` does not contain the standard badge topmatter, or
  when said topmatter is pointing to the wrong package name and/or repo uri
  - When linting a monorepo, what is considered "standard topmatter" changes
    depending on the current working directory being within the [project
    root][9] versus a [sub-root][9]
- ⚠️ ‡ Warns when standard links in `README.md` are missing, or are pointing to
  the wrong package name and/or repo uri
  - When linting a monorepo, what is considered "standard links" changes
    depending on the current working directory being within the [project
    root][9] vs a [sub-root][9]

These additional checks are performed if the current project is a monorepo:

- ⛔ Errors when a sub-root `package.json` file is unparsable
- ⛔ Errors when a package shares the same `package.json` `name` field as
  another package in the monorepo
- ⛔ Errors when an unnamed package shares the same [package-id][9] as another
  unnamed package in the monorepo

These additional checks are performed _except_ when linting a [sub-root][9]:

- ⚠️ Warns when any of the following files are missing:
  - `.codecov.yml`
  - `.editorconfig`
  - `.eslintrc.js`
  - `.gitattributes`
  - `.gitignore`
  - `.prettierignore`
  - `.spellcheckignore`
  - `babel.config.js`
  - `commitlint.config.js`
  - `conventional.config.js`
  - `jest.config.js`
  - `lint-staged.config.js`
  - `webpack.config.js`
  - `prettier.config.js`
  - `CONTRIBUTING.md`
  - `SECURITY.md`
  - `.github/ISSUE_TEMPLATE/BUG_REPORT.md`
  - `.github/ISSUE_TEMPLATE/config.yml`
  - `.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md`
  - `.github/CODE_OF_CONDUCT.md`
  - `.github/CODEOWNERS`
  - `.github/dependabot.yml`
  - `.github/pipeline.config.js`
  - `.github/PULL_REQUEST_TEMPLATE.md`
  - `.github/SUPPORT.md`
- ⚠️ Warns when missing the `release.config.js` file
  - If the `package.json` `private` field exists and is set to `true`, this
    check is skipped
- ⚠️ Warns when missing the `.github`, `.github/ISSUE_TEMPLATE`,
  `.github/workflows`, `.husky`, or `types` directories
- ⚠️ Warns when the contents of `CONTRIBUTING.md`, `SECURITY.md`,
  `.github/SUPPORT.md`, `.github/CODE_OF_CONDUCT.md`,
  `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/BUG_REPORT.md`,
  `.github/ISSUE_TEMPLATE/FEATURE_REQUEST.md`,
  `.github/ISSUE_TEMPLATE/config.yml`, or `.github/dependabot.yml` differ from
  their latest blueprints
- ⚠️ ‡ Warns when `SECURITY.md` or `.github/SUPPORT.md` topmatter is pointing to
  the wrong package name and/or repo uri
- ⚠️ ‡ Warns when standard links in `CONTRIBUTING.md`, `SECURITY.md`, or
  `.github/SUPPORT.md` are pointing to the wrong package name and/or repo uri

These additional checks are performed only if linting a [monorepo root][9]:

- ⛔ Errors when the `package.json` `workspaces` field contains a path that
  points to a directory without a `package.json` file
- ⚠️ Warns when `package.json` contains `dependencies` or `version` fields
  (`0.0.0-monorepo` is allowed)
  - Since the typical [root package of a monorepo][9] is only encountered in
    development, any dependencies should always be `devDependencies`
  - If a `next.config.js` file exists at the [project root][9], this check is
    skipped
- ⚠️ Warns when `package.json` is missing the `private` field or if it is not
  set to `true`
  - Typically, a [monorepo's root package][9] is never published
- ⚠️ Warns when `package.json` is missing the `name` field
- All valid [sub-roots][9] defined in the `package.json` `workspaces` field are
  recursively linted

These additional checks are performed only if linting a [sub-root][9]:

- ⛔ † Errors when a source file contains an import of a package from the same
  monorepo without using the [`pkgverse` alias][21]
  - Using a [`pkgverse` alias][21], which is transformed into a cross-dependency
    import when built for production, allows Jest tests to run using the direct
    source code rather than the build artifacts when working in monorepos
- ⛔ † Errors when a [`pkgverse` alias][21] does not have a matching entry point
  in the `package.json` `exports` field
- ⚠️ Warns when `package.json` is missing the
  `config['plugin-build'].codecov.flag` field
- ⚠️ Warns when `package.json` contains `devDependencies`
  - These should be located in the project root's `package.json` file instead

> † This check is performed using [Babel][5] AST static analysis. Dynamic
> imports and requires are not checked. Files ending in `.js` (when the
> package's `package.json` `type` field equals `"commonjs"`), `.jsx`, `.cjs`,
> `.cts`, and `.d.*` are excluded from these checks.\
> ‡ This check is performed using [mdast-util-from-markdown][7] AST static analysis.\
> ⹋ When in pre-push mode (`--pre-push-only`), only these checks are performed.
> All others are skipped.\
> ⹋⹋ When in link protection mode (`--link-protection-only`), only these checks are
> performed. All others are skipped.

### Published Package Details

This is a [CJS2 package][x-pkg-cjs-mojito] with statically-analyzable exports
built by Babel for Node14 and above.

<details><summary>Expand details</summary>

That means both CJS2 (via `require(...)`) and ESM (via `import { ... } from ...`
or `await import(...)`) source will load this package from the same entry points
when using Node. This has several benefits, the foremost being: less code
shipped/smaller package size, avoiding [dual package
hazard][x-pkg-dual-package-hazard] entirely, distributables are not
packed/bundled/uglified, and a less complex build process.

Each entry point (i.e. `ENTRY`) in [`package.json`'s
`exports[ENTRY]`][x-repo-package-json] object includes one or more [export
conditions][x-pkg-exports-conditions]. These entries may or may not include: an
[`exports[ENTRY].types`][x-pkg-exports-types-key] condition pointing to a type
declarations file for TypeScript and IDEs, an
[`exports[ENTRY].module`][x-pkg-exports-module-key] condition pointing to
(usually ESM) source for Webpack/Rollup, an `exports[ENTRY].node` condition
pointing to (usually CJS2) source for Node.js `require` _and `import`_, an
`exports[ENTRY].default` condition pointing to source for browsers and other
environments, and [other conditions][x-pkg-exports-conditions] not enumerated
here. Check the [package.json][x-repo-package-json] file to see which export
conditions are supported.

Though [`package.json`][x-repo-package-json] includes
[`{ "type": "commonjs" }`][x-pkg-type], note that any ESM-only entry points will
be ES module (`.mjs`) files. Finally, [`package.json`][x-repo-package-json] also
includes the [`sideEffects`][x-pkg-side-effects-key] key, which is `false` for
optimal [tree shaking][x-pkg-tree-shaking].

</details>

### License

See [LICENSE][x-repo-license].

## Contributing and Support

**[New issues][x-repo-choose-new-issue] and [pull requests][x-repo-pr-compare]
are always welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟
this project][x-badge-repo-link] to let me know you found it useful! ✊🏿 Thank
you!

See [CONTRIBUTING.md][x-repo-contributing] and [SUPPORT.md][x-repo-support] for
more information.

### Contributors

See the [table of contributors][x-repo-contributors].

[x-badge-blm-image]: https://xunn.at/badge-blm 'Join the movement!'
[x-badge-blm-link]: https://xunn.at/donate-blm
[x-badge-codecov-image]:
  https://img.shields.io/codecov/c/github/Xunnamius/projector/main?style=flat-square&token=HWRIOBAAPW
  'Is this package well-tested?'
[x-badge-codecov-link]: https://codecov.io/gh/Xunnamius/projector
[x-badge-downloads-image]:
  https://img.shields.io/npm/dm/@projector-js/plugin-lint?style=flat-square
  'Number of times this package has been downloaded per month'
[x-badge-lastcommit-image]:
  https://img.shields.io/github/last-commit/xunnamius/projector?style=flat-square
  'Latest commit timestamp'
[x-badge-license-image]:
  https://img.shields.io/npm/l/@projector-js/plugin-lint?style=flat-square
  "This package's source license"
[x-badge-license-link]: https://github.com/Xunnamius/projector/blob/main/LICENSE
[x-badge-npm-image]:
  https://xunn.at/npm-pkg-version/@projector-js/plugin-lint
  'Install this package using npm or yarn!'
[x-badge-npm-link]: https://www.npmjs.com/package/@projector-js/plugin-lint
[x-badge-repo-link]: https://github.com/xunnamius/projector
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
  https://github.com/xunnamius/projector/issues/new/choose
[x-repo-contributing]: /CONTRIBUTING.md
[x-repo-contributors]: /README.md#contributors
[x-repo-docs]: docs
[x-repo-license]: ./LICENSE
[x-repo-package-json]: package.json
[x-repo-pr-compare]: https://github.com/xunnamius/projector/compare
[x-repo-support]: /.github/SUPPORT.md
[1]: #usage
[2]: /packages/plugin-build
[3]: https://www.npmjs.com/package/typescript
[4]: https://www.npmjs.com/package/eslint
[5]: https://babeljs.io/docs/en/babel-core
[6]: https://www.npmjs.com/package/remark
[7]: https://github.com/syntax-tree/mdast-util-from-markdown
[8]: https://github.com/Xunnamius/projector
[9]: /README.md#terminology
[10]:
  https://dev.to/lucifer1004/it-is-not-always-right-to-pin-your-dependencies-36jg
[11]: https://semver.org#spec-item-9
[12]:
  https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name
[13]:
  https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export
[14]: https://nodejs.org/api/packages.html#determining-module-system
[15]:
  https://semver.org#how-should-i-deal-with-revisions-in-the-0yz-initial-development-phase
[16]: https://endoflife.date/nodejs
[17]:
  https://github.com/Xunnamius/projector#dependency-topology-and-script-concurrency
[18]: https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json
[19]: https://docs.npmjs.com/cli/v8/commands/npm-ci
[20]: https://docs.npmjs.com/cli/v8/commands/npm-dist-tag#description
[21]: /packages/core/src/import-aliases.ts

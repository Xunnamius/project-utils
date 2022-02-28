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

# @projector-js/plugin-lint

> See the [usage section][4] for more information.

This opinionated CLI tool checks a Node.js project for correctness. TypeScript
([tsc][1]) is used for type checking, [ESLint][2] and [Espree][16] for static
analysis of JavaScript/TypeScript source, and [Remark][3] and [mdast][17] for
analysis of Markdown source. Further checks are performed to ensure the project
is optimally structured and conforms to best practices, including detecting when
running in a monorepo root vs a polyrepo root vs a sub-root.

Specifically, in addition to type checking and static analysis with tsc and
ESLint, the following checks are performed:

- ⛔ Errors when the project is not a git repository
- ⛔ Errors when the `package.json` file is missing or unparsable
- ⛔ Errors when the `dist` directory or its subdirectories contain
  `.tsbuildinfo` files
- ⛔ Errors when `package.json` does not contain `description`, `homepage`,
  `repository`, `license`, `author`, `engines`, or `type` fields
  - When linting a [monorepo root][12], the check for `description` is skipped
- ⛔ Errors when `package.json` does not contain `name`, `version`, `keywords`,
  `sideEffects`, `exports`, `typesVersions`, `files`, or `publishConfig` fields
  - When linting a [monorepo root][12], or if the `private` field exists and is
    set to `true`, this check is skipped
- ⛔ Errors when the same dependency appears under both `dependencies` and
  `devDependencies` fields in `package.json`
- ⛔ Errors when `package.json` contains the `files` field but its array is
  missing `"/dist"`, `"/LICENSE"`, `"/package.json"`, or `"/README.md"` elements
- ⛔ Errors when `package.json` is missing the `exports["./package"]` or
  `exports["./package.json"]` field paths, or if they point to files that do not
  exist
- ⛔ Errors when missing `LICENSE` or `README.md` files
- ⛔ ⹋ Errors when an unpublished git commit has "fixup" or "mergeme" in its
  subject
  - This is evidence that the commit tree needs to be cleaned up before changes
    are merged upstream!
- ⛔ Errors when any `exports` entry points in `package.json` point to files
  that do not exist
- ⚠️ Warns when missing `tsconfig.json`, `tsconfig.docs.json`,
  `tsconfig.eslint.json`, `tsconfig.lint.json`, or `tsconfig.types.json` files
  - When linting a [monorepo sub-root][12], only `tsconfig.docs.json`,
    `tsconfig.lint.json`, and `tsconfig.types.json` are checked for existence
- ⚠️ Warns when `package.json` `license` field is not `"MIT"`
- ⚠️ Warns when `package.json` contains an [experimental][5] `version` (i.e.
  `<1.0.0`)
  - This INCLUDES the obsoleted "placeholder" version `0.0.0-development`
- ⚠️ Warns when `package.json` contains the outdated `main`, `module`, or
  `types` fields
  - Use `exports` instead
  - Once TypeScript [ships support for the `types` export condition][6],
    `typesVersions` will be considered "outdated" as well
- ⚠️ Warns when `package.json` contains the `engines` field but is missing the
  `engines.node` field path, or if it is not set to [the earliest maintained LTS
  version of Node.js][7]
  - For example: `{ "engines": { "node": ">=12.22.10" }}` (as of Feb 2022)
- ⚠️ Warns when depending on a [pinned][8] package version (like `"x.y.z"`
  instead of `"^x.y.z"`)
  - Use [`package-lock.json`][9] + [`npm ci`][10] instead
- ⚠️ Warns when depending on a [dist-tag package version][11] (like `"next"` or
  `"latest"`) instead of a proper semver (like `"~x.y.z"`)
- ⚠️ Warns when `package.json` is missing the `config.docs.entry` field path, or
  if it points to a file that does not exist
- ⚠️ ‡ Warns when `README.md` does not contain the standard badge topmatter, or
  when said topmatter is pointing to the wrong package name and/or repo uri
  - When linting a monorepo, what is considered "standard topmatter" changes
    depending on the current working directory being within the [package
    root][12] versus a [project root][12]
- ⚠️ ‡ Warns when standard links in `README.md` are missing, or are pointing to
  the wrong package name and/or repo uri
  - When linting a monorepo, what is considered "standard links" changes
    depending on the current working directory being within the [package
    root][12] vs a [project root][12]

These additional checks are performed if the current project is a monorepo:

- ⛔ Errors when a sub-root `package.json` file is unparsable
- ⛔ Errors when a package shares the same `package.json` `name` field as
  another package in the monorepo
- ⛔ Errors when an unnamed package shares the same [package-id][12] as another
  unnamed package in the monorepo

These additional checks are performed except when linting a [sub-root][12]:

- ⚠️ Warns when any of the following files are missing:
  - `.codecov.yml`
  - `.editorconfig`
  - `.eslintrc.js`
  - `.fossa.yml`
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
  - `.github/workflows/README.md`
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
- ⚠️ ‡ Warns when `SECURITY.md` or `.github/SUPPORT.md` do not contain the
  standard badge topmatter, or when said topmatter is pointing to the wrong
  package name and/or repo uri
- ⚠️ ‡ Warns when standard links in `CONTRIBUTING.md`, `SECURITY.md`, or
  `.github/SUPPORT.md` are missing, or are pointing to the wrong package name
  and/or repo uri

These additional checks are performed only if linting a [monorepo root][12]:

- ⛔ Errors when the `package.json` `workspaces` field contains a path that
  points to a directory without a `package.json` file
- ⚠️ Warns when `package.json` contains `dependencies` or `version` fields
  - Since the typical [root package of a monorepo][12] is only encountered in
    development, any dependencies should always be `devDependencies`
  - If a `next.config.js` file exists, this check is skipped
- ⚠️ Warns when `package.json` is missing the `private` field or if it is not
  set to `true`
  - If a `next.config.js` file exists, this check is skipped
- ⚠️ Warns when `package.json` is missing the `name` field
- All valid [sub-roots][12] defined in the `package.json` `workspaces` field are
  recursively linted

These additional checks are performed only if linting a [sub-root][12]:

- ⛔ † Errors when this package's source imports another package from the same
  monorepo but does not list said package in `package.json` `dependencies` field
  - [Self-referential imports][13] are excluded from this check
- ⚠️ Warns when `package.json` contains `devDependencies`
  - These should be located in the project root's `package.json` file instead

> † This check is performed using [Espree][16] AST static analysis. Dynamic
> imports are not checked.\
> ‡ This check is performed using [mdast-util-from-markdown][17] AST static analysis.\
> ⹋ When in pre-push mode (`--pre-push-only`), only these checks are performed.
> All others are skipped.

## Install

```bash
npm install --save-dev @projector-js/plugin-lint
```

## Usage

Standalone usage:

```bash
npx @projector-js/plugin-lint
```

Or, if configured to work with [Projector][14]:

```bash
npm run lint
```

Help text (use `--help` to get the most up-to-date version):

    plugin-lint

    Check a project for correctness.

    Options:
      --help      Show help                                                [boolean]
      --version   Show version number                                      [boolean]
      --silent    Nothing will be printed to stdout or stderr
                                                          [boolean] [default: false]
      --rootDir   The project root directory containing ESLint and TypeScript
                  configuration files, and that relative paths and globs are
                  resolved against.                [string] [default: process.cwd()]
      --srcPath   Absolute or relative paths that resolve to one or more directories
                  containing source files, or to one or more source files
                  themselves.                           [array] [default: ["./src"]]
      --mdPath    Absolute paths, relative paths, and/or globs that resolve to one
                  or more markdown files.
                  [array] [default: all files ending in .md not under node_modules]
      --project   An absolute or relative path to a TypeScript tsconfig.json
                  configuration file.       [string] [default: "tsconfig.lint.json"]

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
  https://img.shields.io/npm/l/@projector-js/plugin-lint
  "This package's source license"
[link-license]: https://github.com/Xunnamius/projector/blob/main/LICENSE
[badge-fossa]:
  https://app.fossa.com/api/projects/custom%2B27276%2Fgit%40github.com%3AXunnamius%2Fprojector.git.svg?type=large
  "Analysis of this package's license obligations"
[link-fossa]:
  https://app.fossa.com/projects/custom+27276%2Fgit@github.com:Xunnamius%2Fprojector.git
[badge-npm]:
  https://api.ergodark.com/badges/npm-pkg-version/@projector-js/plugin-lint
  'Install this package using npm or yarn!'
[link-npm]: https://www.npmjs.com/package/@projector-js/plugin-lint
[badge-semantic-release]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
  'This repo practices continuous integration and deployment!'
[link-semantic-release]: https://github.com/semantic-release/semantic-release
[badge-size]: https://badgen.net/bundlephobia/minzip/@projector-js/plugin-lint
[badge-tree-shaking]:
  https://badgen.net/bundlephobia/tree-shaking/@projector-js/plugin-lint
  'Is this package optimized for Webpack?'
[link-bundlephobia]:
  https://bundlephobia.com/result?p=@projector-js/plugin-lint
  'Package size (minified and gzipped)'
[docs]: docs
[choose-new-issue]: https://github.com/xunnamius/projector/issues/new/choose
[pr-compare]: https://github.com/xunnamius/projector/compare
[contributing]: /CONTRIBUTING.md
[support]: /.github/SUPPORT.md
[1]: https://www.npmjs.com/package/typescript
[2]: https://www.npmjs.com/package/eslint
[3]: https://www.npmjs.com/package/remark
[4]: #usage
[5]:
  https://semver.org/#how-should-i-deal-with-revisions-in-the-0yz-initial-development-phase
[6]:
  https://github.com/microsoft/TypeScript/issues/33079#issuecomment-1040634703
[7]: https://endoflife.date/nodejs
[8]:
  https://dev.to/lucifer1004/it-is-not-always-right-to-pin-your-dependencies-36jg
[9]: https://docs.npmjs.com/cli/v8/configuring-npm/package-lock-json
[10]: https://docs.npmjs.com/cli/v8/commands/npm-ci
[11]: https://docs.npmjs.com/cli/v8/commands/npm-dist-tag#description
[12]: /README.md#terminology
[13]:
  https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name
[14]: https://github.com/Xunnamius/projector
[15]: /packages/eslint-plugin
[16]: https://www.npmjs.com/package/espree
[17]: https://github.com/syntax-tree/mdast-util-from-markdown

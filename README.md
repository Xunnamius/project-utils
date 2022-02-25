<!-- prettier-ignore-start -->

<!-- badges-start -->

[![Black Lives Matter!][badge-blm]][link-blm]
[![Last commit timestamp][badge-last-commit]][link-repo]
[![Open issues][badge-issues]][link-issues]
[![Pull requests][badge-pulls]][link-pulls]
[![Maintained with Projector][badge-projector]][link-projector]
[![Uses semantic-release][badge-semantic-release]][link-semantic-release]

<!-- badges-end -->

<!-- prettier-ignore-end -->

# 📽️ Projector

> 🚧 **EXPERIMENTAL** 🚧 Though I use it as a Lerna replacement, **Projector is
> still very much in its infancy**! Check out the [public roadmap][72] to see
> the lay of things. What follows is [RDD][79] 🙂

Projector is a lightweight monorepo _and_ polyrepo management toolkit with a
focus on simplicity, flexibility, and performance. It's built around
[semantic-release][2], [conventional-changelog][3], and
[conventional-commits][4] for commit-based automated release flows and
(optionally) [GitHub Actions][5] and [Dependabot][6] for [CI][7]/[CD][8]. It
supports task concurrency and, for monorepos, [topologically ordered][42]
execution and [cross-dependency version coherence][38] during release.

Projector leans on as much native npm functionality and popular tooling as
possible. This means **your project is never locked-in to using Projector**;
there are no bootstrapping commands, no custom linking, no sprawling "Projector
config file," no repository commit count limits, nor any reinventions of the
features that git, npm, semantic-release, conventional-changelog, and other
tooling already provide.

In this way, **Projector tries to avoid being Yet Another Thing you have to
learn.** If you know how to use git, npm, and semantic-release, you're already
90% there. Combined with [life cycle plugins][40], Projector is flexible enough
to integrate with most JS projects—be it authoring a library, building a
serverless or JAMstack app, bundling a CLI tool, etc.

[See what Projector can do for you][41], or just [jump right in!][74]

---

- [Feature Overview][83]
  - [CLI Examples][41]
- [System Requirements][46]
- [Installation][47]
  - [CLI][48]
  - [Shared Configurations][49]
  - [GitHub Action][50]
  - [semantic-release Plugin][51]
  - [Library][52]
- [Terminology][42]
- [Usage][45]
  - [Getting Started][74]
    - [Cross-Dependency Version Coherence][38]
  - [CLI Command Glossary][70]
  - [Projector Project Structure][90]
    - [Monorepo Structure][44]
  - [Dependency Topology and Script Concurrency][75]
  - [Template Repositories][69]
    - [Pre-made Templates (Lenses)][13]
  - [Life Cycle Scripts (Plugins)][40]
  - [Badge Swag][71]
- [Documentation][53]
  - [Credits][99]
  - [License][54]
- [Contributing and Support][55]

## Feature Overview

- Compatible with new and existing projects.
- Presents a unified interface for both polyrepo (normal repos) and monorepo
  management.
- Built on popular open source tooling.
  - Projector's core feature set relies on git, npm, and semantic-release.
  - Projector provides several [opinionated pre-made configurations and
    plugins][49] for TypeScript, webpack, Babel, Jest, and other tools, but you
    can (and should) easily substitute your own.
  - Projector uses [lage][76], [backfill][77], and [Threads.js][86] for
    topologically-ordered concurrent script/task execution and output caching.
    See the [Dependency Topology and Script Concurrency][75] section for
    details.
  - Projector uses [glob][80] for easy workspace selection, [debug][15] for
    debugging support, [npm-check-updates][12] to selectively update
    dependencies, and [Inquirer.js][87] to gather input.
- Turnkey support for Continuous Integration and Deployment with
  [`projector-pipeline`][14].
- Supports deep customizations through simple npm-esque [life cycle
  plugins][40].
  - Projector will call an [npm script][39] (à la `npm run an-npm-script`) with
    a [well-defined name][62], if it exists, whenever an interesting event
    occurs.
- Robust [debugging output][15] available on demand.
  - Set `DEBUG=projector` to enable debug output when running Projector.
  - Set `DEBUG=projector:<projector-package-id>` to view debug output from a
    single Projector package.
    - `<projector-package-id>` must be the name of a directory [listed
      here][20]. For example: `DEBUG=projector:config-babel`.
  - Set `DEBUG=projector:all` (or `DEBUG=projector:<projector-package-id>:all`)
    to view all possible debug output Projector generates, including extra
    information that is normally hidden (potentially _very_ verbose).

### CLI Examples

> See [`@projector-js/cli`][22] for all available CLI commands and their
> options.

> [Like npm][88], the `-w` option, short for "workspace," matches against 1) an
> exact path or parent path in the [`workspaces` config][56] or 2) an exact
> workspace [`name`][89]. _Unlike_ npm, `-w` also supports [glob][80] matching
> against the aforesaid paths and `name`s. For example, `-w '*pkg*'` will match
> workspaces with `name` "some-pkg-1" and "another-pkg-2" in their
> `package.json` files. The `-ws` option is supported as well.

> Commands executed _concurrently_ can be run in topological order, in simple
> parallel, or sequentially (no concurrency) depending on CLI arguments. See the
> [Dependency Topology and Script Concurrency][75] section for details.

- Build one, some, or all workspaces concurrently.
  > `projector build -w pkg-1`\
  > `projector build -w pkg-1 -w pkg-2`\
  > `projector build -w 'pkg-*'`\
  > `projector build -ws`\
  > `projector build`
- Test one, some, or all workspaces concurrently.
  > `projector test some-specific-test`\
  > `projector test --coverage --collectCoverageFrom 'src/**/*.ts' some-test`\
  > `projector test`
- Release from one, some, or all workspaces concurrently (including
  [cross-dependency version coherence][38] for monorepos).
  > `projector publish -w pkg-1`\
  > `projector publish -w pkg-1 -w pkg-2 -w pkg-3`\
  > `projector publish -ws`\
  > `projector publish`
- Run npm scripts within one, some, or all workspaces concurrently.
  > `projector run -w pkg-1 script-in-workspace`\
  > `projector run -w pkg-1 -w pkg-2 script-in-workspace`\
  > `projector run -ws script-in-some-workspaces --parallel --if-present`\
  > `projector run script-at-root-only`
- Run arbitrary npm commands within one, some, or all workspaces.
  > `projector -w pkg-1 npm info`\
  > `projector -w pkg-1 -w pkg-2 npm list --depth=1`\
  > `projector -ws npm audit`\
  > `projector npm show`
- Manage both individual and shared dependencies across workspaces.
  > `projector install -w pkg-1`\
  > `projector install -w pkg-1 -w pkg-2`\
  > `projector install -w 'pkg-*' -w my-workspace installed-1 installed-2`\
  > `projector install -ws install-to-every-workspace`\
  > `projector install --save-dev install-to-root`\
  > `projector uninstall -w pkg-1 installed-2`\
  > `projector uninstall -ws uninstall-from-every-workspace`
- [Update the dependencies of][12] one, some, or all workspaces, optionally
  committing the updates by type (e.g. `devDependencies`, `peerDependencies`,
  etc).
  > `projector update -w packages/pkg-1`\
  > `projector update -w ./packages/pkg-1 -w pkg-2`\
  > `projector update --no-commits -w pkg-1 -w pkg-3`\
  > `projector update --doctor -ws`\
  > `projector update`
- Create new projects from scratch, or from a [custom template][13].
  > `projector create new-project-name`\
  > `projector create --monorepo`\
  > `projector create new-proj-name --using /some/path/to/template`\
  > `projector create --using https://github.com/u/some-repo`
- Add new workspaces when the current working directory is a monorepo root.
  > `projector create new-package`\
  > `projector create --at relative/path/to/package/root`\
  > `projector create @scoped/new-package --using /some/path/to/template`\
  > `projector create new-package --using https://github.com/u/some-repo`
- Rename/move workspaces, updating metadata where necessary and optionally
  executing a regex-powered "find and replace" across the source.
  > `projector rename -w pkg-1 --to-name a-new-name --to-path new/pkg/root`\
  > `projector rename -w pkg-1 --to-name a-new-name --find-and-replace`\
  > `projector rename --to-name new-name-at-root-pkg-json`
- List project and workspace metadata (especially useful for monorepos).
  > `projector list`

## System Requirements

- At the moment, Projector is only guaranteed to work on Linux (Ubuntu) systems.
  It likely works on any unix-based OS. Projector has not been tested on Windows
  or [WSL][16], though it should work with the latter. Full Windows support may
  be considered in the future.
- At the moment, Projector only works with npm. It is likely a short jump to
  enabling Yarn and/or pnpm support and this may be considered in the future.
- Projector requires an [actively maintained][17] version of [Node.js and
  npm][18] be installed.
- Projector requires [Git][19] be installed.
- See [each individual package][20]'s documentation for further requirements.

## Installation

There are several ways to utilize Projector: as a _CLI tool or npm script_, as a
source of _shared configuration_, as a _GitHub Action_, as a _semantic-release
plugin_, and as an _imported library_.

See [Getting Started][74] for details on how to use the various components that
make up Projector.

### CLI

Install the [omnibus Projector package][21] locally:

```shell
npm install --save-dev projector-js
```

To avoid prefixing every command with `npx projector`, you can install
[Projector's CLI package][22] globally:

```shell
npm install -g @projector-js/cli
```

This makes the `p` and `projector` commands available in your system's PATH.

### Shared Configurations

The following tweakable (but opinionated) tooling configurations are available
for Projector projects. See each individual package's documentation for details.

- Babel ([`@projector-js/config-babel`][23])
- commitlint ([`@projector-js/config-commitlint`][24])
- conventional-changelog ([`@projector-js/config-conventional-changelog`][25])
- ESLint ([`@projector-js/config-eslint`][26])
- Husky ([`@projector-js/config-husky`][65])
- Jest ([`@projector-js/config-jest`][27])
- lint-staged ([`@projector-js/config-lint-staged`][28])
- Next.js ([`@projector-js/config-next`][29])
- Prettier ([`@projector-js/config-prettier`][30])
- semantic-release-atam ([`@projector-js/config-semantic-release-atam`][31])
- TSConfig ([`@projector-js/config-tsconfig`][32])
- webpack ([`@projector-js/config-webpack`][33])

[Unless you're using a monorepo][44], these configurations are entirely optional
and should only be used if you don't already have your own tooling stack
configured. See [Projector Project Structure][90] for more details.

Additionally, several opinionated [life cycle plugins][40] are available. Since
plugins are low overhead and _extremely_ easy to create (you don't even have to
make a new file), you'll likely want to [write your own][40] instead.

- [`@projector-js/plugin-build`][91]
- [`@projector-js/plugin-clean`][92]
- [`@projector-js/plugin-dev`][93]
- [`@projector-js/plugin-format`][94]
- [`@projector-js/plugin-github`][95]
- [`@projector-js/plugin-lint`][61]
- [`@projector-js/plugin-list`][96]
- [`@projector-js/plugin-list-types`][63]
- [`@projector-js/plugin-metrics`][64]
- [`@projector-js/plugin-prepare`][97]
- [`@projector-js/plugin-sync-files`][66]
- [`@projector-js/plugin-sync-vercel`][67]
- [`@projector-js/plugin-test`][98]

### GitHub Action

See [`projector-pipeline`][14].

### semantic-release Plugin

For monorepos, the semantic-release plugin enforces cross-dependency version
coherence and topological ordering during the release cycle. **Installing this
plugin is required when publishing monorepo packages using Projector**.

First, install the plugin:

```shell
npm install --save-dev @projector-js/semantic-release-plugin
```

Then, add the plugin to your [`release.config.js`][73] configuration file:

```javascript
{
  ...
  plugins: [
    ...
    ['@projector-js/semantic-release-plugin', { ... }],
    ...
  ],
  ...
}
```

See [`@projector-js/semantic-release-plugin`][34] for more details.

### Library

Projector's core functionality can be invoked programmatically if desired.

First, install `@projector-js/core`:

```shell
npm install @projector-js/core
```

Then import it:

```typescript
import { getEslintAliases() } from '@projector-js/core/import-aliases';

console.log(getEslintAliases());
```

See [`@projector-js/core`][35] for details.

## Terminology

- **polyrepo**: a git repository containing a root `package.json` file with no
  [`workspaces`][56] field. A polyrepo is the opposite of a _monorepo_.
- **monorepo**: a git repository containing multiple packages/workspaces, each
  listed under the [`workspaces`][56] field in the root `package.json`. A
  monorepo is the opposite of a _polyrepo_.
- **project root**: the top-level directory of a git repository and Projector
  project; it contains the root `package.json` file. This directory is also
  referred to as: "repository root," `rootDir` (always as an absolute path),
  "root package" (in [npm documentation][56]), "monorepo/polyrepo/repo root," or
  simply "root" (.e.g. "root `package.json`").
- **package root**: synonymous with a [workspace][56] in a monorepo. It contains
  a package/workspace's `package.json` file. The basename of this directory
  (e.g. `c` in `/a/b/c/`) is also referred to as the `package-id`, which may or
  may not match the `name` field in the package's `package.json` file. These
  directories are also referred to as a "monorepo package" or simply "sub-root"
  (.e.g. "sub-root `package.json`").
- [**topological order**][81]: a sequence of packages where dependent packages
  always come before their dependencies—a so-called "package dependency order".
  Topological ordering ensures otherwise-concurrent tasks are performed at the
  right time and order (e.g. regenerate types in a core package before linting
  its dependent packages). [Here's an illustrated example][82].

## Usage

To use Projector, you must first [install the CLI][48].

From there, you can use [`projector create`][100] to create a new monorepo or
polyrepo if you want. See [Getting Started][74] to walk through inspecting,
testing, and publishing an existing monorepo instead.

If you don't already have your own tooling setup, [pre-made configurations][49]
can be used to configure their respective tools, and are easily tweaked. For
example, `@projector-js/config-eslint` can be used in `.eslintrc.js` like so:

```javascript
module.exports = require('@projector-js/config-eslint')((config) => {
  return {
    ...config,
    // ? Tweak the overrides key in the shared config
    overrides: [
      {
        files: ['*.test.*'],
        extends: ['plugin:jest/all', 'plugin:jest/style'],
        rules: {
          'jest/lowercase': 'off',
          'jest/consistent-test-it': 'off'
        }
      }
    ]
  };
});
```

If your project is a monorepo, you'll have to use [semantic-release-atam][2]
(PRs pending) and the [semantic-release plugin][51] **instead of** the normal
semantic-release. semantic-release-atam is a drop-in replacement for
semantic-release. Additionally, if you're using conventional-changelog, consider
using [the version patched to work better with monorepos][25] (PRs pending)
instead.

Projector's primary job is to run npm scripts at the right time; [Projector
plugins][49] are portable plug and play npm scripts. See [Life Cycle Scripts
(plugins)][40] for details on Projector's plugin system. And since they're just
npm scripts with a fancy name, plugins are easy to author yourself, even
directly in the relevant `package.json` file (no new file needed).

For example, the `@projector-js/plugin-build` and `@projector-js/plugin-format`
plugins can be added to package via `package.json`:

```javascript
{
  "name": "@my-monorepo/pkg",
  "version": "2.5.8",
  ...
  "scripts": {
    "build": "npm run build-dist --",
    "build-changelog": "plugin-build changelog",
    "build-dist": "plugin-build dist",
    "build-docs": "plugin-build docs",
    "format": "plugin-format"
    ...
  },
  ...
}
```

If you're pushing to GitHub and using GitHub Actions, you can optionally set up
CI/CD for your project using Projector's [GitHub Action][50].

Finally, you can optionally setup [advanced concurrent task pipelines and
caching][75], if desired.

### Getting Started

You can use [`projector create`][22] to initialize a new project, but suppose we
already have a monorepo we've been working on at `/repos/my-project`. It has the
following structure:

<details><summary>Expand Example</summary>
<p>

    .
    ├── .git
    ├── package.json
    ├── package-lock.json
    ├── packages/
    │   ├── pkg-1/
    │   │   ├── package.json
    │   │   ├── README.md
    │   │   └── src/
    │   └── pkg-2/
    │       ├── package.json
    │       ├── README.md
    │       └── src/
    ├── test/
    ├── README.md
    └── release.config.js

`package.json`:

```javascript
{
  "name": "my-cool-monorepo",
  "workspaces": ["packages/pkg-1", "packages/pkg-2"],
  "scripts": {
    "test": "jest --coverage --collectCoverageFrom '**/src/**/*.js' general-tests",
    ...
  },
  ...
}
```

`packages/pkg-1/package.json`:

```javascript
{
  "name": "pkg-1",
  "version": "1.1.2",
  ...
}
```

`packages/pkg-2/package.json`:

```javascript
{
  "name": "@my-namespace/pkg",
  "version": "3.0.1",
  "dependencies": {
    "@my-namespace/core": "1.1.2",
    ...
  },
  ...
}
```

`git tag`:

```shell
$ git tag | cat
pkg-1@1.0.0
pkg-2@1.0.0
pkg-2@2.0.0
pkg-2@2.1.0
pkg-1@1.1.0
pkg-1@1.1.1
pkg-2@3.0.0
pkg-1@1.1.2
pkg-2@3.0.1
```

> Note how tag structure is based on [`package-id`][42] rather than the name of
> the package. This is [configurable][25].

</p>
</details>

After [installing Projector's CLI][47], we can list information about the
project.

<details><summary>Expand Example</summary>
<p>

```shell
$ projector list
Monday, Nov 29, 2021, 12:02:59.556 PM PST
[12:02:59.578 PM] [projector] › »  Listing project metadata
M my-cool-monorepo@ /repos/my-project [⇡»✘!?]
├── pkg-1@1.1.2 (⬆1.2.0) [✘!]
└── @my-namespace/pkg@3.0.1 [?]
```

This tells us that:

- The project is a monorepo (`M`) rather than a polyrepo (`P`)
- The project is named "my-cool-monorepo"
- The project's root (`rootDir`) is at `/repos/my-project`
- The root `package.json` does not list a version
- [git status][36] reports the project is ahead of the current remote branch
  (`⇡`), has renamed files (`»`), has deleted files (`✘`), has unstaged changes
  (`!`), and has untracked changes (`?`). See [the full list of status
  symbols][37].\
  ㅤ
- The latest release of `pkg-1` is `1.1.2` (taken from `version` field).
- If `projector publish` is run, the next released version of `pkg-1` will be
  `1.2.0`
- [git status][36] reports the `packages/pkg-1` directory has deleted files
  (`✘`) and unstaged changes (`!`).\
  ㅤ
- The latest release of `@my-namespace/pkg` is `3.0.1` (taken from `version`
  field).
- If `projector publish` is run, no new release of `@my-namespace/pkg` will be
  made.
- [git status][36] reports the `packages/pkg-2` directory has untracked changes
  (`?`).

</p>
</details>

Next, we'll rename `pkg-1` to `@my-namespace/core`.

<details><summary>Expand Example</summary>
<p>

```shell
$ projector rename -w pkg-1 --to-name @my-namespace/core --find-and-replace
Monday, Nov 29, 2021, 12:03:01.981 PM PST
[12:03:02.013 PM] [projector] › »  Renaming "pkg-1" (at packages/pkg-1) to "@my-namespace/core" (at packages/pkg-1)
[12:03:02.040 PM] [projector] › ℹ  Update "name" field in packages/pkg-1/package.json
[12:03:02.040 PM] [projector] › ℹ  Update "name" field in packages/pkg-1/package.json
[12:03:02.059 PM] [projector] › ℹ  Find all strings matching /^pkg-1$/ and replace with "@my-namespace/core"
[12:03:02.123 PM] [projector] [find-replace] › ℹ  2 replacements in README.md
[12:03:02.248 PM] [projector] [find-replace] › ℹ  7 replacements in packages/pkg-1/README.md
[12:03:02.359 PM] [projector] › ℹ  Rebuild node_modules

added 2 packages, and audited 47 packages in 1s

7 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
[12:03:03.222 PM] [projector] › ✔ Rename successful
```

> If you've used [semantic-release][2] before, the output style should look very
> familiar.

`packages/pkg-1/package.json`:

```javascript
{
  "name": "@my-namespace/core",
  "version": "1.1.2",
  ...
}
```

</p>
</details>

Let's run `projector list` again.

<details><summary>Expand Example</summary>
<p>

```shell
$ projector list
Monday, Nov 29, 2021, 12:04:20.420 PM PST
[12:04:20.442 PM] [projector] › »  Listing project metadata
M my-cool-monorepo@ /repos/my-project [⇡»✘?]
├── @my-namespace/core@1.1.2 (⬆1.2.0) [?]
└── @my-namespace/pkg@3.0.1 [?]
```

</p>
</details>

While `@my-namespace/core` is technically a new package, the next release
version will be `1.2.0` since its `package-id` has not changed. If we'd updated
`@my-namespace/core`'s path too ([or used a different `tagFormat` setting][25]),
the `package-id` would be different and the next release version would be
`1.0.0` regardless of what version is listed in `package.json`.

We can run `npm show` in the `packages/pkg-1` directory to prove
`@my-namespace/core` has not yet been published.

<details><summary>Expand Example</summary>
<p>

```shell
$ projector -w pkg-1 npm show
Monday, Nov 29, 2021, 12:05:12.911 PM PST
[12:05:12.978 PM] [projector] › »  Executing command (at packages/pkg-1) npm show
npm ERR! code E404
npm ERR! 404 Not Found - GET https://registry.npmjs.org/@my-namespace%2fcore - Not found
npm ERR! 404
npm ERR! 404  '@my-namespace/core@latest' is not in this registry.
npm ERR! 404 You should bug the author to publish it (or use the name yourself!)
npm ERR! 404
npm ERR! 404 Note that you can also install from a
npm ERR! 404 tarball, folder, http url, or git url.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/user/.npm/_logs/2021-11-29T21_54_47_723Z-debug.log
[12:05:13.117 PM] [projector] › ✖ Failed to execute command
```

> Note how we can use `-w` to refer to a package by its `package-id` regardless
> of its `name`; `-w '**/core'`, `-w @my-namespace/core`, `-w '**/pkg-1'`, and
> `-w packages/pkg-1` would also have worked.

</p>
</details>

When we did the find-and-replace on `pkg-1` earlier, it updated the source at
`packages/pkg-2/src/...`. Suppose we also added `@my-namespace/core` as a
dependency of `@my-namespace/pkg`. Let's commit all changes, run unit tests on
`@my-namespace/pkg`, and release both packages.

<details><summary>Expand Example</summary>
<p>

```shell
$ git add packages

$ git commit -S -m 'update package structure'
[main 6ff080e] update package structure
 ...

$ projector test p2-tests
Monday, Nov 29, 2021, 12:07:47.776 PM PST
[12:07:47.780 PM] [projector] › »  Executing command (at root) npm test p2-tests

> test
> jest --coverage --collectCoverageFrom '**/src/**/*.js' general-tests "p2-tests"

 PASS  test/general-tests-1.test.js
 PASS  test/general-tests-2.test.js
 PASS  test/general-tests-3.test.js
 PASS  test/p2-tests.test.js
 PASS  test/p2-tests-integration.test.js
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------|---------|----------|---------|---------|-------------------
...
----------|---------|----------|---------|---------|-------------------

Test Suites: 5 passed, 5 total
Tests:       1 todo, 31 passed, 32 total
Snapshots:   0 total
Time:        0.58 s, estimated 1 s
Ran all test suites.
[12:07:48.336 PM] [projector] › ✔ Tests completed successfully
```

> Note that the `test` command—unlike `build`, `publish`, or `run`—relies on the
> underlying test framework (Jest in this case) to deal with concurrency. All
> arguments after "test" will be passed as-is to the underlying test framework.

```shell
$ projector publish -ws
Monday, Nov 29, 2021, 12:07:55.101 PM PST
[12:07:55.123 PM] [projector] › »  Publishing all packages
[12:07:55.130 PM] [projector] › ℹ  Publishing package "@my-namespace/core" at packages/pkg-1
[12:07:55 PM] [semantic-release] › ℹ  Running semantic-release version 18.0.0
...
[12:07:55 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analysis of 104 commits complete: minor release
...
[12:08:14 PM] [semantic-release] [@semantic-release/npm] › ℹ  Publishing version 1.2.0 to npm registry on dist-tag latest
npm notice
npm notice 📦  @my-namespace/core@1.2.0
npm notice === Tarball Contents ===
npm notice 3.7kB README.md
...
npm notice 3.5kB package.json
npm notice === Tarball Details ===
npm notice name:          @my-namespace/core
npm notice version:       1.2.0
npm notice filename:      @my-namespace/core-1.2.0.tgz
npm notice package size:  7.2 kB
npm notice unpacked size: 25.8 kB
npm notice shasum:        ...
npm notice integrity:     ...
npm notice total files:   14
npm notice
+ @my-namespace/core@1.2.0
[12:08:16 PM] [semantic-release] [@semantic-release/npm] › ℹ  Published @my-namespace/core@1.2.0 to dist-tag @latest on https://registry.npmjs.org/
...
[12:08:16 PM] [semantic-release] [@semantic-release/github] › ℹ  Published GitHub release: ...
...
[12:08:49 PM] [semantic-release] › ✔  Published release 1.2.0 on default channel
[12:08:49.371 PM] [projector] › ℹ  Publishing package "@my-namespace/pkg" at packages/pkg-2
[12:07:55.481 PM] [semantic-release] › ℹ  Running semantic-release version 18.0.0
...
[12:07:55 PM] [semantic-release] [@semantic-release/commit-analyzer] › ℹ  Analysis of 122 commits complete: patch release
...
[12:08:15 PM] [semantic-release] [@semantic-release/npm] › ℹ  Publishing version 3.0.2 to npm registry on dist-tag latest
npm notice
npm notice 📦  @my-namespace/pkg@3.0.2
npm notice === Tarball Contents ===
npm notice 7.3kB README.md
...
npm notice 5.3kB package.json
npm notice === Tarball Details ===
npm notice name:          @my-namespace/pkg
npm notice version:       3.0.2
npm notice filename:      @my-namespace/pkg-3.0.2.tgz
npm notice package size:  10.6 kB
npm notice unpacked size: 44.8 kB
npm notice shasum:        ...
npm notice integrity:     ...
npm notice total files:   6
npm notice
+ @my-namespace/pkg@3.0.2
[12:08:16 PM] [semantic-release] [@semantic-release/npm] › ℹ  Published @my-namespace/pkg@3.0.2 to dist-tag @latest on https://registry.npmjs.org/
...
[12:08:16 PM] [semantic-release] [@semantic-release/github] › ℹ  Published GitHub release: ...
...
[12:08:49 PM] [semantic-release] › ✔  Published release 3.0.2 on default channel
[12:08:49.891 PM] [projector] › ✔ Released 2 packages successfully
```

</p>
</details>

#### Cross-Dependency Version Coherence

Let's run `projector list` a final time, but with the `--with-cross-deps`
argument.

<details><summary>Expand Example</summary>
<p>

```shell
$ projector list --with-cross-deps
Monday, Nov 29, 2021, 12:09:00.333 PM PST
[12:09:00.424 PM] [projector] › »  Listing project metadata
M my-cool-monorepo@ /repos/my-project
├── @my-namespace/core@1.2.0
└─┬ @my-namespace/pkg@3.0.2
  └── @my-namespace/core@1.2.0 🔗
```

</p>
</details>

Calling `projector list` with `--with-cross-deps` reveals _cross-dependencies_
(🔗), which are packages depended upon by other packages in the same monorepo.

Since `projector publish` 1) publishes packages [concurrently where possible,
but ultimately in topological order][75] and 2) synchronizes cross-dependency
versions at publish time: as Projector published `@my-namespace/core` at version
`1.2.0`, it automatically updated the `dependencies['@my-namespace/core']` field
at `packages/pkg-2/package.json` from `"1.1.2"` to `"1.2.0"` and committed the
change. Later, Projector published `@my-namespace/pkg` at version `3.0.2`, which
included the updated cross-dependency. This is so-called "cross-dependency
version coherence".

`packages/pkg-2/package.json`:

<details><summary>Expand Example</summary>
<p>

```javascript
{
  "name": "@my-namespace/pkg",
  "version": "3.0.2",
  "dependencies": {
    "@my-namespace/core": "1.2.0",
    ...
  },
  ...
}
```

</p>
</details>

### CLI Command Glossary

See [`@projector-js/cli`][22].

### Projector Project Structure

All Projector projects require at least the following:

- A `package.json` file at the root of the repository.
  - Projector assumes a project is a polyrepo if the root `package.json` file
    does not contains a [`workspaces`][56] field.

That's it. TypeScript, Babel, semantic-release, etc are all yours to setup as
you please, or you can use a [tweakable pre-made configuration][49].

<!-- prettier-ignore-start -->

If your repository is using annotated tags, consider using
[semantic-release-atam][2], which is a semantic-release fork with
***a***nnotated ***t***ag ***a***nd ***m***onorepo support (PRs pending). **Do
not install semantic-release and semantic-release-atam at the same time!**

<!-- prettier-ignore-end -->

**Example**

<details><summary>Expand Example</summary>
<p>

    .
    ├── .git
    ├── package.json         <==
    ├── package-lock.json
    ├── src/
    └── README.md

`package.json`:

```javascript
{
  "name": "my-cool-package",
  "version": "1.0.0",
  ...
}
```

</p>
</details>

#### Monorepo Structure

Monorepos additionally require the following:

- A [`workspaces`][56] field in the root `package.json` file.
  - A `package.json` file with at least a `name` field must exist at each
    package root.
- [semantic-release-atam][2] installed (**and the original semantic-release not
  installed**).
  - semantic-release-atam is a drop-in replacement for semantic-release with
    added support for annotated tag and monorepo (ATAM).
  - semantic-release-atam installation and configuration must meet the minimum
    requirements listed in [`@projector-js/config-semantic-release-atam`][31].
  - [`@projector-js/semantic-release-plugin`][51] must also be installed and
    configured.

Note that ["fixed," "locked," or "synchronized"][102] package versions, where
every package maintains the same version number on every release, goes against
the purpose of semantic-release and so is not currently supported.

**Example**

<details><summary>Expand Example</summary>
<p>

    .
    ├── .git
    ├── package.json         <==
    ├── package-lock.json
    ├── packages/
    │   ├── pkg-1/
    │   │   ├── package.json <==
    │   │   ├── README.md
    │   │   └── src/
    │   └── pkg-2/
    │       ├── package.json <==
    │       ├── README.md
    │       └── src/
    ├── release.config.js    <==
    └── README.md

`package.json`:

```javascript
{
  "name": "my-cool-monorepo",
  "workspaces": ["packages/pkg-1", "packages/pkg-2"],
  ...
}
```

`packages/pkg-1/package.json`:

```javascript
{
  "name": "pkg-1",
  "version": "1.0.0",
  ...
}
```

`packages/pkg-2/package.json`:

```javascript
{
  "name": "pkg-2",
  "version": "1.0.0",
  ...
}
```

</p>
</details>

### Dependency Topology and Script Concurrency

<!-- TODO -->

### Template Repositories

<!-- TODO -->

#### Pre-made Templates (Lenses)

<!-- TODO -->

### Life Cycle Scripts (Plugins)

<!-- TODO -->

### Badge Swag

Like Lerna and semantic-release, Projector too has a badge!

[![Maintained with Projector][60]][link-projector]

```markdown
[![Maintained with Projector](https://xunn.at/badge-projector)](https://github.com/Xunnamius/projector)
```

## Documentation

See [each package][1] for further information on the types they make available
and other specifics.

### Credits

Projector is a tool I made for my own personal use. It was inspired by the pure
awesomeness that is [Lerna][11], [Rush][84], and [Nx][85].

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
[badge-fossa]:
  https://app.fossa.com/api/projects/custom%2B27276%2Fgit%40github.com%3AXunnamius%2Fprojector.git.svg?type=large
  "Analysis of this package's license obligations"
[link-fossa]:
  https://app.fossa.com/projects/custom+27276%2Fgit@github.com:Xunnamius%2Fprojector.git
[badge-semantic-release]:
  https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
  'This repo practices continuous integration and deployment!'
[link-semantic-release]: https://github.com/semantic-release/semantic-release
[badge-projector]:
  https://xunn.at/badge-projector
  'This repo is managed with Projector'
[link-projector]: https://github.com/Xunnamius/projector
[choose-new-issue]: https://github.com/xunnamius/projector/issues/new/choose
[pr-compare]: https://github.com/xunnamius/projector/compare
[contributing]: CONTRIBUTING.md
[support]: .github/SUPPORT.md
[1]: /packages
[2]: https://github.com/Xunnamius/semantic-release-atam
[3]: https://github.com/Xunnamius/conventional-changelog
[4]: https://www.conventionalcommits.org/en/v1.0.0
[5]: https://github.com/features/actions
[6]:
  https://github.blog/2020-06-01-keep-all-your-packages-up-to-date-with-dependabot/
[7]: https://en.wikipedia.org/wiki/Continuous_integration
[8]: https://en.wikipedia.org/wiki/Continuous_deployment
[9]: https://docs.npmjs.com/cli/v7/commands/npx
[10]: https://jestjs.io
[12]: https://www.npmjs.com/package/npm-check-updates
[13]: #pre-made-templates-lenses
[14]: https://github.com/marketplace/actions/projector-pipeline
[15]: https://www.npmjs.com/package/debug
[16]: https://docs.microsoft.com/en-us/windows/wsl/install
[17]: https://nodejs.org/en/about/releases
[18]: https://nodejs.org/en
[19]: https://git-scm.com
[20]: packages
[21]: packages/projector
[22]: packages/cli
[23]: packages/config-babel
[24]: packages/config-commitlint
[25]: packages/config-conventional-changelog
[26]: packages/config-eslint
[27]: packages/config-jest
[28]: packages/config-lint-staged
[29]: packages/config-next
[30]: packages/config-prettier
[31]: packages/config-semantic-release-atam
[32]: packages/config-tsconfig
[33]: packages/config-webpack
[34]: packages/semantic-release-plugin
[35]: packages/core
[39]: https://docs.npmjs.com/cli/v8/using-npm/scripts
[40]: #life-cycle-scripts-plugins
[11]: https://github.com/lerna/lerna
[41]: #cli-examples
[42]: #terminology
[43]: #project-structure
[44]: #monorepo-structure
[45]: #usage
[46]: #system-requirements
[47]: #installation
[48]: #cli
[49]: #shared-configurations
[50]: #github-action
[51]: #semantic-release-plugin
[52]: #library
[53]: #documentation
[54]: #license
[55]: #contributing-and-support
[56]: https://docs.npmjs.com/cli/v8/using-npm/workspaces#defining-workspaces
[57]: https://webpack.js.org
[58]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#workspaces
[59]: https://www.npmjs.com/package/glob#glob-primer
[60]: https://xunn.at/badge-projector
[61]: packages/plugin-lint
[63]: packages/plugin-list-types
[64]: packages/plugin-metrics
[66]: packages/plugin-sync-files
[67]: packages/plugin-sync-vercel
[68]: #quick-start
[69]: #template-repositories
[70]: #cli-command-glossary
[71]: #badge-swag
[72]: https://github.com/Xunnamius/projector/projects/1
[73]:
  https://semantic-release.gitbook.io/semantic-release/usage/configuration#configuration-file
[74]: #getting-started
[75]: #dependency-topology-and-script-concurrency
[76]: https://github.com/microsoft/lage
[77]: https://github.com/microsoft/backfill
[78]: https://microsoft.github.io/lage/guide/pipeline.html#defining-a-pipeline
[79]: https://tom.preston-werner.com/2010/08/23/readme-driven-development.html
[80]: https://www.npmjs.com/package/glob
[81]: https://en.wikipedia.org/wiki/Topological_sorting
[82]: https://microsoft.github.io/lage/guide/levels.html
[83]: #feature-overview
[84]: https://rushjs.io
[85]: https://nx.dev
[86]: https://www.npmjs.com/package/threads
[87]: https://www.npmjs.com/package/inquirer
[88]: https://docs.npmjs.com/cli/v7/using-npm/config#workspace
[89]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#name
[36]: https://git-scm.com/docs/git-status
[62]: #life-cycle-operation-order
[65]: packages/config-husky
[90]: #projector-project-structure
[91]: packages/plugin-build
[92]: packages/plugin-clean
[93]: packages/plugin-dev
[94]: packages/plugin-format
[95]: packages/plugin-github
[96]: packages/plugin-list
[97]: packages/plugin-prepare
[98]: packages/plugin-test
[37]: packages/cli#status-symbols
[38]: #cross-dependency-version-coherence
[99]: #credits
[100]: packages/cli#projector-create
[101]: https://microsoft.github.io/lage/guide/config.html
[102]: https://github.com/lerna/lerna#fixedlocked-mode-default

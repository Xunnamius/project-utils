<!-- prettier-ignore-start -->

<!-- badges-start -->

[![Black Lives Matter!][badge-blm]][link-blm]
[![Last commit timestamp][badge-last-commit]][link-repo]
[![Open issues][badge-issues]][link-issues]
[![Pull requests][badge-pulls]][link-pulls]
[![Uses Semantic Release!][badge-semantic-release]][link-semantic-release]

<!-- badges-end -->

<!-- prettier-ignore-end -->

# projector-js

Simple seamless monorepo _and_ polyrepo project management CLI toolkit and JS
library using [semantic-release][2], [conventional-changelog][3], and
[conventional-commits][4] for commit-based automated release flows and
(optionally) [GitHub Actions][5] and [Dependabot][6] for [CI][7]/[CD][8].
Supports task concurrency and cross-dependency version synchronization for
monorepos.

Projector leans on as much native npm functionality and popular tooling as
possible. This means no bootstrapping commands, no custom linking, no "Projector
config file", nor any reinventions of the familiar features that git, npm, and
other tooling already provide out of the box.

**Projector tries to avoid being Yet Another Thing you have to learn.**

## Feature Overview

> The `p` command comes from `npm i -g @projector-js/cli`. Alternatively,
> [npx][9] can be used: `npx projector ...` (local install) or
> `npx projector-js ...` (no install).

- Can be used for both frontend and backend projects
- Presents a unified interface for both polyrepos (normal repos) and monorepos
  - The `--root` argument, when used in a polyrepo context, refers to the
    repository root and can usually be omitted
- Built on tools with which you are already familiar
  - The core of Projector relies on git, npm workspaces and scripts, and [a
    slightly-divergent semantic-release fork][36] <sup>(until [upstream][37]
    [PRs][38] are merged)</sup>
  - Projector ships with configurations for TypeScript, webpack, Babel, and
    other tools, but you can use your own if you wish
- Build one, some, or all packages concurrently (via webpack or any bundler or
  compiler)
  > `p build -p pkg-1`\
  > `p build -p pkg-1 -p pkg-2`\
  > `p build --root`\
  > `p build`
- Test one, some, or all packages concurrently (via [Jest][10] or any test
  framework)
  > `p test some-specific-test`\
  > `p test some-* another-test`\
  > `p test`
- Release one, some, or all packages concurrently (all-or-nothing), including
  automatic changelog and documentation generation and cross-dependency version
  synchronization (via [semantic-release][11])
  > `p publish -p pkg-1`\
  > `p publish -p pkg-1 -p pkg-2 -p pkg-3`\
  > `p publish`
- Update the dependencies (and/or dev dependencies) of one, some, or all
  packages (via [npm-check-updates][12])
  > `p update -p pkg-1`\
  > `p update -p pkg-1 -p pkg-2`\
  > `p update --no-commits -p pkg-1 -p pkg-3`\
  > `p update --root`\
  > `p update --doctor`\
  > `p update`
- Run npm scripts for one, some, or all packages (via [npm-run-script][11])
  > `p run -p pkg-1 some-npm-script`\
  > `p run -p pkg-1 -p pkg-2 some-npm-script`\
  > `p run --root npm-script-at-root`\
  > `p run npm-script-in-every-package`
- Run arbitrary npm commands for one, some, or all packages
  > `p -p pkg-1 npm info`\
  > `p -p pkg-1 -p pkg-2 npm list --depth=1`\
  > `p --root npm audit`\
  > `p npm show`
- Manage both individual and shared dependencies across packages (via npm
  workspaces and `package.json`)
  > `p install -p pkg-1`\
  > `p install -p pkg-1 -p pkg-2`\
  > `p install -p pkg-1 -p pkg-3 some-package some-other-package`\
  > `p install --root --save-dev new-package-installed-to-root`\
  > `p install new-package-installed-to-all`\
  > `p install`
- Create new projects from scratch, or from [custom templates][13]
  > `p create new-project`\
  > `p create --monorepo new-project`\
  > `p create new-project --using /some/path/to/template`\
  > `p create new-project --monorepo --using https://github.com/some-user/some-repo`
- Add new packages (only when the current working directory is a monorepo)
  > `p create new-package`\
  > `p create new-package --using /some/path/to/template`\
  > `p create new-package --using https://github.com/some-user/some-repo`
- Rename projects and/or packages, updating metadata where necessary
  > `p rename new-pkg-name` (same as `p rename --root new-pkg-name`)\
  > `p rename pkg-1 pkg-1-new-name`
- List project and package(s) metadata (especially useful for monorepos)
  > `p list`
- Continuous Integration (CI) and Continuous Deployment (CD) support (via GitHub
  Actions and Dependabot)
  - See the [`projector-pipeline` marketplace Action][14]
- Hook into the Projector runtime life cycle with your own "plugins"
  - Projector will call an [npm script][39] (à la `npm run an-npm-script`) [with
    a well-defined name][40] whenever an interesting event occurs
- Robust debugging output (via [debug][15])
  - `DEBUG=projector:<package-id>` to view a specific package's output
  - `DEBUG=projector:<package-id>:all` or `DEBUG=projector:all` to view all
    output (including verbose output)

## Terminology

- **polyrepo**: a repository containing a single package. The opposite of a
  _monorepo_.
- **monorepo**: a repository containing multiple packages. The opposite of a
  _polyrepo_.
- **repository root**: the ultimate top-level directory of a git repository and
  Projector project. Also referred to as "project root", `rootDir` (always an
  absolute path), or simply "root". Projector projects should never depend on
  items outside their respective repository roots.
- **package root**: a subdirectory at `<rootDir>/packages/<package-id>`
  containing the `package.json` file of an individual package in a monorepo. The
  name of this directory is also referred to as the `package-id`, which may or
  may not match the `name` in the package's `package.json` file. Package roots
  are _never_ referred to as "root".

## Project Structure

All Projector projects require the following:

- A `package.json` file at the root of the repository
- At least a `main` branch

**Example**

    .
    ├── package.json
    ├── package-lock.json
    ├── src/
    └── README.md

### Monorepo Structure

For monorepos, the following are additionally required:

- The root `package.json` cannot have any of the following keys: `dependencies`,
  `version`
- A `packages/<package-id>/package.json` file exists for each available package.
  - Necessarily, each `packages/<package-id>` is a package root.
  - If no packages are available yet, the existence of `packages/` is optional.
  - `packages/` must contain no directories other than package roots.
  - `packages/` can contain arbitrary files.
  - The existence of the `packages/` directory is optional.

**Example**

    .
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
    └── README.md

## Usage

<!-- TODO -->

### Pre-made Templates (Lenses)

<!-- TODO -->

### Life Cycle Scripts

## System Requirements

- At the moment, Projector is only guaranteed to work on Linux (Ubuntu) systems.
  It likely works on any unix-based distro. Projector has not been tested on
  Windows or [WSL][16], though it should work with the latter. Full Windows
  support may be considered in the future.
- At the moment, Projector only works with npm. It is likely a short jump to
  enabling Yarn and/or pnpm support and this may be considered in the future.
- Projector requires an [actively maintained][17] version of [Node.js and
  npm][18] be installed.
- Projector requires [Git][19] be installed.
- See [each individual package][20]'s documentation for further requirements.

## Installation

There are several ways to install Projector: as a _CLI tool_, as a source of
_shared configuration_, as a _GitHub Action_ (via [the GitHub Actions
Marketplace][14]), as a _semantic-release plugin_, and as an _imported library_.

### CLI

Install the [omnibus Projector package][21]:

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

The following shared configurations are available for Projector projects. See
each individual package's documentation for installation details.

- Babel ([`@projector-js/config-babel`][23])
- commitlint ([`@projector-js/config-commitlint`][24])
- conventional-changelog ([`@projector-js/config-conventional-changelog`][25])
- ESLint ([`@projector-js/config-eslint`][26])
- Jest ([`@projector-js/config-jest`][27])
- lint-staged ([`@projector-js/config-lint-staged`][28])
- Next.js ([`@projector-js/config-next`][29])
- Prettier ([`@projector-js/config-prettier`][30])
- semantic-release ([`@projector-js/config-semantic-release`][31])
- TSConfig ([`@projector-js/config-tsconfig`][32])
- webpack ([`@projector-js/config-webpack`][33])

### GitHub Action

See [`projector-pipeline`][14].

### semantic-release Plugin

See [`@projector-js/semantic-release-plugin`][34].

### Imported Library

See [`@projector-js/core`][35].

## Documentation

See [each package][1] for further information on the types they make available
and other specifics.

### License

[![FOSSA analysis][badge-fossa]][link-fossa]

## Contributing and Support

**[New issues][choose-new-issue] and [pull requests][pr-compare] are always
welcome and greatly appreciated! 🤩** Just as well, you can [star 🌟 this
project][link-repo] to let me know you found it useful! ✊🏿 Thank you!

See [CONTRIBUTING.md][contributing] and [SUPPORT.md][support] for more
information.

[badge-blm]: https://api.ergodark.com/badges/blm 'Join the movement!'
[link-blm]: https://secure.actblue.com/donate/ms_blm_homepage_2019
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
[choose-new-issue]: https://github.com/xunnamius/projector/issues/new/choose
[pr-compare]: https://github.com/xunnamius/projector/compare
[contributing]: CONTRIBUTING.md
[support]: .github/SUPPORT.md
[1]: /packages
[2]: https://www.npmjs.com/package/semantic-release
[3]: https://www.npmjs.com/package/conventional-changelog
[4]: https://www.conventionalcommits.org/en/v1.0.0
[5]: https://github.com/features/actions
[6]:
  https://github.blog/2020-06-01-keep-all-your-packages-up-to-date-with-dependabot/
[7]: https://en.wikipedia.org/wiki/Continuous_integration
[8]: https://en.wikipedia.org/wiki/Continuous_deployment
[9]: https://docs.npmjs.com/cli/v7/commands/npx
[10]: https://jestjs.io

[11]: <>

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
[31]: packages/config-semantic-release
[32]: packages/config-tsconfig
[33]: packages/config-webpack
[34]: packages/semantic-release-plugin
[35]: packages/core
[36]: https://www.npmjs.com/package/semantic-release-mono
[37]: https://github.com/semantic-release/semantic-release/pull/1710
[38]: https://github.com/semantic-release/semantic-release/pull/XXXX
[39]: https://docs.npmjs.com/cli/v8/using-npm/scripts
[40]: #life-cycle-scripts

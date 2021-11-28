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

> 🚧 🚧 Though I use it as a Lerna replacement to manage and release my
> software, **Projector is still very much in its infancy**! Check out the
> [public roadmap][72] to see the lay of things. What follows is [RDD][79] 🙂

Projector is a modern monorepo _and_ polyrepo management toolkit with a focus on
simplicity and flexibility. It's built around [semantic-release][2],
[conventional-changelog][3], and [conventional-commits][4] for commit-based
automated release flows and (optionally) [GitHub Actions][5] and [Dependabot][6]
for [CI][7]/[CD][8]. For monorepos, it supports Script concurrency and
cross-dependency version synchronization. Consequently, Projector works with
most any type of JS project—be it authoring a library, building a serverless
JAMstack app, bundling a CLI tool, etc.

Projector leans on as much native npm functionality and popular tooling as
possible. This means no bootstrapping commands, no custom linking, no "Projector
config file", no repository commit count limits, nor any reinventions of the
features that git, npm, semantic-release, conventional-changelog, and other
tooling already provide.

In this way, **Projector tries to avoid being Yet Another Thing you have to
learn.** The upside: combined with [life cycle plugins][40] (i.e. simple npm
scripts), Projector is flexible enough to integrate with most technology stacks.
The downside: compared to [Lerna][11]—the primary inspiration behind Projector's
creation—Projector only implements a focused subset of features.

[See what Projector can do][41].

---

- [Feature Overview][41]
- [Terminology][42]
- [Project Structure][43]
  - [Monorepo Structure][44]
- [Getting Started][45]
  - [Getting Started][74]
  - [CLI Command Glossary][70]
  - [Life Cycle Scripts (Plugins)][40]
  - [Dependency Topology and Script Concurrency][75]
  - [Template Repositories][69]
    - [Pre-made Templates (Lenses)][13]
  - [Badge Swag][71]
- [System Requirements][46]
- [Installation][47]
  - [CLI][48]
  - [Shared Configurations][49]
  - [GitHub Action][50]
  - [semantic-release Plugin][51]
  - [Library][52]
- [Documentation][53]
  - [License][54]
- [Contributing and Support][55]

## Feature Overview

> The `p` command comes from `npm i -g @projector-js/cli`. Alternatively,
> [npx][9] can be used: `npx projector ...` (local install) or
> `npx projector-js ...` (no install).

- Compatible with JavaScript/TypeScript projects already using npm.
- Presents a unified interface for both polyrepos (normal repos) and monorepos.
  - The `--root` argument, when used in a polyrepo context, refers to the
    repository root and can usually be omitted.
- Built on popular open source tooling you're likely already familiar with.
  - The primary components of Projector rely on git, npm (i.e. [workspaces][56]
    and [scripts][39]), and [a slightly-tweaked semantic-release fork][36].
  - Several _highly opinionated_ configurations [are available][49] for
    TypeScript, webpack, Babel, Jest, and other tools, but you can very easily
    substitute your own and/or ignore them entirely.
  - Uses [lage][76] and [backfill][77] for topologically-ordered concurrent
    script/task execution and output caching. This can be fine tuned on a
    per-project basis. See the [Dependency Topology and Script Concurrency][75]
    section for details.
- Build one, some, or all packages concurrently (via [webpack][57] or any
  bundler or compiler).
  > `p build -p pkg-1`\
  > `p build -p pkg-1 -p pkg-2`\
  > `p build -p 'pkg-*'`\
  > `p build --root`\
  > `p build`
- Test one, some, or all packages concurrently (via [Jest][10] or any test
  framework).
  > `p test some-specific-test`\
  > `p test --coverage --collectCoverageFrom 'src/**/*.ts*' some-* another-test`\
  > `p test`
- Release one, some, or all packages concurrently (all-or-nothing), including
  automatic commit-based changelog and documentation generation along with
  cross-dependency version synchronization (via [semantic-release-atam][36]).
  > `p publish -p pkg-1`\
  > `p publish -p pkg-1 -p pkg-2 -p pkg-3`\
  > `p publish`
- Update the dependencies (and/or dev dependencies) of one, some, or all
  packages (via [npm-check-updates][12]).
  > `p update -p pkg-1`\
  > `p update -p pkg-1 -p pkg-2`\
  > `p update --no-commits -p pkg-1 -p pkg-3`\
  > `p update --root`\
  > `p update --doctor`\
  > `p update`
- Run npm scripts for one, some, or all packages (via [npm-run-script][39]).
  > `p run -p pkg-1 npm-script-in-pkg`\
  > `p run -p pkg-1 -p pkg-2 npm-script-in-pkgs`\
  > `p run --root npm-script-at-root-only`\
  > `p run npm-script-at-root-and-in-every-pkg`
- Run arbitrary npm commands for one, some, or all packages.
  > `p -p pkg-1 npm info`\
  > `p -p pkg-1 -p pkg-2 npm list --depth=1`\
  > `p --root npm audit`\
  > `p npm show`
- Manage both individual and shared dependencies across packages (via npm
  workspaces and `package.json`).
  > `p install -p pkg-1`\
  > `p install -p pkg-1 -p pkg-2`\
  > `p install -p 'pkg-*' -p ppkkgg some-package some-other-package`\
  > `p install --root --save-dev new-package-installed-to-root`\
  > `p install new-package-installed-to-root-and-every-pkg`\
  > `p install`
- Create new projects from scratch, or from a [custom template][13].
  > `p create new-project`\
  > `p create --monorepo new-project`\
  > `p create new-project --using /some/path/to/template`\
  > `p create new-project --monorepo --using https://github.com/some-user/some-repo`
- Add new packages (only when the current working directory is a monorepo).
  > `p create new-package`\
  > `p create new-package --using /some/path/to/template`\
  > `p create new-package --using https://github.com/some-user/some-repo`
- Rename projects and/or packages, updating metadata where necessary.
  > `p rename --root new-name-at-root-pkg-json`\
  > `p rename pkg-1 pkg-1-new-name`
- List project and package metadata (especially useful for monorepos).
  > `p list`
- Plug-and-play Continuous Integration (CI) and Continuous Deployment (CD)
  support (via GitHub Actions and Dependabot).
  - See the [`projector-pipeline` marketplace Action][14].
- Hook into the Projector runtime life cycle with your own "plugins".
  - Projector will call an [npm script][39] (à la `npm run an-npm-script`) [with
    a well-defined name][40] whenever an interesting event occurs.
- Robust synchronized debugging output (via [debug][15]).
  - `DEBUG=projector` to view a subset of debug output from Projector itself.
  - `DEBUG=projector:<package-id>` to view an even finer subset of debug output
    from Projector itself.
  - `DEBUG=projector:all` to view all debug output Projector generates
    (potentially _very_ verbose).
  - Debug output can be piped to a file if desired.

> See [`@projector-js/cli`][22] for all available CLI commands.

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
  ([configurable][44]) that contains the `package.json` file of an individual
  package in a monorepo. The name of this directory is also referred to as the
  `package-id`, which may or may not match the `name` in the package's
  `package.json` file. Package roots are _never_ referred to as "root".
- **topological order**: <!-- TODO -->

## Project Structure

All Projector projects require at least the following:

- A `package.json` file at the root of the repository.

That's it.

**Example**

    .
    ├── package.json      <==
    ├── package-lock.json
    ├── src/
    └── README.md

### Monorepo Structure

Monorepo projects additionally require the following:

- A `packages/<package-id>/package.json` file exists for each available package.
  - Necessarily, each `packages/<package-id>` is a package root.
  - Projector reads package paths from the [`workspaces`][58] array in the root
    `package.json` file. This means, while it's recommended to stick with the
    Lerna-style `packages/<package-id>` project structure, you can organize your
    packages however you want so long as they appear in `workspaces`. [Glob
    patterns][59] are also supported.

**Example**

    .
    ├── package.json
    ├── package-lock.json
    ├── packages/            <==
    │   ├── pkg-1/           <==
    │   │   ├── package.json <==
    │   │   ├── README.md
    │   │   └── src/
    │   └── pkg-2/           <==
    │       ├── package.json <==
    │       ├── README.md
    │       └── src/
    └── README.md

## Usage

<!-- TODO -->

### Getting Started

<!-- TODO -->

### CLI Command Glossary

See [`@projector-js/cli`][22].

### Life Cycle Scripts (Plugins)

<!-- TODO -->

### Dependency Topology and Script Concurrency

<!-- TODO -->

### Template Repositories

<!-- TODO -->

#### Pre-made Templates (Lenses)

<!-- TODO -->

### Badge Swag

Inspired by Lerna and semantic-release, Projector too has a badge!

[![Maintained with Projector][60]][link-projector]

```markdown
[![Maintained with Projector](https://img.shields.io/badge/maintained%20with-projector-ccff00.svg)](https://github.com/Xunnamius/projector)
```

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

There are several ways to utilize Projector: as a _CLI tool_, as a source of
_shared configuration_, as a _GitHub Action_ (via [the GitHub Actions
Marketplace][14]), as a _semantic-release plugin_, and as an _imported library_.

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

The following highly opinionated ready-made configurations are available for
Projector projects. See each individual package's documentation for details.

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

Additionally, several highly opinionated plugins are available. Since plugins
are low overhead and extremely easy to create, you'll likely want to [write your
own][40] instead if needed.

- [`@projector-js/plugin-check-project`][61]
- [`@projector-js/plugin-github-integration`][62]
- [`@projector-js/plugin-list-types`][63]
- [`@projector-js/plugin-metrics`][64]
- [`@projector-js/plugin-release-checks`][65]
- [`@projector-js/plugin-sync-files`][66]
- [`@projector-js/plugin-sync-vercel-env`][67]

### GitHub Action

See [`projector-pipeline`][14].

### semantic-release Plugin

The semantic-release plugin facilitates Script concurrency and cross-dependency
version synchronization during the release cycle.

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

See [Getting Started][45] and [`@projector-js/semantic-release-plugin`][34] for
more details.

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
[badge-projector]:
  https://img.shields.io/badge/maintained%20with-projector-ccff00.svg
  'This repo is managed with Projector'
[link-projector]: https://github.com/Xunnamius/projector
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
[36]: https://www.npmjs.com/package/semantic-release-atam
[37]: https://github.com/semantic-release/semantic-release/pull/1710
[38]: https://github.com/semantic-release/semantic-release/pull/XXXX
[39]: https://docs.npmjs.com/cli/v8/using-npm/scripts
[40]: #life-cycle-scripts-plugins
[11]: https://github.com/lerna/lerna
[41]: #feature-overview
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
[56]: https://docs.npmjs.com/cli/v8/using-npm/workspaces
[57]: https://webpack.js.org
[58]: https://docs.npmjs.com/cli/v8/configuring-npm/package-json#workspaces
[59]: https://www.npmjs.com/package/glob#glob-primer
[60]: https://img.shields.io/badge/maintained%20with-projector-ccff00.svg
[61]: packages/plugin-check-project
[62]: packages/plugin-github-integration
[63]: packages/plugin-list-types
[64]: packages/plugin-metrics
[65]: packages/plugin-release-checks
[66]: packages/plugin-sync-files
[67]: packages/plugin-sync-vercel-env
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

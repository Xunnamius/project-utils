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

> 🚧 🚧 Though I use it as a Lerna replacement with great success, **Projector
> is still very much in its infancy**! Check out the [public roadmap][72] to see
> the lay of things. What follows is [RDD][79] 🙂

Projector is a modern monorepo _and_ polyrepo management toolkit with a focus on
simplicity, flexibility, and performance. It's built around
[semantic-release][2], [conventional-changelog][3], and
[conventional-commits][4] for commit-based automated release flows and
(optionally) [GitHub Actions][5] and [Dependabot][6] for [CI][7]/[CD][8]. It
supports task concurrency and, for monorepos, topological script execution and
cross-dependency version synchronization.

Projector leans on as much native npm functionality and popular tooling as
possible. This means no bootstrapping commands, no custom linking, no "Projector
config file," no repository commit count limits, nor any reinventions of the
features that git, npm, semantic-release, conventional-changelog, and other
tooling already provide.

In this way, **Projector tries to avoid being Yet Another Thing you have to
learn.** If you know how to use npm, you're already 80% there. Combined with
[life cycle plugins][40], Projector is flexible enough to integrate with most
any type of JS project—be it authoring a library, building a serverless or
JAMstack app, bundling a CLI tool, etc.

Projector was inspired by [Lerna][11], [Rush][84], [Nx][85], and others. [See
what Projector can do for you][41].

---

- [Feature Overview][83]
  - [CLI Examples][41]
- [Terminology][42]
- [Project Structure][43]
  - [Monorepo Structure][44]
- [Usage][45]
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

- Compatible with new and existing npm projects.
- Presents a unified interface for both polyrepo (normal repos) and monorepo
  management.
- Built on popular open source tooling.
  - Projector's core feature set relies on git, npm, and [a slightly-tweaked
    semantic-release fork][36].
  - Projector provides several optional [_highly opinionated_
    configurations][49] for TypeScript, webpack, Babel, Jest, and other tools,
    but you can very Optionally, fasily substitute your own.
  - Projector uses [lage][76], [backfill][77], and [Threads.js][86] for
    topologically-ordered concurrent script/task execution and output caching.
    See the [Dependency Topology and Script Concurrency][75] section for
    details.
  - Projector uses [glob][80] for easy workspace selection, [debug][15] for
    debugging support, [npm-check-updates][12] to selectively update
    dependencies, and [Inquirer.js][87] to gather input.
- Turnkey support for Continuous Integration and Deployment with
  [`projector-pipeline`][14].
- Supports deep customizations through simple npm-esque "life cycle plugins".
  - Projector will call an [npm script][39] (à la `npm run an-npm-script`) [with
    a well-defined name][40], if it exists, whenever an interesting event
    occurs.
- Robust debugging output available on demand.
  - Set `DEBUG=projector` to enable debug output when running Projector.
  - Set `DEBUG=projector:<projector-package-id>` to view debug output from a
    single Projector package.
    - `<projector-package-id>` must be the name of a directory [listed
      here][20]. For example: `DEBUG=projector:config-babel`.
  - Set `DEBUG=projector:all` (or `DEBUG=projector:<projector-package-id>:all`)
    to view all possible debug output Projector generates, including extra
    information that is normally hidden (potentially _very_ verbose).

### CLI Examples

> See [`@projector-js/cli`][22] for all available CLI commands.

> [Like npm][88], the `-w` option, short for "workspace," matches against 1) an
> exact path or parent path in the [`workspaces` config][56] or 2) an exact
> workspace [`name`][89]. _Unlike_ npm, `-w` also supports [glob][80] matching
> against the aforesaid paths and `name`s. For example, `-w '*pkg*'` will match
> workspaces with `name` "some-pkg-1" and "another-pkg-2" in their
> `package.json` files. The `-ws` option is supported as well.

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
- Release from one, some, or all workspaces concurrently (topologically;
  all-or-nothing), including automatic commit-based changelog and documentation
  generation and cross-dependency version synchronization for monorepos (via
  [semantic-release-atam][36]).
  > `projector publish -w pkg-1`\
  > `projector publish -w pkg-1 -w pkg-2 -w pkg-3`\
  > `projector publish -ws`\
  > `projector publish`
- Run npm scripts within one, some, or all workspaces concurrently (topological
  order via [`lage`][76]) or in parallel/sequentially (via
  [npm-run-script][39]).
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
  > `projector install -w 'pkg-*' -w my-workspace install-1 install-2`\
  > `projector install -ws install-to-every-workspace`\
  > `projector install --save-dev install-to-root`
- Update the dependencies (dev, peer, etc) of one, some, or all workspaces.
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
- Rename/move workspaces, updating metadata where necessary.
  > `projector rename -w pkg-1 --to-name a-new-name --to-path new/pkg/root`\
  > `projector rename --to-name new-name-at-root-pkg-json`
- List project and workspace metadata (especially useful for monorepos).
  > `projector list`

## Terminology

- **repository root**: the top-level directory of a git repository and Projector
  project; it contains the root `package.json` file. This directory is also
  referred to as: "project root," `rootDir` (always as an absolute path), "root
  package" (in [npm documentation][56]), "monorepo/polyrepo root," or simply
  "root".
- **monorepo**: a repository containing multiple packages/workspaces, each
  listed under the [`workspaces`][56] key in the root `package.json`. A monorepo
  is the opposite of a _polyrepo_.
- **package**/**package root**: synonymous with a [workspace][56] in a monorepo.
  It contains a package/workspace's `package.json` file. The basename of this
  directory (e.g. `c` in `/a/b/c/`) is also referred to as the `package-id`,
  which may or may not match the `name` in the package's `package.json` file.
  Package roots are _never_ referred to as "root".
- **polyrepo**: a repository containing a root `package.json` file with no
  [`workspaces`][56] key. A polyrepo is the opposite of a _monorepo_.
- [**topological order**][81]: a sequence of packages where a dependent package
  always comes before its dependencies—a so-called "package dependency order".
  Topological ordering ensures concurrent tasks are performed at the right time
  and order (e.g. regenerate types in a core package before linting its
  dependent packages). [Here's an illustrated example][82].

## Project Structure

All Projector projects require at least the following:

- A `package.json` file at the root of the repository.
  - The root `package.json` file **must not** contain a [`workspaces`][56] key.

That's it.

**Example**

    .
    ├── package.json      <==
    ├── package-lock.json
    ├── src/
    └── README.md

### Monorepo Structure

Monorepos additionally require the following:

- A [`workspaces`][56] key in the root `package.json` file.
  - A `package.json` file must exist at each package root with a `name` key.

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

Like Lerna and semantic-release, Projector too has a badge!

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
are low overhead and extremely easy to create (you don't even have to make a new
file!), you'll likely want to [write your own][40] instead.

- [`@projector-js/plugin-lint-project`][61]
- [`@projector-js/plugin-github-integration`][62]
- [`@projector-js/plugin-list-types`][63]
- [`@projector-js/plugin-metrics`][64]
- [`@projector-js/plugin-release-checks`][65]
- [`@projector-js/plugin-sync-files`][66]
- [`@projector-js/plugin-sync-vercel-env`][67]

### GitHub Action

See [`projector-pipeline`][14].

### semantic-release Plugin

The semantic-release plugin enforces cross-dependency version synchronization
and topological ordering during the release cycle and is therefore required when
releasing from a monorepo.

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
[60]: https://img.shields.io/badge/maintained%20with-projector-ccff00.svg
[61]: packages/plugin-lint-project
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

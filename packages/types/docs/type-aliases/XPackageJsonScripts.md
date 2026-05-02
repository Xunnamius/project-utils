[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / XPackageJsonScripts

# Type Alias: XPackageJsonScripts

> **XPackageJsonScripts** = `object`

Defined in: [index.ts:283](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L283)

Additional scripts available when working on an symbiote-powered project.

## Properties

### build?

> `optional` **build?**: `string`

Defined in: [index.ts:292](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L292)

Run by users, symbiote, and related tooling when building the current
package's production-ready distributables.

This script is usually a reference to `npm run build:dist`.

#### Example

```ts
`npm run build:dist --`
```

***

### build:changelog?

> `optional` **build:changelog?**: `string`

Defined in: [index.ts:299](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L299)

Run by users, symbiote, and related tooling when building the current
package's `CHANGELOG.md` file.

#### Example

```ts
`symbiote build changelog`
```

***

### build:dist?

> `optional` **build:dist?**: `string`

Defined in: [index.ts:306](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L306)

Run by users, symbiote, and related tooling when building the current
package's production-ready distributables.

#### Example

```ts
`symbiote build distributables --not-multiversal`
```

***

### build:docs?

> `optional` **build:docs?**: `string`

Defined in: [index.ts:313](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L313)

Run by users, symbiote, and related tooling when building the current
package's documentation (typically found under `docs/`).

#### Example

```ts
`symbiote build docs`
```

***

### build:topological?

> `optional` **build:topological?**: `string`

Defined in: [index.ts:320](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L320)

Run by users, symbiote, and related tooling when building, in topological
order, production-ready distributables across all packages in the project.

#### Example

```ts
`symbiote project topology --run build`
```

***

### clean?

> `optional` **clean?**: `string`

Defined in: [index.ts:327](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L327)

Run by users, symbiote, and related tooling when removing files from the
project or package that are ignored by git (with exceptions).

#### Example

```ts
`symbiote clean`
```

***

### deploy?

> `optional` **deploy?**: `string`

Defined in: [index.ts:335](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L335)

Run by users, symbiote, and related tooling when deploying built
distributables to the appropriate remote system(s).

#### Example

```ts
`symbiote deploy --target ssh --host prod.x.y.com --to-path
/prod/some/path`
```

***

### dev?

> `optional` **dev?**: `string`

Defined in: [index.ts:444](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L444)

Run by users, symbiote, and related tooling when spinning up a project's
local development environment.

***

### format?

> `optional` **format?**: `string`

Defined in: [index.ts:342](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L342)

Run by users, symbiote, and related tooling when formatting the project or
package.

#### Example

```ts
`symbiote format --hush`
```

***

### info?

> `optional` **info?**: `string`

Defined in: [index.ts:349](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L349)

Run by users, symbiote, and related tooling when printing information about
the current project or package.

#### Example

```ts
`symbiote project info`
```

***

### lint?

> `optional` **lint?**: `string`

Defined in: [index.ts:358](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L358)

Run by users, symbiote, and related tooling when linting the current
package's files.

This script is usually a reference to `npm run lint:package`.

#### Example

```ts
`npm run lint:package --`
```

***

### lint:package?

> `optional` **lint:package?**: `string`

Defined in: [index.ts:367](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L367)

Run by users, symbiote, and related tooling when linting all of the
lintable files under the current package's root along with any other source
files that comprise this package's build targets (see
gatherPackageBuildTargets).

#### Example

```ts
`symbiote lint --scope this-package`
```

***

### lint:packages?

> `optional` **lint:packages?**: `string`

Defined in: [index.ts:374](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L374)

Run by users, symbiote, and related tooling when linting all lintable files
in the entire project.

#### Example

```ts
`symbiote lint --scope unlimited`
```

***

### lint:project?

> `optional` **lint:project?**: `string`

Defined in: [index.ts:381](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L381)

Run by users, symbiote, and related tooling when linting a project's
metadata, such as its file structure and configuration settings.

#### Example

```ts
`symbiote project lint`
```

***

### lint:topological?

> `optional` **lint:topological?**: `string`

Defined in: [index.ts:395](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L395)

Run by users, symbiote, and related tooling when linting, in topological
order, files belonging to packages across the project.

#### Example

```ts
`symbiote project topology --run lint`
```

***

### list-tasks?

> `optional` **list-tasks?**: `string`

Defined in: [index.ts:388](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L388)

Run by users, symbiote, and related tooling when printing information about
available scripts in `package.json`.

#### Example

```ts
`symbiote list-tasks`
```

***

### prepare?

> `optional` **prepare?**: `string`

Defined in: [index.ts:406](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L406)

Run by users, symbiote, and related tooling when preparing a fresh
development environment.

See [the
docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
for more information.

#### Example

```ts
`symbiote project prepare`
```

***

### release?

> `optional` **release?**: `string`

Defined in: [index.ts:413](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L413)

Run by users, symbiote, and related tooling when potentially releasing the
next version of a package.

#### Example

```ts
`symbiote release --no-parallel`
```

***

### release:topological?

> `optional` **release:topological?**: `string`

Defined in: [index.ts:420](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L420)

Run by users, symbiote, and related tooling when potentially releasing, in
topological order, the next version of each package in the project.

#### Example

```ts
`symbiote project topology --run release`
```

***

### renovate?

> `optional` **renovate?**: `string`

Defined in: [index.ts:429](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L429)

Run by users, symbiote, and related tooling when manipulating a project's
_metadata_, such as its file structure and configuration settings, with the
goal of bringing the project up to date with latest best practices.

#### Example

```ts
`symbiote project renovate --github-reconfigure-repo
--regenerate-assets --assets-preset basic`
```

***

### start?

> `optional` **start?**: `string`

Defined in: [index.ts:439](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L439)

Run by users, symbiote, and related tooling when attempting to execute a
project's distributables locally.

See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
for more information.

#### Example

```ts
`symbiote start --`
```

***

### test?

> `optional` **test?**: `string`

Defined in: [index.ts:455](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L455)

Run by users, symbiote, and related tooling when executing unit tests
against the current package.

This script is usually a reference to `npm run test:package:unit`. See [the
docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for more
information.

#### Example

```ts
`npm run test:package:unit --`
```

***

### test:package:all?

> `optional` **test:package:all?**: `string`

Defined in: [index.ts:464](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L464)

Run by users, symbiote, and related tooling when executing all possible
tests against the current package. In a monorepo context, this script will
also run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --coverage`
```

***

### test:package:e2e?

> `optional` **test:package:e2e?**: `string`

Defined in: [index.ts:473](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L473)

Run by users, symbiote, and related tooling when executing end-to-end tests
against the current package. In a monorepo context, this script will also
run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests e2e-local`
```

***

### test:package:integration?

> `optional` **test:package:integration?**: `string`

Defined in: [index.ts:482](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L482)

Run by users, symbiote, and related tooling when executing integration
tests against the current package. In a monorepo context, this script will
also run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests integration`
```

***

### test:package:unit?

> `optional` **test:package:unit?**: `string`

Defined in: [index.ts:491](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L491)

Run by users, symbiote, and related tooling when executing unit tests
against the current package. In a monorepo context, this script will also
run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests unit`
```

***

### test:packages:all?

> `optional` **test:packages:all?**: `string`

Defined in: [index.ts:498](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L498)

Run by users, symbiote, and related tooling when executing all possible
tests across the entire project.

#### Example

```ts
`symbiote test --scope unlimited --coverage`
```

***

### test:topological?

> `optional` **test:topological?**: `string`

Defined in: [index.ts:505](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L505)

Run by users, symbiote, and related tooling when executing tests against
packages, in topological order, across the entire project.

#### Example

```ts
`symbiote project topology --run test`
```

[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / XPackageJsonScripts

# Type Alias: XPackageJsonScripts

> **XPackageJsonScripts**: `object`

Defined in: [index.ts:272](https://github.com/Xunnamius/projector/blob/13e6ed6a56dc037b1a9ba7cd7dfcf6687e7f59ca/packages/types/src/index.ts#L272)

Additional scripts available when working on an symbiote-powered project.

## Type declaration

### build?

> `optional` **build**: `string`

Run by users, symbiote, and related tooling when building the current
package's production-ready distributables.

This script is usually a reference to `npm run build:dist`.

#### Example

```ts
`npm run build:dist --`
```

### build:changelog?

> `optional` **build:changelog**: `string`

Run by users, symbiote, and related tooling when building the current
package's `CHANGELOG.md` file.

#### Example

```ts
`symbiote build changelog`
```

### build:dist?

> `optional` **build:dist**: `string`

Run by users, symbiote, and related tooling when building the current
package's production-ready distributables.

#### Example

```ts
`symbiote build distributables --not-multiversal`
```

### build:docs?

> `optional` **build:docs**: `string`

Run by users, symbiote, and related tooling when building the current
package's documentation (typically found under `docs/`).

#### Example

```ts
`symbiote build docs`
```

### build:topological?

> `optional` **build:topological**: `string`

Run by users, symbiote, and related tooling when building, in topological
order, production-ready distributables across all packages in the project.

#### Example

```ts
`symbiote project topology --run build`
```

### clean?

> `optional` **clean**: `string`

Run by users, symbiote, and related tooling when removing files from the
project or package that are ignored by git (with exceptions).

#### Example

```ts
`symbiote clean`
```

### deploy?

> `optional` **deploy**: `string`

Run by users, symbiote, and related tooling when deploying built
distributables to the appropriate remote system(s).

#### Example

```ts
`symbiote deploy --target ssh --host prod.x.y.com --to-path
/prod/some/path`
```

### dev?

> `optional` **dev**: `string`

Run by users, symbiote, and related tooling when spinning up a project's
local development environment.

### format?

> `optional` **format**: `string`

Run by users, symbiote, and related tooling when formatting the project or
package.

#### Example

```ts
`symbiote format --hush`
```

### info?

> `optional` **info**: `string`

Run by users, symbiote, and related tooling when printing information about
the current project or package.

#### Example

```ts
`symbiote project info`
```

### lint?

> `optional` **lint**: `string`

Run by users, symbiote, and related tooling when linting the current
package's files.

This script is usually a reference to `npm run lint:package`.

#### Example

```ts
`npm run lint:package --`
```

### lint:package?

> `optional` **lint:package**: `string`

Run by users, symbiote, and related tooling when linting all of the
lintable files under the current package's root along with any other source
files that comprise this package's build targets (see
gatherPackageBuildTargets).

#### Example

```ts
`symbiote lint --scope this-package`
```

### lint:packages?

> `optional` **lint:packages**: `string`

Run by users, symbiote, and related tooling when linting all lintable files
in the entire project.

#### Example

```ts
`symbiote lint --scope unlimited`
```

### lint:project?

> `optional` **lint:project**: `string`

Run by users, symbiote, and related tooling when linting a project's
metadata, such as its file structure and configuration settings.

#### Example

```ts
`symbiote project lint`
```

### lint:topological?

> `optional` **lint:topological**: `string`

Run by users, symbiote, and related tooling when linting, in topological
order, files belonging to packages across the project.

#### Example

```ts
`symbiote project topology --run lint`
```

### list-tasks?

> `optional` **list-tasks**: `string`

Run by users, symbiote, and related tooling when printing information about
available scripts in `package.json`.

#### Example

```ts
`symbiote list-tasks`
```

### prepare?

> `optional` **prepare**: `string`

Run by users, symbiote, and related tooling when preparing a fresh
development environment.

See [the
docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)
for more information.

#### Example

```ts
`symbiote project prepare`
```

### release?

> `optional` **release**: `string`

Run by users, symbiote, and related tooling when potentially releasing the
next version of a package.

#### Example

```ts
`symbiote release --no-parallel`
```

### release:topological?

> `optional` **release:topological**: `string`

Run by users, symbiote, and related tooling when potentially releasing, in
topological order, the next version of each package in the project.

#### Example

```ts
`symbiote project topology --run release`
```

### renovate?

> `optional` **renovate**: `string`

Run by users, symbiote, and related tooling when manipulating a project's
_metadata_, such as its file structure and configuration settings, with the
goal of bringing the project up to date with latest best practices.

#### Example

```ts
`symbiote project renovate --github-reconfigure-repo
--regenerate-assets --assets-preset basic`
```

### start?

> `optional` **start**: `string`

Run by users, symbiote, and related tooling when attempting to execute a
project's distributables locally.

See [the docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-start)
for more information.

#### Example

```ts
`symbiote start --`
```

### test?

> `optional` **test**: `string`

Run by users, symbiote, and related tooling when executing unit tests
against the current package.

This script is usually a reference to `npm run test:package:unit`. See [the
docs](https://docs.npmjs.com/cli/v9/using-npm/scripts#npm-test) for more
information.

#### Example

```ts
`npm run test:package:unit --`
```

### test:package:all?

> `optional` **test:package:all**: `string`

Run by users, symbiote, and related tooling when executing all possible
tests against the current package. In a monorepo context, this script will
also run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --coverage`
```

### test:package:e2e?

> `optional` **test:package:e2e**: `string`

Run by users, symbiote, and related tooling when executing end-to-end tests
against the current package. In a monorepo context, this script will also
run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests end-to-end`
```

### test:package:integration?

> `optional` **test:package:integration**: `string`

Run by users, symbiote, and related tooling when executing integration
tests against the current package. In a monorepo context, this script will
also run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests integration`
```

### test:package:unit?

> `optional` **test:package:unit**: `string`

Run by users, symbiote, and related tooling when executing unit tests
against the current package. In a monorepo context, this script will also
run the tests of any package that this package depends on (including
transitive dependencies).

#### Example

```ts
`symbiote test --scope this-package --tests unit`
```

### test:packages:all?

> `optional` **test:packages:all**: `string`

Run by users, symbiote, and related tooling when executing all possible
tests across the entire project.

#### Example

```ts
`symbiote test --scope unlimited --coverage`
```

### test:topological?

> `optional` **test:topological**: `string`

Run by users, symbiote, and related tooling when executing tests against
packages, in topological order, across the entire project.

#### Example

```ts
`symbiote project topology --run test`
```

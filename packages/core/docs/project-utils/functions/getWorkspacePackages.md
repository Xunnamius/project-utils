[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [project-utils](../README.md) / getWorkspacePackages

# Function: getWorkspacePackages()

> **getWorkspacePackages**(`options`): `object`

Analyzes a monorepo context (at `cwd`), returning a mapping of package names
to workspace information.

## Parameters

• **options**

• **options.cwd?**: `string`

The current working directory as an absolute path.

**Default**

```ts
process.cwd()
```

• **options.globOptions?**: `GlobOptions`

Options passed through to node-glob and minimatch.

**Default**

```ts
{}
```

• **options.projectRoot**: `string`

The absolute path to the root directory of a project.

## Returns

`object`

### cwdPackage

> **cwdPackage**: `null` \| [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)

### packages

> **packages**: `Map`\<`string`, [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)\> & `object`

#### Type declaration

##### all

> **all**: [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)[]

An array of *all* non-broken sub-root packages both named and
unnamed. Sugar for the following:

```TypeScript
Array.from(packages.values())
     .concat(Array.from(packages.unnamed.values()))
```

##### broken

> **broken**: `string`[]

An array of "broken" pseudo-sub-root pseudo-package directories that
are matching workspace paths but are missing a package.json file.

##### unnamed

> **unnamed**: `Map`\<`string`, [`WorkspacePackage`](../type-aliases/WorkspacePackage.md)\>

A mapping of sub-root packages missing the `"name"` field in their
respective package.json files to WorkspacePackage objects.

## Source

[packages/core/src/project-utils.ts:341](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/project-utils.ts#L341)

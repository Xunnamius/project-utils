[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / ProjectMetadata

# Type Alias: ProjectMetadata\<Json\>

> **ProjectMetadata**\<`Json`\>: `object`

Defined in: packages/types/dist/packages/types/src/index.d.ts:185

A collection of useful information about a project.

## Type Parameters

• **Json** *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Type declaration

### cwdPackage

> **cwdPackage**: [`Package`](Package.md)\<`Json`\>

The "current package" data. The "current" package is determined by the
current working directory and will always strictly equal (`===`) either (1)
exactly one value in RootPackage.packages's `all` property or (2)
`rootPackage`.

### rootPackage

> **rootPackage**: [`RootPackage`](RootPackage.md)\<`Json`\>

Project root package data.

### subRootPackages

> **subRootPackages**: `Map`\<[`WorkspacePackageName`](WorkspacePackageName.md), [`WorkspacePackage`](WorkspacePackage.md)\> & `object` \| `undefined`

A mapping of sub-root package names to [WorkspacePackage](WorkspacePackage.md) objects in
a monorepo, or `undefined` in a polyrepo.

Note that unnamed and broken packages are _never_ included in this map,
though they may be included in its `unnamed` and `broken` properties
depending on the process that generated this metadata object.

### type

> **type**: [`Polyrepo`](../enumerations/ProjectAttribute.md#polyrepo) \| [`Monorepo`](../enumerations/ProjectAttribute.md#monorepo)

The type of the project.

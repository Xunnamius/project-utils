[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / ProjectMetadata

# Type Alias: ProjectMetadata\<Json\>

> **ProjectMetadata**\<`Json`\>: `object`

Defined in: [index.ts:197](https://github.com/Xunnamius/projector/blob/ff90125e0338879bf7bf87de3d6d4aed56521e4c/packages/types/src/index.ts#L197)

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

### type

> **type**: [`Polyrepo`](../enumerations/ProjectAttribute.md#polyrepo) \| [`Monorepo`](../enumerations/ProjectAttribute.md#monorepo)

The type of the project.

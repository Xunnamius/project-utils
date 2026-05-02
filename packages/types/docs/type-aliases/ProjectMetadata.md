[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / ProjectMetadata

# Type Alias: ProjectMetadata\<Json\>

> **ProjectMetadata**\<`Json`\> = `object`

Defined in: [index.ts:197](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L197)

A collection of useful information about a project.

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Properties

### cwdPackage

> **cwdPackage**: [`Package`](Package.md)\<`Json`\>

Defined in: [index.ts:212](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L212)

The "current package" data. The "current" package is determined by the
current working directory and will always strictly equal (`===`) either (1)
exactly one value in RootPackage.packages's `all` property or (2)
`rootPackage`.

***

### rootPackage

> **rootPackage**: [`RootPackage`](RootPackage.md)\<`Json`\>

Defined in: [index.ts:205](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L205)

Project root package data.

***

### subRootPackages

> **subRootPackages**: `Map`\<[`WorkspacePackageName`](WorkspacePackageName.md), [`WorkspacePackage`](WorkspacePackage.md)\> & `object` \| `undefined`

Defined in: [index.ts:221](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L221)

A mapping of sub-root package names to [WorkspacePackage](WorkspacePackage.md) objects in
a monorepo, or `undefined` in a polyrepo.

Note that unnamed and broken packages are _never_ included in this map,
though they may be included in its `unnamed` and `broken` properties
depending on the process that generated this metadata object.

***

### type

> **type**: [`Polyrepo`](../enumerations/ProjectAttribute.md#polyrepo) \| [`Monorepo`](../enumerations/ProjectAttribute.md#monorepo)

Defined in: [index.ts:201](https://github.com/Xunnamius/projector/blob/2ee6352d2d20d1cac2a947b31a478b43bbb1165b/packages/types/src/index.ts#L201)

The type of the project.

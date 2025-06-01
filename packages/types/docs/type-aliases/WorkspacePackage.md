[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspacePackage

# Type Alias: WorkspacePackage\<Json\>

> **WorkspacePackage**\<`Json`\> = `object`

Defined in: [index.ts:44](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L44)

An object representing a non-root package in a monorepo project.

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Properties

### attributes

> **attributes**: `{ [key in WorkspaceAttribute]?: boolean }`

Defined in: [index.ts:73](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L73)

A collection of [WorkspaceAttribute](../enumerations/WorkspaceAttribute.md) flags describing the workspace.

***

### id

> **id**: [`WorkspacePackageId`](WorkspacePackageId.md)

Defined in: [index.ts:53](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L53)

The package-id of the workspace package. The package-id is derived from the
name of the parent directory of this package's `package.json` file, i.e.
the basename of `root`.

The package-id must be alphanumeric + hyphens and must be at least one
character.

***

### json

> **json**: `Json`

Defined in: [index.ts:69](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L69)

The contents of the package's `package.json` file.

***

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

Defined in: [index.ts:78](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L78)

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

***

### relativeRoot

> **relativeRoot**: `RelativePath`

Defined in: [index.ts:65](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L65)

The path to the root directory of the package _relative to the project
root_.

Note: the `./` prefix (_not_ `../`), if present, is elided from the
returned path.

***

### root

> **root**: `AbsolutePath`

Defined in: [index.ts:57](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L57)

The absolute path to the root directory of the package.

[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / WorkspacePackage

# Type Alias: WorkspacePackage\<Json\>

> **WorkspacePackage**\<`Json`\>: `object`

Defined in: [index.ts:44](https://github.com/Xunnamius/projector/blob/ebf54405456d5ea4b1a9fbe57c92ad44289d3b1b/packages/types/src/index.ts#L44)

An object representing a non-root package in a monorepo project.

## Type Parameters

• **Json** *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Type declaration

### attributes

> **attributes**: `{ [key in WorkspaceAttribute]?: boolean }`

A collection of [WorkspaceAttribute](../enumerations/WorkspaceAttribute.md) flags describing the workspace.

### id

> **id**: [`WorkspacePackageId`](WorkspacePackageId.md)

The package-id of the workspace package. The package-id is derived from the
name of the parent directory of this package's `package.json` file, i.e.
the basename of `root`.

The package-id must be alphanumeric + hyphens and must be at least one
character.

### json

> **json**: `Json`

The contents of the package's `package.json` file.

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

### relativeRoot

> **relativeRoot**: `RelativePath`

The path to the root directory of the package _relative to the project
root_.

Note: the `./` prefix (_not_ `../`), if present, is elided from the
returned path.

### root

> **root**: `AbsolutePath`

The absolute path to the root directory of the package.

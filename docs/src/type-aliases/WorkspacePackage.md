[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / WorkspacePackage

# Type Alias: WorkspacePackage\<Json\>

> **WorkspacePackage**\<`Json`\> = `object`

Defined in: packages/types/dist/packages/types/src/index.d.ts:38

An object representing a non-root package in a monorepo project.

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Properties

### attributes

> **attributes**: `{ [key in WorkspaceAttribute]?: boolean }`

Defined in: packages/types/dist/packages/types/src/index.d.ts:67

A collection of [WorkspaceAttribute](../enumerations/WorkspaceAttribute.md) flags describing the workspace.

***

### id

> **id**: [`WorkspacePackageId`](WorkspacePackageId.md)

Defined in: packages/types/dist/packages/types/src/index.d.ts:47

The package-id of the workspace package. The package-id is derived from the
name of the parent directory of this package's `package.json` file, i.e.
the basename of `root`.

The package-id must be alphanumeric + hyphens and must be at least one
character.

***

### json

> **json**: `Json`

Defined in: packages/types/dist/packages/types/src/index.d.ts:63

The contents of the package's `package.json` file.

***

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

Defined in: packages/types/dist/packages/types/src/index.d.ts:72

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

***

### relativeRoot

> **relativeRoot**: `RelativePath`

Defined in: packages/types/dist/packages/types/src/index.d.ts:59

The path to the root directory of the package _relative to the project
root_.

Note: the `./` prefix (_not_ `../`), if present, is elided from the
returned path.

***

### root

> **root**: `AbsolutePath`

Defined in: packages/types/dist/packages/types/src/index.d.ts:51

The absolute path to the root directory of the package.

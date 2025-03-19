[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / RootPackage

# Type Alias: RootPackage\<Json\>

> **RootPackage**\<`Json`\> = `object`

Defined in: packages/types/dist/packages/types/src/index.d.ts:16

An object representing the root or "top-level" package in a monorepo or
polyrepo project.

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Properties

### attributes

> **attributes**: `{ [key in ProjectAttribute]?: boolean }`

Defined in: packages/types/dist/packages/types/src/index.d.ts:28

A collection of [ProjectAttribute](../enumerations/ProjectAttribute.md) flags describing the project.

***

### json

> **json**: `Json`

Defined in: packages/types/dist/packages/types/src/index.d.ts:24

The contents of the root `package.json` file.

***

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

Defined in: packages/types/dist/packages/types/src/index.d.ts:33

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

***

### root

> **root**: `AbsolutePath`

Defined in: packages/types/dist/packages/types/src/index.d.ts:20

The absolute path to the root directory of the entire project.

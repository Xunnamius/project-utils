[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / RootPackage

# Type Alias: RootPackage\<Json\>

> **RootPackage**\<`Json`\>: `object`

Defined in: [index.ts:19](https://github.com/Xunnamius/projector/blob/e6720648fa9dc975b0426fb558b4c4b10c6b2e73/packages/types/src/index.ts#L19)

An object representing the root or "top-level" package in a monorepo or
polyrepo project.

## Type Parameters

• **Json** *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Type declaration

### attributes

> **attributes**: `{ [key in ProjectAttribute]?: boolean }`

A collection of [ProjectAttribute](../enumerations/ProjectAttribute.md) flags describing the project.

### json

> **json**: `Json`

The contents of the root `package.json` file.

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

### root

> **root**: `AbsolutePath`

The absolute path to the root directory of the entire project.

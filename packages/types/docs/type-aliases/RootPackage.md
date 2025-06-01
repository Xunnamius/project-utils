[**@-xun/project-types**](../README.md)

***

[@-xun/project-types](../README.md) / RootPackage

# Type Alias: RootPackage\<Json\>

> **RootPackage**\<`Json`\> = `object`

Defined in: [index.ts:21](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L21)

An object representing the root or "top-level" package in a monorepo or
polyrepo project.

## Type Parameters

### Json

`Json` *extends* `PackageJson` \| [`XPackageJson`](XPackageJson.md) = [`XPackageJson`](XPackageJson.md)

## Properties

### attributes

> **attributes**: `{ [key in ProjectAttribute]?: boolean }`

Defined in: [index.ts:33](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L33)

A collection of [ProjectAttribute](../enumerations/ProjectAttribute.md) flags describing the project.

***

### json

> **json**: `Json`

Defined in: [index.ts:29](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L29)

The contents of the root `package.json` file.

***

### projectMetadata

> **projectMetadata**: [`ProjectMetadata`](ProjectMetadata.md)\<`Json`\>

Defined in: [index.ts:38](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L38)

A link back to the [ProjectMetadata](ProjectMetadata.md) instance containing this
package.

***

### root

> **root**: `AbsolutePath`

Defined in: [index.ts:25](https://github.com/Xunnamius/projector/blob/1e3e32abc78a59aa6a685503e0c5345146db6c1f/packages/types/src/index.ts#L25)

The absolute path to the root directory of the entire project.

[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / pathToPackage

# Function: pathToPackage()

> **pathToPackage**\<`T`\>(`path`, `projectMetadata`): [`Package`](../type-aliases/Package.md)\<`T`\>

Defined in: packages/graph/dist/packages/graph/src/analysis/path-to-package.d.ts:7

Synchronously resolve `path` to the first package that contains that path.
If `path` points to a location outside of the project, an error is thrown.

## Type Parameters

• **T** *extends* [`GenericPackageJson`](../type-aliases/GenericPackageJson.md)

## Parameters

### path

`AbsolutePath`

### projectMetadata

[`ProjectMetadata`](../type-aliases/ProjectMetadata.md)\<`T`\>

## Returns

[`Package`](../type-aliases/Package.md)\<`T`\>

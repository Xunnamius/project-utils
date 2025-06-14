[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/path-to-package](../README.md) / pathToPackage

# Function: pathToPackage()

> **pathToPackage**\<`T`\>(`path`, `projectMetadata`): `Package`\<`T`\>

Defined in: [packages/graph/src/analysis/path-to-package.ts:12](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/analysis/path-to-package.ts#L12)

Synchronously resolve `path` to the first package that contains that path.
If `path` points to a location outside of the project, an error is thrown.

## Type Parameters

### T

`T` *extends* `GenericPackageJson`

## Parameters

### path

`AbsolutePath`

### projectMetadata

`ProjectMetadata`\<`T`\>

## Returns

`Package`\<`T`\>

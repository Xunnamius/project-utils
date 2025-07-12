[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/path-to-package](../README.md) / pathToPackage

# Function: pathToPackage()

> **pathToPackage**\<`T`\>(`path`, `projectMetadata`): `Package`\<`T`\>

Defined in: [packages/graph/src/analysis/path-to-package.ts:14](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/analysis/path-to-package.ts#L14)

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

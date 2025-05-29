[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [flatten-package-json-subpath-map](../README.md) / flattenPackageJsonSubpathMap

# Function: flattenPackageJsonSubpathMap()

> **flattenPackageJsonSubpathMap**(`__namedParameters`): [`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

Defined in: [packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts:12](https://github.com/Xunnamius/projector/blob/ff49dea649d2cb66826f02e52b0a8e211009f14d/packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts#L12)

Flatten entry points within a `package.json` `imports`/`exports` map into a
one dimensional array of subpath-target mappings.

## Parameters

### \_\_namedParameters

#### map

`undefined` \| `Exports` \| `Imports`

## Returns

[`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

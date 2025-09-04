[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [flatten-package-json-subpath-map](../README.md) / flattenPackageJsonSubpathMap

# Function: flattenPackageJsonSubpathMap()

> **flattenPackageJsonSubpathMap**(`__namedParameters`): [`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

Defined in: [flatten-package-json-subpath-map.ts:12](https://github.com/Xunnamius/projector/blob/3c6f177510f3f2da7ac5e382b8e400ab1e86d7f4/packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts#L12)

Flatten entry points within a `package.json` `imports`/`exports` map into a
one dimensional array of subpath-target mappings.

## Parameters

### \_\_namedParameters

#### map

`undefined` \| `Exports` \| `Imports`

## Returns

[`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

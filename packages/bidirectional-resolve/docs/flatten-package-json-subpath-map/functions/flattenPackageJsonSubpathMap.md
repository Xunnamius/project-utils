[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [flatten-package-json-subpath-map](../README.md) / flattenPackageJsonSubpathMap

# Function: flattenPackageJsonSubpathMap()

> **flattenPackageJsonSubpathMap**(`__namedParameters`): [`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

Defined in: [flatten-package-json-subpath-map.ts:12](https://github.com/Xunnamius/projector/blob/d875f4ef259217f83da06d38dff9212ae8293b8a/packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts#L12)

Flatten entry points within a `package.json` `imports`/`exports` map into a
one dimensional array of subpath-target mappings.

## Parameters

### \_\_namedParameters

#### map

`undefined` \| `Exports` \| `Imports`

## Returns

[`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

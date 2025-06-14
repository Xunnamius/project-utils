[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [flatten-package-json-subpath-map](../README.md) / flattenPackageJsonSubpathMap

# Function: flattenPackageJsonSubpathMap()

> **flattenPackageJsonSubpathMap**(`__namedParameters`): [`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

Defined in: [packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts:12](https://github.com/Xunnamius/projector/blob/38588c43723411fd0ec7837abba2c98bf624a467/packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts#L12)

Flatten entry points within a `package.json` `imports`/`exports` map into a
one dimensional array of subpath-target mappings.

## Parameters

### \_\_namedParameters

#### map

`undefined` \| `Exports` \| `Imports`

## Returns

[`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

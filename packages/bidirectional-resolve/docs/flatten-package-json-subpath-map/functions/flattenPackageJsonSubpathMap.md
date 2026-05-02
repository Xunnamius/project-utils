[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [flatten-package-json-subpath-map](../README.md) / flattenPackageJsonSubpathMap

# Function: flattenPackageJsonSubpathMap()

> **flattenPackageJsonSubpathMap**(`__namedParameters`): [`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

Defined in: [flatten-package-json-subpath-map.ts:12](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/flatten-package-json-subpath-map.ts#L12)

Flatten entry points within a `package.json` `imports`/`exports` map into a
one dimensional array of subpath-target mappings.

## Parameters

### \_\_namedParameters

#### map

`Exports` \| `Imports` \| `undefined`

## Returns

[`SubpathMappings`](../../resolvers/type-aliases/SubpathMappings.md)

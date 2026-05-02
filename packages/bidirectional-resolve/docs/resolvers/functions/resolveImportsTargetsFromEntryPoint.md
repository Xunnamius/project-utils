[**bidirectional-resolve**](../../README.md)

***

[bidirectional-resolve](../../README.md) / [resolvers](../README.md) / resolveImportsTargetsFromEntryPoint

# Function: resolveImportsTargetsFromEntryPoint()

> **resolveImportsTargetsFromEntryPoint**(`__namedParameters`): `string`[]

Defined in: [resolvers.ts:384](https://github.com/Xunnamius/projector/blob/2f27fcc45a3b7194f8512eb7f0274bde1ac7ea9d/packages/bidirectional-resolve/src/resolvers.ts#L384)

Given `entryPoint` and `conditions`, this function returns an array of zero
or more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are active in the runtime. This is done by mapping `entryPoint`
using `imports` from `package.json`. `imports` is assumed to be valid.

## Parameters

### \_\_namedParameters

`object` & [`FlattenedImportsOption`](../type-aliases/FlattenedImportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md)

## Returns

`string`[]

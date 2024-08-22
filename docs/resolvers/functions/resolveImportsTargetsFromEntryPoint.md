[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [resolvers](../README.md) / resolveImportsTargetsFromEntryPoint

# Function: resolveImportsTargetsFromEntryPoint()

> **resolveImportsTargetsFromEntryPoint**(`__namedParameters`): `string`[]

Given `entryPoint` and `conditions`, this function returns an array of zero
or more targets that `entryPoint` is guaranteed to resolve to when the exact
`conditions` are present. This is done by mapping `entryPoint` using
`imports` from `package.json`. `imports` is assumed to be valid.

## Parameters

• **\_\_namedParameters**: `object` & [`FlattenedImportsOption`](../type-aliases/FlattenedImportsOption.md) & [`ConditionsOption`](../type-aliases/ConditionsOption.md) & [`UnsafeFallbackOption`](../type-aliases/UnsafeFallbackOption.md)

## Returns

`string`[]

## Source

[packages/core/src/resolvers.ts:232](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/resolvers.ts#L232)

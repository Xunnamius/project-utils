[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForNextJs

# Function: deriveAliasesForNextJs()

> **deriveAliasesForNextJs**(`rawAliasMappings`): `object`

Defined in: [packages/graph/src/alias.ts:667](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/alias.ts#L667)

Returns an object that can be plugged into NextJs configurations. Currently
only Webpack-based alias configurations are supported, making this function
identical to getWebpackAliases. This may change in the future given
the existence of SWC and related tooling in the Next.js ecosystem.

See also: https://nextjs.org/docs/messages/invalid-resolve-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`object`

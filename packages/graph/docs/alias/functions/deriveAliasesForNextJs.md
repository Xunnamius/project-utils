[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForNextJs

# Function: deriveAliasesForNextJs()

> **deriveAliasesForNextJs**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:580](https://github.com/Xunnamius/projector/blob/7505ea44374986d1d0ddf3a37cdd5d3729450f39/packages/graph/src/alias.ts#L580)

Returns an object that can be plugged into NextJs configurations. Currently
only Webpack-based alias configurations are supported, making this function
identical to getWebpackAliases. This may change in the future given
the existence of SWC and related tooling in the Next.js ecosystem.

See also: https://nextjs.org/docs/messages/invalid-resolve-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

### projectRoot

`string`

## Returns

`object`

[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForNextJs

# Function: deriveAliasesForNextJs()

> **deriveAliasesForNextJs**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:661](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/alias.ts#L661)

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

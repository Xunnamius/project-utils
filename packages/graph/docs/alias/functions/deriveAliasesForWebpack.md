[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForWebpack

# Function: deriveAliasesForWebpack()

> **deriveAliasesForWebpack**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:553](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L553)

Returns an object that can be plugged into Webpack configurations at
`resolve.alias`.

See also: https://webpack.js.org/configuration/resolve/#resolvealias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

### projectRoot

`string`

## Returns

`object`

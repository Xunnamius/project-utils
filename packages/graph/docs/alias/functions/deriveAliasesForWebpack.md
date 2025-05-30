[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForWebpack

# Function: deriveAliasesForWebpack()

> **deriveAliasesForWebpack**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:573](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/alias.ts#L573)

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

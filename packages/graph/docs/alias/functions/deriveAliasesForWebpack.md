[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForWebpack

# Function: deriveAliasesForWebpack()

> **deriveAliasesForWebpack**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:554](https://github.com/Xunnamius/projector/blob/dcaa0a5acffff6ad085fbc2675121bb9ec6c0aeb/packages/graph/src/alias.ts#L554)

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

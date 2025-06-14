[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForWebpack

# Function: deriveAliasesForWebpack()

> **deriveAliasesForWebpack**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:635](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/alias.ts#L635)

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

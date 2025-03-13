[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForWebpack

# Function: deriveAliasesForWebpack()

> **deriveAliasesForWebpack**(`rawAliasMappings`, `projectRoot`): `object`

Defined in: [packages/graph/src/alias.ts:554](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L554)

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

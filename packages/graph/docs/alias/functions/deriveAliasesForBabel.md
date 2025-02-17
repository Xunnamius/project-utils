[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForBabel

# Function: deriveAliasesForBabel()

> **deriveAliasesForBabel**(`rawAliasMappings`): `object`

Defined in: [packages/graph/src/alias.ts:506](https://github.com/Xunnamius/projector/blob/ea32adc50974a6b6b82e71ee97678647e4be8f84/packages/graph/src/alias.ts#L506)

Returns an object that can be plugged into
"babel-plugin-transform-rewrite-imports" Babel plugin configurations at
`replaceExtensions`.

See also:
https://www.npmjs.com/package/babel-plugin-transform-rewrite-imports

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`object`

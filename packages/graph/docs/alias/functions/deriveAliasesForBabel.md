[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForBabel

# Function: deriveAliasesForBabel()

> **deriveAliasesForBabel**(`rawAliasMappings`): `object`

Defined in: [packages/graph/src/alias.ts:585](https://github.com/Xunnamius/projector/blob/9157d42cdc0054cf96a3e2980daba7c8ae5a3e13/packages/graph/src/alias.ts#L585)

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

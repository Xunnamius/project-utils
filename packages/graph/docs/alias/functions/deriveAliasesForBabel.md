[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForBabel

# Function: deriveAliasesForBabel()

> **deriveAliasesForBabel**(`rawAliasMappings`): `object`

Defined in: [packages/graph/src/alias.ts:585](https://github.com/Xunnamius/projector/blob/b410307fe2da8a8f1d44526700e14694b1e77559/packages/graph/src/alias.ts#L585)

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

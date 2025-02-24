[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:534](https://github.com/Xunnamius/projector/blob/7505ea44374986d1d0ddf3a37cdd5d3729450f39/packages/graph/src/alias.ts#L534)

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`.

See also: https://www.npmjs.com/package/eslint-import-resolver-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`string`[][]

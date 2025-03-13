[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:534](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L534)

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`.

See also: https://www.npmjs.com/package/eslint-import-resolver-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`string`[][]

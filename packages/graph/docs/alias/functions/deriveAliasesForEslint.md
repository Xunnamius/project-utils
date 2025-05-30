[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:553](https://github.com/Xunnamius/projector/blob/2730a290426f956d4d09df6f5838fcf6186fbf1f/packages/graph/src/alias.ts#L553)

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`.

See also: https://www.npmjs.com/package/eslint-import-resolver-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`string`[][]

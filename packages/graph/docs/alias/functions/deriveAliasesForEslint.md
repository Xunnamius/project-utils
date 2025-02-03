[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:533](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L533)

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`.

See also: https://www.npmjs.com/package/eslint-import-resolver-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`string`[][]

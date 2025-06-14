[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:615](https://github.com/Xunnamius/projector/blob/e9ee21374a7ed831ce875c6adff409f48ae6e839/packages/graph/src/alias.ts#L615)

Returns an array that can be plugged into ESLint configurations at
`settings['import/resolver'].alias.map`. These days, the output of this
function is used primarily for import ordering and sorting via
eslint-plugin-import.

See also: https://www.npmjs.com/package/eslint-import-resolver-alias

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

## Returns

`string`[][]

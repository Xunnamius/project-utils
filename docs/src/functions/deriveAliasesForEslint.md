[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:250

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

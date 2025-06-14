[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / deriveAliasesForEslint

# Function: deriveAliasesForEslint()

> **deriveAliasesForEslint**(`rawAliasMappings`): `string`[][]

Defined in: [packages/graph/src/alias.ts:615](https://github.com/Xunnamius/projector/blob/929f57e95906b9d431b526feb4b0c2cf7ee47730/packages/graph/src/alias.ts#L615)

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

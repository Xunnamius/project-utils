[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): `undefined` \| [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)

Defined in: [packages/graph/src/alias.ts:745](https://github.com/Xunnamius/projector/blob/7b62fe0623286ad7bf6227972127d835f758db94/packages/graph/src/alias.ts#L745)

Accepts a _raw `specifier`_ and returns the first matching
[RawAliasMapping](../type-aliases/RawAliasMapping.md) (in precedence order) or `undefined` if `specifier`
does not match any `rawAliasMappings`

A "raw `specifier`" is the specifier string of an import statement before it
has been resolved to an actual filesystem path.

## Parameters

### rawAliasMappings

readonly [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)[]

### specifier

`string`

## Returns

`undefined` \| [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)

[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): `undefined` \| [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)

Defined in: [packages/graph/src/alias.ts:737](https://github.com/Xunnamius/projector/blob/514ccc0cc29a5be24dff01a84b9935be834df2b5/packages/graph/src/alias.ts#L737)

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

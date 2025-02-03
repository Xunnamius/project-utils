[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md) \| `undefined`

Defined in: [packages/graph/src/alias.ts:663](https://github.com/Xunnamius/projector/blob/c3d70cc0dc43081a6d4b8f7587b002c35d826272/packages/graph/src/alias.ts#L663)

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

[`RawAliasMapping`](../type-aliases/RawAliasMapping.md) \| `undefined`

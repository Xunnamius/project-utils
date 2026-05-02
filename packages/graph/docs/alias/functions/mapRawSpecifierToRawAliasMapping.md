[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md) \| `undefined`

Defined in: [packages/graph/src/alias.ts:737](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/graph/src/alias.ts#L737)

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

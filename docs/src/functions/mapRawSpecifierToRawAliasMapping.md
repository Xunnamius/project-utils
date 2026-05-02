[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): [`RawAliasMapping`](../type-aliases/RawAliasMapping.md) \| `undefined`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:298

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

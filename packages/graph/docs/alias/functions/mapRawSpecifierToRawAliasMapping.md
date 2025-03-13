[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / mapRawSpecifierToRawAliasMapping

# Function: mapRawSpecifierToRawAliasMapping()

> **mapRawSpecifierToRawAliasMapping**(`rawAliasMappings`, `specifier`): `undefined` \| [`RawAliasMapping`](../type-aliases/RawAliasMapping.md)

Defined in: [packages/graph/src/alias.ts:664](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L664)

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

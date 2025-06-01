[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / rawAliasToRegExp

# Function: rawAliasToRegExp()

> **rawAliasToRegExp**(`__namedParameters`): `RegExp`

Defined in: packages/graph/dist/packages/graph/src/alias.d.ts:404

Takes a [RawAlias](../type-aliases/RawAlias.md) partial and returns a regular expression that can be
matched against specifier strings. If `suffix` is `"open"`, the returned
expression will include a single matching group containing the full specifier
path without modification.

Any RegExp control characters in `alias` will be escaped.

## Parameters

### \_\_namedParameters

`Omit`\<[`RawAlias`](../type-aliases/RawAlias.md), `"regExp"`\>

## Returns

`RegExp`

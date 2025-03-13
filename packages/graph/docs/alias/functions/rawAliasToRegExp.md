[**@-xun/project-graph**](../../README.md)

***

[@-xun/project-graph](../../README.md) / [alias](../README.md) / rawAliasToRegExp

# Function: rawAliasToRegExp()

> **rawAliasToRegExp**(`__namedParameters`): `RegExp`

Defined in: [packages/graph/src/alias.ts:1014](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/alias.ts#L1014)

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

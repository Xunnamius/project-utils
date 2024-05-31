[**@projector-js/core**](../../README.md) • **Docs**

***

[@projector-js/core](../../README.md) / [alias-utils](../README.md) / getRawAliases

# Function: getRawAliases()

> **getRawAliases**(): `object`

A mapping of specifier aliases used throughout the project. Object keys
represent aliases while their corresponding values represent mappings to the
filesystem.

Since this is used by several tooling subsystems with several different alias
syntaxes (some even allowing regular expression syntax), the most permissive
of the syntaxes is used to define the generic "raw" aliases below. Later,
these are reduced to their tooling-specific syntaxes.

*__Raw Alias Syntax Rules__*

1. Each key contains no path separators (excluding rule #3)
2. Each key starts with word character or ^
3. Each key ends with "/(.*)$" (open-ended) or "$" (exact) or word character
4. Each value starts with "./" (relative path) or "<rootDir>" (repo root)
5. Each value ends with "/$1" or any other character except "/"
6. Values representing directory paths end with "/$1"
7. Values ending with "/$1" have corresponding keys ending with "/(.*)$" and
   vice-versa

Note: the raw alias syntax rules are a subset of Jest's module name mapping
syntax.

## Returns

`object`

### ^externals/(.\*)$

> **^externals/(.\*)$**: `string` = `'<rootDir>/external-scripts/$1'`

### ^multiverse/(.\*)$

> **^multiverse/(.\*)$**: `string` = `'<rootDir>/lib/$1'`

### ^package$

> **^package$**: `string` = `'./package.json'`

### ^pkgverse/(.\*)$

> **^pkgverse/(.\*)$**: `string` = `'<rootDir>/packages/$1'`

### ^testverse/(.\*)$

> **^testverse/(.\*)$**: `string` = `'<rootDir>/test/$1'`

### ^types/(.\*)$

> **^types/(.\*)$**: `string` = `'<rootDir>/types/$1'`

### ^universe/(.\*)$

> **^universe/(.\*)$**: `string` = `'<rootDir>/src/$1'`

## Source

[packages/core/src/alias-utils.ts:39](https://github.com/Xunnamius/projector/blob/eaae74353ca5b35a9a0ca3db8a554376fec1dd9b/packages/core/src/alias-utils.ts#L39)

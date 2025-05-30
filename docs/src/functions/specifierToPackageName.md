[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / specifierToPackageName

# Function: specifierToPackageName()

> **specifierToPackageName**(`specifier`): `string`

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-package-build-targets.d.ts:119

Takes a fully-resolved (i.e. _not an alias_) import specifier and returns its
package name. Accounts for imports of namespaced packages like `@babel/core`.

Useful for translating external NPM package import specifiers into the names
of the individual packages. Examples:

```
specifierToPackageName('next/jest') === 'next'
specifierToPackageName('@babel/core') === '@babel/core'
specifierToPackageName('/something/custom') === '/something/custom'
specifierToPackageName('./something/custom') === './something/custom'
```

## Parameters

### specifier

`string`

## Returns

`string`

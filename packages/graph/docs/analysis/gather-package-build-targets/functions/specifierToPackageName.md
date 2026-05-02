[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / specifierToPackageName

# Function: specifierToPackageName()

> **specifierToPackageName**(`specifier`): `string`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:630](https://github.com/Xunnamius/projector/blob/8b829a35843b6bd00f87495a6c64e0da9cfd40e7/packages/graph/src/analysis/gather-package-build-targets.ts#L630)

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

[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / specifierToPackageName

# Function: specifierToPackageName()

> **specifierToPackageName**(`specifier`): `string`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:582](https://github.com/Xunnamius/projector/blob/b164ec02958be4a3fc50929ad4f824678a7453d6/packages/graph/src/analysis/gather-package-build-targets.ts#L582)

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

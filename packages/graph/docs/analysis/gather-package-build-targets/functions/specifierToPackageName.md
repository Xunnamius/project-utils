[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-package-build-targets](../README.md) / specifierToPackageName

# Function: specifierToPackageName()

> **specifierToPackageName**(`specifier`): `string`

Defined in: [packages/graph/src/analysis/gather-package-build-targets.ts:630](https://github.com/Xunnamius/projector/blob/e784a5e8ae5bff24c71e3b35914b446e5dd59fe7/packages/graph/src/analysis/gather-package-build-targets.ts#L630)

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

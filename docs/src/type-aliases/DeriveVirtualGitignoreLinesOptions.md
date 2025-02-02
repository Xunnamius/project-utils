[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / DeriveVirtualGitignoreLinesOptions

# Type Alias: DeriveVirtualGitignoreLinesOptions

> **DeriveVirtualGitignoreLinesOptions**: `object`

Defined in: packages/fs/dist/packages/fs/src/system/derive-virtual-gitignore-lines.d.ts:3

## Type declaration

### includeUnknownPaths?

> `optional` **includeUnknownPaths**: `boolean`

If `true`, include any paths unknown to git.

#### Default

```ts
false
```

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

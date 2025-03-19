[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/derive-virtual-gitignore-lines](../README.md) / DeriveVirtualGitignoreLinesOptions

# Type Alias: DeriveVirtualGitignoreLinesOptions

> **DeriveVirtualGitignoreLinesOptions**: `object`

Defined in: [packages/fs/src/system/derive-virtual-gitignore-lines.ts:20](https://github.com/Xunnamius/projector/blob/124f6e6b6e700d669a6e7832c4ad15585be7dc80/packages/fs/src/system/derive-virtual-gitignore-lines.ts#L20)

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

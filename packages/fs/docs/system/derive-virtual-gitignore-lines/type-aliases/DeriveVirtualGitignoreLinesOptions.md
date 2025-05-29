[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/derive-virtual-gitignore-lines](../README.md) / DeriveVirtualGitignoreLinesOptions

# Type Alias: DeriveVirtualGitignoreLinesOptions

> **DeriveVirtualGitignoreLinesOptions** = `object`

Defined in: [packages/fs/src/system/derive-virtual-gitignore-lines.ts:20](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/derive-virtual-gitignore-lines.ts#L20)

## Properties

### includeUnknownPaths?

> `optional` **includeUnknownPaths**: `boolean`

Defined in: [packages/fs/src/system/derive-virtual-gitignore-lines.ts:35](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/derive-virtual-gitignore-lines.ts#L35)

If `true`, include any paths unknown to git.

#### Default

```ts
false
```

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/fs/src/system/derive-virtual-gitignore-lines.ts:29](https://github.com/Xunnamius/projector/blob/f013ed7e8b6ac84d9c4de9e0d2d07c58f119f38c/packages/fs/src/system/derive-virtual-gitignore-lines.ts#L29)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

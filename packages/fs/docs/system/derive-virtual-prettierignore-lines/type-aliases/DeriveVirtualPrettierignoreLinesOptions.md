[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/derive-virtual-prettierignore-lines](../README.md) / DeriveVirtualPrettierignoreLinesOptions

# Type Alias: DeriveVirtualPrettierignoreLinesOptions

> **DeriveVirtualPrettierignoreLinesOptions**: `object`

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:20](https://github.com/Xunnamius/projector/blob/f4ac1fc5dfe0c775c2a6a91230908c438ca26815/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L20)

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

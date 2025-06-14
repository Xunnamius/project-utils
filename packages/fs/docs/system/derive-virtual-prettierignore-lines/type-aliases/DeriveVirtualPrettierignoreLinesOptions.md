[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/derive-virtual-prettierignore-lines](../README.md) / DeriveVirtualPrettierignoreLinesOptions

# Type Alias: DeriveVirtualPrettierignoreLinesOptions

> **DeriveVirtualPrettierignoreLinesOptions** = `object`

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:20](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L20)

## Properties

### includeUnknownPaths?

> `optional` **includeUnknownPaths**: `boolean`

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:35](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L35)

If `true`, include any paths unknown to git.

#### Default

```ts
false
```

***

### useCached

> **useCached**: `boolean`

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:29](https://github.com/Xunnamius/projector/blob/9d3f5062654f593f52477505927007c896136ff7/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L29)

Use the internal cached result from a previous run, if available.

Unless `useCached` is `false`, the results returned by this function will
always strictly equal (`===`) each other with respect to call signature.

#### See

cache

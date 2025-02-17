[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/derive-virtual-prettierignore-lines](../../../README.md) / [deriveVirtualPrettierignoreLines](../README.md) / sync

# Function: sync()

> **sync**(`projectRoot`, `options`): `string`[]

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:160](https://github.com/Xunnamius/projector/blob/1a87550070866e204d98f54387d23c3c57e13502/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L160)

Synchronously return an array of the lines of a `.prettierignore` file, or
an empty array if an error occurs. The string '.git' is prepended to the
result.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### projectRoot

`AbsolutePath`

### options

`Omit`\<[`DeriveVirtualPrettierignoreLinesOptions`](../../../type-aliases/DeriveVirtualPrettierignoreLinesOptions.md), `"includeUnknownPaths"`\>

## Returns

`string`[]

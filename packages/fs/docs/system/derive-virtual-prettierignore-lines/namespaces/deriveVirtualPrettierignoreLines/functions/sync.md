[**@-xun/project-fs**](../../../../../README.md)

***

[@-xun/project-fs](../../../../../README.md) / [system/derive-virtual-prettierignore-lines](../../../README.md) / [deriveVirtualPrettierignoreLines](../README.md) / sync

# Function: sync()

> **sync**(`projectRoot`, `options`): `string`[]

Defined in: [packages/fs/src/system/derive-virtual-prettierignore-lines.ts:160](https://github.com/Xunnamius/projector/blob/c2c01047121dc52d072be87749a60b62bccc5a6e/packages/fs/src/system/derive-virtual-prettierignore-lines.ts#L160)

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

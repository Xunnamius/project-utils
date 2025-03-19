[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [deriveVirtualPrettierignoreLines](../README.md) / sync

# Variable: sync()

> `const` **sync**: (`projectRoot`, `options`) => `Awaited`\<`ReturnType`\<*typeof* [`deriveVirtualPrettierignoreLines`](../../../functions/deriveVirtualPrettierignoreLines.md)\>\>

Defined in: packages/fs/dist/packages/fs/src/system/derive-virtual-prettierignore-lines.d.ts:48

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

`Awaited`\<`ReturnType`\<*typeof* [`deriveVirtualPrettierignoreLines`](../../../functions/deriveVirtualPrettierignoreLines.md)\>\>

[**@-xun/project**](../../README.md)

***

[@-xun/project](../../README.md) / [src](../README.md) / deriveVirtualPrettierignoreLines

# Function: deriveVirtualPrettierignoreLines()

> **deriveVirtualPrettierignoreLines**(...`args`): `Promise`\<`string`[]\>

Defined in: packages/fs/dist/packages/fs/src/system/derive-virtual-prettierignore-lines.d.ts:35

Asynchronously return an array of the lines of a `.prettierignore` file, or
an empty array if an error occurs. The string '.git' is prepended to the
result.

You can optionally include paths unknown to git as well via
`includeUnknownPaths`.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`AbsolutePath`, [`DeriveVirtualPrettierignoreLinesOptions`](../type-aliases/DeriveVirtualPrettierignoreLinesOptions.md)\]

## Returns

`Promise`\<`string`[]\>

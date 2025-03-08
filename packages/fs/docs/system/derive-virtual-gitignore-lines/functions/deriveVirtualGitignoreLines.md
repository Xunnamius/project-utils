[**@-xun/project-fs**](../../../README.md)

***

[@-xun/project-fs](../../../README.md) / [system/derive-virtual-gitignore-lines](../README.md) / deriveVirtualGitignoreLines

# Function: deriveVirtualGitignoreLines()

> **deriveVirtualGitignoreLines**(...`args`): `Promise`\<`string`[]\>

Defined in: [packages/fs/src/system/derive-virtual-gitignore-lines.ts:140](https://github.com/Xunnamius/projector/blob/f4ac1fc5dfe0c775c2a6a91230908c438ca26815/packages/fs/src/system/derive-virtual-gitignore-lines.ts#L140)

Asynchronously return an array of the lines of a `.gitignore` file, or an
empty array if an error occurs. The string '.git' is prepended to the result.

You can optionally include paths unknown to git as well via
`includeUnknownPaths`.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`AbsolutePath`, [`DeriveVirtualGitignoreLinesOptions`](../type-aliases/DeriveVirtualGitignoreLinesOptions.md)\]

## Returns

`Promise`\<`string`[]\>

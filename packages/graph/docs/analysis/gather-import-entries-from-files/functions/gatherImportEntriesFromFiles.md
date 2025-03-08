[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-import-entries-from-files](../README.md) / gatherImportEntriesFromFiles

# Function: gatherImportEntriesFromFiles()

> **gatherImportEntriesFromFiles**(...`args`): `Promise`\<[`ImportSpecifiersEntry`](../type-aliases/ImportSpecifiersEntry.md)[]\>

Defined in: [packages/graph/src/analysis/gather-import-entries-from-files.ts:219](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/analysis/gather-import-entries-from-files.ts#L219)

Accepts zero or more file paths and asynchronously returns an array of
[ImportSpecifiersEntry](../type-aliases/ImportSpecifiersEntry.md)s each mapping a given file path to an array of
import/require specifiers present in said file.

This function relies on Babel internally and ignores all configuration files.
All paths passed to this function that cannot be parsed as TSX/TS/JS (via
extension check) will be treated as if they have 0 imports.

**NOTE: the result of this function is memoized! This does NOT _necessarily_
mean results will strictly equal each other. See `useCached` in this specific
function's options for details.** To fetch fresh results, set the `useCached`
option to `false` or clear the internal cache with cache.clear.

## Parameters

### args

...\[`AbsolutePath`[], [`GatherImportEntriesFromFilesOptions`](../type-aliases/GatherImportEntriesFromFilesOptions.md)\]

## Returns

`Promise`\<[`ImportSpecifiersEntry`](../type-aliases/ImportSpecifiersEntry.md)[]\>

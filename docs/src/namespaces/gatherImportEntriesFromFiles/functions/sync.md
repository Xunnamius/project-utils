[**@-xun/project**](../../../../README.md)

***

[@-xun/project](../../../../README.md) / [src](../../../README.md) / [gatherImportEntriesFromFiles](../README.md) / sync

# Function: sync()

> **sync**(...`arguments_`): [`ImportSpecifiersEntry`](../../../type-aliases/ImportSpecifiersEntry.md)[]

Defined in: packages/graph/dist/packages/graph/src/analysis/gather-import-entries-from-files.d.ts:69

Accepts zero or more file paths and synchronously returns an array of
[ImportSpecifiersEntry](../../../type-aliases/ImportSpecifiersEntry.md)s each mapping a given file path to an array
of import/require specifiers present in said file.

This function relies on Babel internally and ignores all configuration
files. All paths passed to this function that cannot be parsed as TSX/TS/JS
(via extension check) will be treated as if they have 0 imports.

**NOTE: the result of this function is memoized! This does NOT
_necessarily_ mean results will strictly equal each other. See `useCached`
in this specific function's options for details.** To fetch fresh results,
set the `useCached` option to `false` or clear the internal cache with
cache.clear.

## Parameters

### arguments\_

...\[`AbsolutePath`[], [`GatherImportEntriesFromFilesOptions`](../../../type-aliases/GatherImportEntriesFromFilesOptions.md)\]

## Returns

[`ImportSpecifiersEntry`](../../../type-aliases/ImportSpecifiersEntry.md)[]

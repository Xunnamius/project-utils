[**@-xun/project-graph**](../../../README.md)

***

[@-xun/project-graph](../../../README.md) / [analysis/gather-import-entries-from-files](../README.md) / GatherImportEntriesFromFilesOptions

# Type Alias: GatherImportEntriesFromFilesOptions

> **GatherImportEntriesFromFilesOptions**: `AccumulatorOptions` & `object`

Defined in: [packages/graph/src/analysis/gather-import-entries-from-files.ts:46](https://github.com/Xunnamius/projector/blob/75b2ac9b21c6609d9b8cc2f9871d2d58f0db3dfa/packages/graph/src/analysis/gather-import-entries-from-files.ts#L46)

## Type declaration

### useCached

> **useCached**: `boolean`

Use the internal cached result from a previous run, if available.

**WARNING: the results returned by this function, while functionally
identical to each other, will _NOT_ strictly equal (`===`) each other.**
However, each [ImportSpecifiersEntry](ImportSpecifiersEntry.md) tuple within the returned
results _will_ strictly equal each other, respectively.

#### See

cache

## See

[gatherImportEntriesFromFiles](../functions/gatherImportEntriesFromFiles.md)
